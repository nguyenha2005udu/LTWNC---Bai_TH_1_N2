import { createLogger } from 'redux-logger'
import { configureStore } from '@reduxjs/toolkit'
import deadlineReducer from '../features/deadlines/deadlineSlice'

export const store = configureStore({
  middleware: getDefaultMiddleware => import.meta.env.DEV ? getDefaultMiddleware().concat(createLogger()) : getDefaultMiddleware(),
  reducer: {
    deadlines: deadlineReducer,
  },
})

export type RootState = ReturnType<
  typeof store.getState
>

export type AppDispatch = typeof store.dispatch