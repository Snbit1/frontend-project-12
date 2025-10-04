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
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    addChannelLocal(state, action) {
      state.items.push(action.payload)
    },
    removeChannelLocal(state, action) {
      state.items = state.items.filter((c) => c.id !== action.payload)
    },
    renameChannelLocal(state, action) {
      const { id, name } = action.payload
      const ch = state.items.find((c) => c.id === id)
      if (ch) ch.name = name
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
        state.items = action.payload
      })
      .addCase(fetchChannels.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || action.error.message
      })
  },
})

export const { addChannelLocal, removeChannelLocal, renameChannelLocal } =
  channelsSlice.actions
export default channelsSlice.reducer
