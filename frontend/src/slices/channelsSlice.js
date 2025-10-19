import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../api/axios'

export const fetchChannels = createAsyncThunk(
  'channels/fetchChannels',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/channels')
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message)
    }
  }
)

const channelsSlice = createSlice({
  name: 'channels',
  initialState: {
    items: JSON.parse(localStorage.getItem('channels')) || [],
    status: 'idle',
    error: null,
  },
  reducers: {
    addChannelLocal(state, action) {
      state.items.push(action.payload)
      localStorage.setItem('channels', JSON.stringify(state.items))
    },
    removeChannelLocal(state, action) {
      state.items = state.items.filter((c) => c.id !== action.payload)
      localStorage.setItem('channels', JSON.stringify(state.items))
    },
    renameChannelLocal(state, action) {
      const { id, name } = action.payload
      const ch = state.items.find((c) => c.id === id)
      if (ch) ch.name = name
      localStorage.setItem('channels', JSON.stringify(state.items))
    },
    clearChannels(state) {
      state.items = []
      localStorage.removeItem('channels')
    },
    clearUserChannels: (state) => {
      state.items = state.items.filter((c) => !c.removable)
      localStorage.setItem('channels', JSON.stringify(state.items))
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannels.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchChannels.fulfilled, (state, action) => {
        state.status = 'succeeded'
        if (Array.isArray(action.payload) && action.payload.length > 0) {
          state.items = action.payload
          localStorage.setItem('channels', JSON.stringify(state.items))
        }
      })
      .addCase(fetchChannels.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || action.error.message
      })
  },
})

export const {
  addChannelLocal,
  removeChannelLocal,
  renameChannelLocal,
  clearChannels,
} = channelsSlice.actions
export default channelsSlice.reducer
