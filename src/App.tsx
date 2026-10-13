import { ThemeToggle } from './contexts/ThemeProvider'
import { useDebounce } from './hooks/useDebounce'
import { usePinStore } from './stores/usePinStore'
import { generateAssignments } from './features/deadlines/sampleData'
import { useCallback, lazy, Suspense, useMemo, useState } from 'react'

import {
  useAppDispatch,
  useAppSelector,
} from './app/hooks'

import {
  addDeadline,
  replaceDeadlines,
} from './features/deadlines/deadlineSlice'

import {
  selectDeadlines,
  selectDeadlineError,
  selectDeadlineStatus,
} from './features/deadlines/deadlineSelectors'

import { DeadlineForm } from './features/deadlines/DeadlineForm'
import { DeadlineFilter } from './features/deadlines/DeadlineFilter'
import { AssignmentListContainer } from './features/deadlines/AssignmentListContainer'

import type {
  CreateDeadlineInput,
  DeadlineFilter as FilterType,
} from './types/deadline'

import { getDaysDifference } from './utils/dateUtils'

import { useDeadlineStats } from './hooks/useDeadlineStats'


import './App.css'


const StatisticsPage = lazy(() => import('./features/deadlines/StatisticsPage'))
function App() {
  const [page, setPage] = useState('list')
  const [search, setSearch] = useState('')
  const query = useDebounce(search).trim().toLocaleLowerCase()
  const pinnedIds = usePinStore(state => state.pinnedIds)
  const dispatch = useAppDispatch()
  const status = useAppSelector(selectDeadlineStatus)

  const deadlines =
    useAppSelector(selectDeadlines)


  const error =
    useAppSelector(selectDeadlineError)

  const [filter, setFilter] =
    useState<FilterType>('all')

  const stats =
    useDeadlineStats(deadlines)

  const filteredDeadlines =
    useMemo(() => {
      const pinned = new Set(pinnedIds)
      const candidates = deadlines.filter(item => `${item.title} ${item.subject}`.toLocaleLowerCase().includes(query))
      const sorted = [...candidates.filter(item => pinned.has(item.id)), ...candidates.filter(item => !pinned.has(item.id))]
      switch (filter) {
        case 'pending':
          return sorted.filter(
            (item) => !item.completed
          )

        case 'completed':
          return sorted.filter(
            (item) => item.completed
          )

        case 'overdue':
          return sorted.filter(
            (item) =>
              !item.completed &&
              getDaysDifference(
                item.deadline
              ) < 0
          )

        default:
          return sorted
      }
    }, [deadlines, filter, query, pinnedIds])

  const handleAdd = useCallback(async (
    data: CreateDeadlineInput
  ) => {
    await dispatch(addDeadline(data)).unwrap()
  }, [dispatch])

  const progress = stats.total ? Math.round(stats.completed / stats.total * 100) : 0

  return (
    <main className="app">
      <nav className="topbar" aria-label="Điều hướng chính">
        <a className="brand" href="#"><span className="brand-mark" aria-hidden="true">▦</span><span>Deadline<span className="brand-subtitle">STUDENT PLANNER</span></span></a>
        <div className="nav-links">
          <button className={page === 'list' ? 'nav-button active' : 'nav-button'} aria-current={page === 'list' ? 'page' : undefined} onClick={() => setPage('list')}>Danh sách</button>
          <button className={page === 'stats' ? 'nav-button active' : 'nav-button'} aria-current={page === 'stats' ? 'page' : undefined} onClick={() => setPage('stats')}>Thống kê</button>
        </div>
        <ThemeToggle />
      </nav>

      <header className="app-header">
        <div>
          <span className="eyebrow"><span className="live-dot" />GÓC HỌC TẬP CỦA BẠN</span>
          <h1>{page === 'list' ? 'Một chút kế hoạch.' : 'Nhìn lại tiến độ.'}<br /><span>{page === 'list' ? 'Bớt một chút áp lực.' : 'Tiến thêm mỗi ngày.'}</span></h1>
          <p>Theo dõi bài tập, giữ những việc quan trọng trong tầm mắt.</p>
        </div>
        <div className="progress-summary">
          <div className="progress-ring" style={{ background: `conic-gradient(var(--accent) ${progress}%, var(--border) 0)` }}><strong>{progress}<small>%</small></strong></div>
          <div><span className="progress-caption">TIẾN ĐỘ HỌC TẬP</span><p><strong>{stats.completed.toLocaleString('vi-VN')}</strong> / {stats.total.toLocaleString('vi-VN')} bài đã xong</p><span className="muted">Từng bước nhỏ, kết quả lớn.</span></div>
        </div>
      </header>

      <section className="stats" aria-label="Tổng quan deadline">
        {[
          { label: 'Tổng bài tập', value: stats.total, symbol: '▦', tone: 'neutral' },
          { label: 'Chưa hoàn thành', value: stats.pending, symbol: '◷', tone: 'pending' },
          { label: 'Quá hạn', value: stats.overdue, symbol: '!', tone: 'urgent' },
          { label: 'Đã hoàn thành', value: stats.completed, symbol: '✓', tone: 'success' },
          { label: 'Ưu tiên cao', value: stats.highPriority, symbol: '⚑', tone: 'priority' },
        ].map(stat => <div key={stat.label} className={`stat-card ${stat.tone}`}><div className="stat-top"><span>{stat.label}</span><span className="stat-symbol" aria-hidden="true">{stat.symbol}</span></div><strong>{stat.value.toLocaleString('vi-VN')}</strong></div>)}
      </section>

      {page === 'stats' ? <Suspense fallback={<p className="loading" role="status">Đang tải thống kê...</p>}><StatisticsPage /></Suspense> :
        <div className="workspace">
          <aside className="form-column">
            <DeadlineForm onSubmit={handleAdd} apiError={error} />
            <div className="planner-tip"><span aria-hidden="true">✧</span><div><strong>Dành chỗ cho điều quan trọng</strong><p>Ghim bài tập cần ưu tiên để luôn thấy chúng ở đầu danh sách.</p></div></div>
          </aside>
          <section className="list-panel" aria-labelledby="list-heading">
            <div className="list-heading"><div><span className="eyebrow">SẮP XẾP & TẬP TRUNG</span><h2 id="list-heading">Bài tập của bạn <span className="count-badge">{filteredDeadlines.length.toLocaleString('vi-VN')}</span></h2></div><span className="list-note">Ghim để ưu tiên</span></div>
            <label className="search-field"><span className="search-icon" aria-hidden="true" /><span className="sr-only">Tìm kiếm</span><input value={search} placeholder="Tìm theo tên bài tập hoặc môn học..." onChange={event => setSearch(event.target.value)} />{search && <button type="button" aria-label="Xóa tìm kiếm" onClick={() => setSearch('')}>×</button>}</label>
            <DeadlineFilter value={filter} onChange={setFilter} />
            <AssignmentListContainer deadlines={filteredDeadlines} />
            <div className="stress-tools"><div><strong>Thử sức với danh sách lớn</strong><p>Tạo dữ liệu mẫu để trải nghiệm 10.000 bài tập.</p></div><button className="secondary-button" disabled={status === 'loading'} onClick={() => dispatch(replaceDeadlines(generateAssignments()))}>Tạo 10.000 bài tập mẫu</button></div>
          </section>
        </div>
      }
      <footer className="app-footer"><span>Deadline · Không bỏ lỡ điều quan trọng.</span><span>Học tập có kế hoạch, mỗi ngày.</span></footer>
    </main>
  )
}

export default App
