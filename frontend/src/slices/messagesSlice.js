import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../api/axios'

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async (channelId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/messages?channelId=${channelId}`)
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message)
    }
  }
)

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    items: JSON.parse(localStorage.getItem('messages')) || [],
    status: 'idle',
    error: null,
  },
  reducers: {
    addMessageLocal(state, action) {
      state.items.push(action.payload)
      localStorage.setItem('messages', JSON.stringify(state.items))
    },
    editMessageLocal(state, action) {
      const { id, body } = action.payload
      const m = state.items.find((x) => x.id === id)
      if (m) m.body = body
      localStorage.setItem('messages', JSON.stringify(state.items))
    },
    removeMessageLocal(state, action) {
      state.items = state.items.filter((m) => m.id !== action.payload)
      localStorage.setItem('messages', JSON.stringify(state.items))
    },
    clearMessages(state) {
      state.items = []
      localStorage.removeItem('messages')
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
        if (Array.isArray(action.payload) && action.payload.length > 0) {
          state.items = action.payload
          localStorage.setItem('messages', JSON.stringify(state.items))
        }
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || action.error.message
      })
  },
})

export const {
  addMessageLocal,
  editMessageLocal,
  removeMessageLocal,
  clearMessages,
} = messagesSlice.actions
export default messagesSlice.reducer
