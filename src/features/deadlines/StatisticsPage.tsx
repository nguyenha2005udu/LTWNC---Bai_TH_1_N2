import { useMemo } from 'react'
import { useAppSelector } from '../../app/hooks'
import { selectDeadlines } from './deadlineSelectors'
import { calcStats } from './stats'
export default function StatisticsPage() {
  const items = useAppSelector(selectDeadlines)
  const stats = useMemo(() => calcStats(items), [items])
  return (
    <section className="statistics-page" aria-labelledby="statistics-heading">
      <span className="eyebrow">BỨC TRANH TỔNG QUAN</span>
      <h2 id="statistics-heading">Thống kê</h2>
      <p className="statistics-summary">Đã xong: {stats.completed} · Quá hạn: {stats.overdue}</p>
      <div className="subject-stats">
        <h3>Phân bố theo môn học</h3>
        {Object.entries(stats.bySubject).map(([subject, count]) => (
          <div className="subject-row" key={subject}>
            <span>{subject}: {count}</span>
            <span className="muted">{Math.round(count / stats.total * 100)}%</span>
            <progress value={count} max={stats.total} aria-label={`Số bài môn ${subject}`} />
          </div>
        ))}
        {stats.total === 0 && <p className="empty">Thêm bài tập đầu tiên để xem thống kê theo môn học.</p>}
      </div>
    </section>
  )
}
