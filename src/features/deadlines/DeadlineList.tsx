import { FixedSizeList, type ListChildComponentProps } from 'react-window'
import type { Deadline } from '../../types/deadline'
import { DeadlineCard } from '../../components/DeadlineCard/DeadlineCard'
interface DeadlineListProps {
  deadlines: Deadline[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}
function Row({ index, style, data }: ListChildComponentProps<DeadlineListProps>) {
  return <div style={{ ...style, padding: '8px', boxSizing: 'border-box' }}><DeadlineCard deadline={data.deadlines[index]} onToggle={data.onToggle} onDelete={data.onDelete} /></div>
}
export function AssignmentList(props: DeadlineListProps) {
  if (!props.deadlines.length) return <p className="empty">Không có bài tập nào.</p>
  return <FixedSizeList height={640} width="100%" itemCount={props.deadlines.length} itemSize={300} itemData={props} itemKey={(index, data) => data.deadlines[index].id} overscanCount={3}>{Row}</FixedSizeList>
}
export const DeadlineList = AssignmentList
export default AssignmentList
