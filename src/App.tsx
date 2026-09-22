import { useEffect, useMemo, useState } from 'react'

import {
  useAppDispatch,
  useAppSelector,
} from './app/hooks'

import {
  addDeadline,
  deleteDeadline,
  fetchDeadlines,
  toggleDeadline,
} from './features/deadlines/deadlineSlice'

import {
  selectDeadlines,
  selectDeadlineError,
  selectDeadlineStatus,
} from './features/deadlines/deadlineSelectors'

import { DeadlineForm } from './features/deadlines/DeadlineForm'
import { DeadlineFilter } from './features/deadlines/DeadlineFilter'
import DeadlineList from './features/deadlines/DeadlineList'

import type {
  CreateDeadlineInput,
  DeadlineFilter as FilterType,
} from './types/deadline'

import { getDaysDifference } from './utils/dateUtils'

import { useDeadlineStats } from './hooks/useDeadlineStats'

import { withLoading } from './components/withLoading'

import './App.css'

const DeadlineListWithLoading =
  withLoading(DeadlineList)

function App() {
  const dispatch = useAppDispatch()

  const deadlines =
    useAppSelector(selectDeadlines)

  const status =
    useAppSelector(selectDeadlineStatus)

  const error =
    useAppSelector(selectDeadlineError)

  const [filter, setFilter] =
    useState<FilterType>('all')

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchDeadlines())
    }
  }, [dispatch, status])

  const stats =
    useDeadlineStats(deadlines)

  const filteredDeadlines =
    useMemo(() => {
      switch (filter) {
        case 'pending':
          return deadlines.filter(
            (item) => !item.completed
          )

        case 'completed':
          return deadlines.filter(
            (item) => item.completed
          )

        case 'overdue':
          return deadlines.filter(
            (item) =>
              !item.completed &&
              getDaysDifference(
                item.deadline
              ) < 0
          )

        default:
          return deadlines
      }
    }, [deadlines, filter])

  const handleAdd = async (
    data: CreateDeadlineInput
  ) => {
    await dispatch(addDeadline(data)).unwrap()
  }

  const handleToggle = (id: string) => {
    dispatch(toggleDeadline(id))
  }

  const handleDelete = (id: string) => {
    dispatch(deleteDeadline(id))
  }

  return (
    <main className="app">
      <header className="app-header">
        <div>
          <span className="eyebrow">
            Personal planner
          </span>

          <h1>Student Deadline Tracker</h1>

          <p>
            Theo dõi bài tập, ưu tiên việc cần làm và
            tránh nộp trễ.
          </p>
        </div>
      </header>

      <section
        className="stats"
        aria-label="Tổng quan deadline"
      >
        <div className="stat-card">
          <strong>{stats.total}</strong>
          <span>Tổng số</span>
        </div>

        <div className="stat-card">
          <strong>{stats.pending}</strong>
          <span>Chưa hoàn thành</span>
        </div>

        <div className="stat-card urgent">
          <strong>{stats.overdue}</strong>
          <span>Quá hạn</span>
        </div>

        <div className="stat-card">
          <strong>{stats.completed}</strong>
          <span>Đã hoàn thành</span>
        </div>

        <div className="stat-card">
          <strong>{stats.highPriority}</strong>
          <span>Ưu tiên cao</span>
        </div>
      </section>

      <DeadlineForm
        onSubmit={handleAdd}
        apiError={error}
      />

      <DeadlineFilter
        value={filter}
        onChange={setFilter}
      />

      <DeadlineListWithLoading
        deadlines={filteredDeadlines}
        onToggle={handleToggle}
        onDelete={handleDelete}
        loading={status === 'loading'}
      />
    </main>
  )
}

export default App
