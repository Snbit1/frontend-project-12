import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  token: localStorage.getItem('token') || null,
  user: JSON.parse(localStorage.getItem('user')) || null,
  isAuthenticated: !!localStorage.getItem('token'),
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload.token
      state.user = action.payload.user
      state.isAuthenticated = true
      localStorage.setItem('token', state.token)
      localStorage.setItem('user', JSON.stringify(state.user))
    },
    logout: (state) => {
      state.token = null
      state.user = null
      state.isAuthenticated = false
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
  },
})

export const { loginSuccess, logout } = authSlice.actions
export default authSlice.reducer
