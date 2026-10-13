import { createContext } from 'react'
export const ThemeContext = createContext<{ theme: 'light' | 'dark'; toggleTheme: () => void } | null>(null)
