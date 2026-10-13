import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { act, fireEvent, render, renderHook, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import reducer, { addDeadline, deleteDeadline, replaceDeadlines, toggleDeadline } from '../src/features/deadlines/deadlineSlice'
import { calcDaysLeft, calcStats, isOverdue } from '../src/features/deadlines/stats'
import { generateAssignments } from '../src/features/deadlines/sampleData'
import { AssignmentCard } from '../src/components/DeadlineCard/DeadlineCard'
import { DeadlineForm } from '../src/features/deadlines/DeadlineForm'
import { DeadlineFilter } from '../src/features/deadlines/DeadlineFilter'
import AssignmentList from '../src/features/deadlines/DeadlineList'
import { usePinStore } from '../src/stores/usePinStore'
import { useDebounce } from '../src/hooks/useDebounce'
import { AssignmentListContainer } from '../src/features/deadlines/AssignmentListContainer'
const item = { id: '1', title: 'React test', subject: 'React', deadline: '2026-10-13', priority: 'high' as const, completed: false }
beforeEach(() => { usePinStore.setState({ pinnedIds: [] }) })
afterEach(() => { jest.useRealTimers(); jest.restoreAllMocks() })
test('days left: today, past, future', () => {
  jest.useFakeTimers().setSystemTime(new Date(2026, 9, 13, 12))
  expect(calcDaysLeft('2026-10-13')).toBe(0)
  expect(calcDaysLeft('2026-10-12')).toBe(-1)
  expect(calcDaysLeft('2026-10-15')).toBe(2)
})
test('overdue excludes completed and today', () => {
  jest.useFakeTimers().setSystemTime(new Date(2026, 9, 14))
  expect(isOverdue(item)).toBe(true)
  expect(isOverdue({ ...item, completed: true })).toBe(false)
  expect(isOverdue({ ...item, deadline: '2026-10-14' })).toBe(false)
})
test('empty stats', () => expect(calcStats([])).toEqual({ total: 0, completed: 0, overdue: 0, bySubject: {} }))
test('stats groups subjects and counts', () => {
  jest.useFakeTimers().setSystemTime(new Date(2026, 9, 14))
  expect(calcStats([item, { ...item, completed: true }])).toEqual({ total: 2, completed: 1, overdue: 1, bySubject: { React: 2 } })
})
test('reducer toggle twice and unknown id', () => {
  let state = reducer(undefined, replaceDeadlines([item]))
  expect(reducer(state, toggleDeadline('missing'))).toEqual(state)
  state = reducer(state, toggleDeadline('1')); expect(state.items[0].completed).toBe(true)
  expect(reducer(state, toggleDeadline('1')).items[0].completed).toBe(false)
})
test('delete unknown and existing', () => {
  const state = reducer(undefined, replaceDeadlines([item]))
  expect(reducer(state, deleteDeadline('missing')).items).toHaveLength(1)
  expect(reducer(state, deleteDeadline('1')).items).toEqual([])
})
test('add success and failure reducer', () => {
  const state = reducer(undefined, addDeadline.fulfilled(item, '', item))
  expect(state.items).toEqual([item])
  expect(reducer(state, addDeadline.rejected(new Error('failed'), '', item)).error).toBe('failed')
})
test('sample data has 10000 unique ids', () => expect(new Set(generateAssignments().map(x => x.id)).size).toBe(10000))
test('card displays title and subject', () => {
  render(<AssignmentCard deadline={item} onToggle={jest.fn()} onDelete={jest.fn()} />)
  expect(screen.getByText('React test')).toBeInTheDocument(); expect(screen.getByText('React')).toBeInTheDocument()
})
test('card complete and delete callbacks', async () => {
  const toggle = jest.fn(), remove = jest.fn(), user = userEvent.setup()
  render(<AssignmentCard deadline={item} onToggle={toggle} onDelete={remove} />)
  await user.click(screen.getByText('Hoàn thành')); await user.click(screen.getByText('Xóa'))
  expect(toggle).toHaveBeenCalledWith('1'); expect(remove).toHaveBeenCalledWith('1')
})
test('card pin toggles Zustand state', async () => {
  render(<AssignmentCard deadline={item} onToggle={jest.fn()} onDelete={jest.fn()} />)
  await userEvent.click(screen.getByRole('button', { name: 'Ghim' }))
  expect(usePinStore.getState().isPinned('1')).toBe(true)
  await userEvent.click(screen.getByRole('button', { name: 'Bỏ ghim' }))
  expect(usePinStore.getState().isPinned('1')).toBe(false)
})
test('form rejects whitespace', async () => {
  const submit = jest.fn(); render(<DeadlineForm onSubmit={submit} />)
  await userEvent.type(screen.getByLabelText('Môn học'), '   ')
  fireEvent.submit(screen.getByRole('button', { name: 'Thêm bài tập' }).closest('form')!)
  expect(await screen.findByText(/Vui lòng nhập đủ/)).toBeInTheDocument(); expect(submit).not.toHaveBeenCalled()
})
async function fillForm() {
  await userEvent.type(screen.getByLabelText('Môn học'), 'React')
  await userEvent.type(screen.getByLabelText('Tên bài tập'), '  Hooks  ')
  fireEvent.change(screen.getByLabelText('Hạn nộp'), { target: { value: '2026-12-31' } })
  await userEvent.click(screen.getByRole('button', { name: 'Thêm bài tập' }))
}
test('form submits trimmed data and resets', async () => {
  const submit = jest.fn().mockResolvedValue(undefined); render(<DeadlineForm onSubmit={submit} />); await fillForm()
  expect(submit).toHaveBeenCalledWith({ subject: 'React', title: 'Hooks', deadline: '2026-12-31', priority: 'medium' })
  await waitFor(() => expect(screen.getByLabelText('Môn học')).toHaveValue(''))
})
test('form shows API rejection', async () => {
  render(<DeadlineForm onSubmit={jest.fn().mockRejectedValue(new Error())} />); await fillForm()
  expect(await screen.findByText(/Không thể thêm bài tập/)).toBeInTheDocument()
})
test('debounce cancels previous timer and updates at 300ms', () => {
  jest.useFakeTimers()
  const { result, rerender, unmount } = renderHook(({ value }) => useDebounce(value), { initialProps: { value: 'a' } })
  rerender({ value: 'ab' }); act(() => jest.advanceTimersByTime(200)); rerender({ value: 'abc' })
  act(() => jest.advanceTimersByTime(299)); expect(result.current).toBe('a')
  act(() => jest.advanceTimersByTime(1)); expect(result.current).toBe('abc'); unmount(); expect(jest.getTimerCount()).toBe(0)
})
function setupApi() {
  const store = configureStore({ reducer: { deadlines: reducer } })
  render(<Provider store={store}><AssignmentListContainer /></Provider>); return store
}
test('API list loading then success', async () => {
  let resolve!: (value: unknown) => void
  global.fetch = jest.fn(() => new Promise(r => { resolve = r })) as jest.Mock
  setupApi(); expect(screen.getByText('Đang tải')).toBeInTheDocument()
  await act(async () => resolve({ ok: true, json: async () => [item] }))
  expect(await screen.findByText('React test')).toBeInTheDocument()
})
test('API list displays error', async () => {
  global.fetch = jest.fn().mockResolvedValue({ ok: false }); setupApi()
  expect(await screen.findByRole('alert')).toHaveTextContent('Không thể tải')
})
test('empty list', () => { render(<AssignmentList deadlines={[]} onToggle={jest.fn()} onDelete={jest.fn()} />); expect(screen.getByText('Không có bài tập nào.')).toBeInTheDocument() })
test('filter changes selection', async () => {
  const change = jest.fn(); render(<DeadlineFilter value="all" onChange={change} />)
  await userEvent.click(screen.getByText('Đã hoàn thành')); expect(change).toHaveBeenCalledWith('completed')
})

test('statistics page shows subject totals', async () => {
  const { default: StatisticsPage } = await import('../src/features/deadlines/StatisticsPage')
  const store = configureStore({ reducer: { deadlines: reducer } })
  store.dispatch(replaceDeadlines([item]))
  render(<Provider store={store}><StatisticsPage /></Provider>)
  expect(screen.getByText('React: 1')).toBeInTheDocument()
})
test('legacy stats hook counts all categories', async () => {
  const { useDeadlineStats } = await import('../src/features/deadlines/DeadlineStats')
  jest.useFakeTimers().setSystemTime(new Date(2026, 9, 14))
  const { result } = renderHook(() => useDeadlineStats([item, { ...item, completed: true }]))
  expect(result.current).toEqual({ total: 2, completed: 1, pending: 1, overdue: 1, highPriority: 1 })
})
test('POST sends assignment and handles server error', async () => {
  const store = configureStore({ reducer: { deadlines: reducer } })
  global.fetch = jest.fn().mockResolvedValueOnce({ ok: true, json: async () => item }).mockResolvedValueOnce({ ok: false })
  await store.dispatch(addDeadline(item))
  expect(fetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ method: 'POST', body: expect.stringContaining('React test') }))
  await store.dispatch(addDeadline(item))
  expect(store.getState().deadlines.error).toBe('Không thể thêm bài tập')
})
