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
    <div className="filters">
      <button
        className={
          value === 'all' ? 'active' : ''
        }
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