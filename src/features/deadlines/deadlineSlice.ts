import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit'

import type {
  Deadline,
  CreateDeadlineInput,
} from '../../types/deadline'

interface DeadlineState {
  items: Deadline[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: DeadlineState = {
  items: [],
  status: 'idle',
  error: null,
}

const API_URL = 'http://localhost:3001/assignments'

export const fetchDeadlines =
  createAsyncThunk<Deadline[]>(
    'deadlines/fetchDeadlines',
    async () => {
      const response = await fetch(API_URL)

      if (!response.ok) {
        throw new Error(
          'Không thể tải danh sách deadline'
        )
      }

      return (await response.json()) as Deadline[]
    }
  )

export const addDeadline = createAsyncThunk<
  Deadline,
  CreateDeadlineInput
>(
  'deadlines/addDeadline',
  async (deadlineInput) => {
    const newDeadline: Deadline = {
      id: crypto.randomUUID(),
      ...deadlineInput,
      completed: false,
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newDeadline),
    })

    if (!response.ok) {
      throw new Error('Không thể thêm bài tập')
    }

    return (await response.json()) as Deadline
  }
)

const deadlineSlice = createSlice({
  name: 'deadlines',

  initialState,

  reducers: {
    replaceDeadlines: (state, action: PayloadAction<Deadline[]>) => {
      state.items = action.payload
      state.status = 'succeeded'
      state.error = null
    },
    toggleDeadline: (
      state,
      action: PayloadAction<string>
    ) => {
      const deadline = state.items.find(
        (item) => item.id === action.payload
      )

      if (deadline) {
        deadline.completed =
          !deadline.completed
      }
    },

    deleteDeadline: (
      state,
      action: PayloadAction<string>
    ) => {
      state.items = state.items.filter(
        (item) => item.id !== action.payload
      )
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(
        fetchDeadlines.pending,
        (state) => {
          state.status = 'loading'
          state.error = null
        }
      )

      .addCase(
        fetchDeadlines.fulfilled,
        (state, action) => {
          state.status = 'succeeded'
          state.items = action.payload
        }
      )

      .addCase(
        fetchDeadlines.rejected,
        (state, action) => {
          state.status = 'failed'
          state.error =
            action.error.message ??
            'Có lỗi xảy ra'
        }
      )

      .addCase(
        addDeadline.fulfilled,
        (state, action) => {
          state.items.push(action.payload)
          state.error = null
        }
      )

      .addCase(
        addDeadline.rejected,
        (state, action) => {
          state.error =
            action.error.message ??
            'Không thể thêm bài tập'
        }
      )
  },
})

export const {
  replaceDeadlines,
  toggleDeadline,
  deleteDeadline,
} = deadlineSlice.actions

export default deadlineSlice.reducer
