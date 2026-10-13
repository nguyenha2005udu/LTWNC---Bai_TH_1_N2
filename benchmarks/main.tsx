import { createRoot } from 'react-dom/client'
import { Profiler, useCallback, useMemo, useState, type FunctionComponent } from 'react'
import { AssignmentCard } from '../src/components/DeadlineCard/DeadlineCard'
import AssignmentList from '../src/features/deadlines/DeadlineList'
import { generateAssignments } from '../src/features/deadlines/sampleData'
import { useDebounce } from '../src/hooks/useDebounce'
import { ThemeProvider, ThemeToggle } from '../src/contexts/ThemeProvider'
import { metrics } from './metrics'
import '../src/index.css'
import '../src/App.css'
const baseline = new URLSearchParams(location.search).get('mode') === 'baseline'
const RawCard = (AssignmentCard as unknown as { type: FunctionComponent<React.ComponentProps<typeof AssignmentCard>> }).type
const items = generateAssignments()
const instrumentation = globalThis as typeof globalThis & { __cardRenderCount: number; __benchmark: typeof metrics }
instrumentation.__cardRenderCount = 0
instrumentation.__benchmark = metrics
export function Benchmark() {
  const [query, setQuery] = useState('')
  const delayed = useDebounce(baseline ? '' : query)
  const search = baseline ? query : delayed
  const cached = useMemo(() => baseline ? items : items.filter(x => `${x.title} ${x.subject}`.toLowerCase().includes(search.toLowerCase())), [search])
  const filtered = baseline ? items.filter(x => `${x.title} ${x.subject}`.toLowerCase().includes(search.toLowerCase())) : cached
  const noop = useCallback(() => {}, [])
  return <main className="app"><h1>{baseline ? 'Baseline' : 'Optimized'}: 10.000 bài tập</h1><ThemeToggle />
    <label>Tìm kiếm<input value={query} onChange={e => setQuery(e.target.value)} /></label>
    <Profiler id="list" onRender={(_id, phase, duration) => metrics.commits.push({ phase, duration })}>
      {baseline ? <div>{filtered.map(item => <RawCard key={item.id} deadline={item} onToggle={() => {}} onDelete={() => {}} />)}</div> : <AssignmentList deadlines={filtered} onToggle={noop} onDelete={noop} />}
    </Profiler>
  </main>
}
createRoot(document.getElementById('root')!).render(<ThemeProvider><Benchmark /></ThemeProvider>)
