import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../api/axios'

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/messages')
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message)
    }
  }
)

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    addMessageLocal(state, action) {
      state.items.push(action.payload)
    },
    editMessageLocal(state, action) {
      const { id, body } = action.payload
      const m = state.items.find((x) => x.id === id)
      if (m) m.body = body
    },
    removeMessageLocal(state, action) {
      state.items = state.items.filter((m) => m.id !== action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || action.error.message
      })
  },
})

export const { addMessageLocal, editMessageLocal, removeMessageLocal } =
  messagesSlice.actions
export default messagesSlice.reducer
