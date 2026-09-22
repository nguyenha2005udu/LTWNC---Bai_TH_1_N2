import type { Deadline } from '../../types/deadline'
import { DeadlineCard } from '../../components/DeadlineCard/DeadlineCard'

interface DeadlineListProps {
  deadlines: Deadline[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export function DeadlineList({
  deadlines,
  onToggle,
  onDelete,
}: DeadlineListProps) {
  if (deadlines.length === 0) {
    return (
      <p className="empty">
        Không có bài tập nào.
      </p>
    )
  }

  return (
    <div className="deadline-list">
      {deadlines.map((deadline) => (
        <DeadlineCard
          key={deadline.id}
          deadline={deadline}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
export default DeadlineList