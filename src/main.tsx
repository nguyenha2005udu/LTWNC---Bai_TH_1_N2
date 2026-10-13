import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'

import App from './App'
import { ThemeProvider } from './contexts/ThemeProvider'
import { store } from './app/store'

import './index.css'

createRoot(
  document.getElementById('root')!
).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider><App /></ThemeProvider>
    </Provider>
  </StrictMode>
)