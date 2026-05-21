import { createSlice } from '@reduxjs/toolkit';
import apiClient, { clearAuthStorage } from '../api/apiClient';
import { getPayload, getMessage } from '../utils/apiResponse';

const readUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user')) || null;
  } catch {
    localStorage.removeItem('user');
    return null;
  }
};

export const fetchUser = () => async (dispatch, getState) => {
  const { token, role } = getState().auth;

  if (!token || !role) {
    dispatch(logout());
    return null;
  }

  const endpointByRole = {
    buyer: '/buyer/profile/me',
    vendor: '/vendor/profile/me',
    founder: '/founder/profile/me',
  };

  const endpoint = endpointByRole[role];

  if (!endpoint) {
    dispatch(logout());
    return null;
  }

  dispatch(authLoading());

  try {
    const res = await apiClient.get(endpoint);
    const user = getPayload(res, null);

    dispatch(setUser(user));
    return user;
  } catch (error) {
    dispatch(authFailure(getMessage(error, 'Session expired')));
    dispatch(logout());
    return null;
  }
};

const initialState = {
  user: readUser(),
  token: localStorage.getItem('token') || null,
  role: localStorage.getItem('role') || null,
  isAuthenticated: Boolean(localStorage.getItem('token')),
  loading: false,
  initialized: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      const { user, accessToken, token, role } = action.payload;
      const authToken = accessToken || token;

      state.user = user;
      state.token = authToken;
      state.role = role || user?.role;
      state.isAuthenticated = Boolean(authToken);

      localStorage.setItem('token', authToken);
      localStorage.setItem('role', role || user?.role);
      localStorage.setItem('user', JSON.stringify(user));
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.initialized = true;
      state.error = action.payload;
    },
    authFailure: (state, action) => {
      state.loading = false;
      state.initialized = true;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.initialized = true;
      state.error = null;
      clearAuthStorage();
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.loading = false;
      state.initialized = true;
      state.isAuthenticated = Boolean(state.token);
      localStorage.setItem('user', JSON.stringify(action.payload || {}));
    },
  },
});

export const {
  authLoading,
  loginStart,
  loginSuccess,
  loginFailure,
  authFailure,
  logout,
  setUser,
} = authSlice.actions;

export default authSlice.reducer;