import type {
  DeadlineFilter as FilterType,
} from '../../types/deadline'

interface DeadlineFilterProps {
  value: FilterType
  onChange: (
    value: FilterType
  ) => void
}

export function DeadlineFilter({
  value,
  onChange,
}: DeadlineFilterProps) {
  return (
    <div className="filters" role="group" aria-label="Lọc bài tập">
      <button
        className={
          value === 'all' ? 'active' : ''
        }
        aria-pressed={value === 'all'}
        onClick={() => onChange('all')}
      >
        Tất cả
      </button>

      <button
        className={
          value === 'pending'
            ? 'active'
            : ''
        }
        onClick={() =>
          onChange('pending')
        }
      >
        Chưa hoàn thành
      </button>

      <button
        className={
          value === 'overdue'
            ? 'active'
            : ''
        }
        onClick={() =>
          onChange('overdue')
        }
      >
        Quá hạn
      </button>

      <button
        className={
          value === 'completed'
            ? 'active'
            : ''
        }
        onClick={() =>
          onChange('completed')
        }
      >
        Đã hoàn thành
      </button>
    </div>
  )
}