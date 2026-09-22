import type { RootState } from '../../app/store'

export const selectDeadlines = (
  state: RootState
) => state.deadlines.items

export const selectDeadlineStatus = (
  state: RootState
) => state.deadlines.status

export const selectDeadlineError = (
  state: RootState
) => state.deadlines.error