import { createSlice } from '@reduxjs/toolkit';
import apiClient from '../../src/api/apiClient';
import { toast } from 'react-toastify';


export const fetchUser = () => async (dispatch, getState) => {
  try {
    const { token } = getState().auth;
    const role = localStorage.getItem('role');

    let endpoint;

    if (role === 'vendor') endpoint = '/vendor/profile/me';
    else if (role === 'buyer') endpoint = '/buyer/profile/me';
    else if (role === 'founder') endpoint = '/founder/profile/me';

    const res = await apiClient.get(endpoint, {
      headers: { Authorization: `Bearer ${token}` }
    });

    dispatch(setUser(res.data.data));

  } catch (error) {
    // console.log(error);
    // toast.error(error.message);
  }
};


const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  role: localStorage.getItem('role') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,
};


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.isAuthenticated = true;

      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('role', action.payload.role);
    },

    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('user');
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, setUser } = authSlice.actions;
export default authSlice.reducer;