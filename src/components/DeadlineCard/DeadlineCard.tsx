import type { Deadline } from '../../types/deadline'
import {
  getDeadlineLabel,
  getDaysDifference,
} from '../../utils/dateUtils'

import './DeadlineCard.css'

const priorityLabel = {
  low: 'Thấp',
  medium: 'Trung bình',
  high: 'Cao',
}

interface DeadlineCardProps {
  deadline: Deadline
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export function DeadlineCard({
  deadline,
  onToggle,
  onDelete,
}: DeadlineCardProps) {
  const days = getDaysDifference(
    deadline.deadline
  )

  const isOverdue =
    !deadline.completed && days < 0

  return (
    <article
      className={`deadline-card ${
        deadline.completed
          ? 'completed'
          : isOverdue
          ? 'overdue'
          : ''
      }`}
    >
      <div className="deadline-header">
        <span className="subject">
          {deadline.subject}
        </span>

        <span
          className={`priority ${deadline.priority}`}
        >
          {priorityLabel[deadline.priority]}
        </span>
      </div>

      <h3>{deadline.title}</h3>

      <div className="deadline-meta">
        <span>
          Hạn nộp:{' '}
          {new Date(
            `${deadline.deadline}T00:00:00`
          ).toLocaleDateString('vi-VN')}
        </span>

        <span
          className={`status ${
            deadline.completed ? 'done' : 'todo'
          }`}
        >
          {deadline.completed
            ? 'Đã hoàn thành'
            : 'Chưa hoàn thành'}
        </span>
      </div>

      <strong className="deadline-days">
        {getDeadlineLabel(deadline.deadline)}
      </strong>

      <div className="actions">
        <button
          className="complete-button"
          onClick={() =>
            onToggle(deadline.id)
          }
        >
          {deadline.completed
            ? 'Bỏ hoàn thành'
            : 'Hoàn thành'}
        </button>

        <button
          className="delete-button"
          onClick={() =>
            onDelete(deadline.id)
          }
        >
          Xóa
        </button>
      </div>
    </article>
  )
}
