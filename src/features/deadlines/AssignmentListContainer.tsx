import type { Deadline } from '../../types/deadline'
import { useEffect, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { fetchDeadlines, toggleDeadline, deleteDeadline } from './deadlineSlice'
import AssignmentList from './DeadlineList'
export function AssignmentListContainer({ deadlines }: { deadlines?: Deadline[] }) {
  const dispatch = useAppDispatch()
  const { items, status, error } = useAppSelector(state => state.deadlines)
  useEffect(() => { if (status === 'idle') void dispatch(fetchDeadlines()) }, [dispatch, status])
  const onToggle = useCallback((id: string) => { dispatch(toggleDeadline(id)) }, [dispatch])
  const onDelete = useCallback((id: string) => { dispatch(deleteDeadline(id)) }, [dispatch])
  if (status === 'loading') return <p className="loading" role="status">Đang tải</p>
  if (status === 'failed') return <p className="form-error api-error" role="alert">{error}</p>
  return <AssignmentList deadlines={deadlines ?? items} onToggle={onToggle} onDelete={onDelete} />
}
