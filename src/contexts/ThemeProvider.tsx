import { useContext, useMemo, useState, useCallback, type ReactNode } from 'react'
import { ThemeContext } from './ThemeContext'
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const toggleTheme = useCallback(() => setTheme(t => t === 'light' ? 'dark' : 'light'), [])
  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])
  return <ThemeContext.Provider value={value}><div data-theme={theme}>{children}</div></ThemeContext.Provider>
}
export function ThemeToggle() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('ThemeProvider is required')
  return <button className="theme-toggle" onClick={context.toggleTheme}><span aria-hidden="true">{context.theme === 'light' ? '☼' : '☾'}</span>Chủ đề: {context.theme === 'light' ? 'Sáng' : 'Tối'}</button>
}
