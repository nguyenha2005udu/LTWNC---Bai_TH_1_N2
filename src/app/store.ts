import { configureStore } from '@reduxjs/toolkit'
import deadlineReducer from '../features/deadlines/deadlineSlice'

export const store = configureStore({
  reducer: {
    deadlines: deadlineReducer,
  },
})

export type RootState = ReturnType<
  typeof store.getState
>

export type AppDispatch = typeof store.dispatch