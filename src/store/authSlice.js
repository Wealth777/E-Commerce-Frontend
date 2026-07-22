import { createSlice } from '@reduxjs/toolkit';
import apiClient, { clearAuthStorage } from '../api/apiClient';
import { getPayload, getMessage } from '../utils/apiResponse';


const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user')) || null;
  } catch {
    return null;
  }
};

const getPrimaryId = (value) => (
  value?.userId ||
  value?.accountId ||
  value?.user?._id ||
  value?.user?.id ||
  value?._id ||
  value?.id ||
  value?.profile?._id ||
  value?.profile?.id ||
  value?.buyer?._id ||
  value?.buyer?.id ||
  value?.vendor?._id ||
  value?.vendor?.id ||
  value?.buyerInfo?._id ||
  value?.buyerInfo?.id ||
  value?.vendorInfo?._id ||
  value?.vendorInfo?.id ||
  ''
);

const toBooleanFlag = (value) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true') return true;
    if (normalized === 'false') return false;
  }
  return null;
};

const getOnboardingStatus = (user, previous) => {
  const candidates = [
    user?.onboardingCompleted,
    user?.verification?.onboardingCompleted,
    user?.profile?.onboardingCompleted,
    user?.buyer?.onboardingCompleted,
    user?.vendor?.onboardingCompleted,
    user?.isOnboardingCompleted,
    user?.profile?.isOnboardingCompleted,
    user?.buyer?.isOnboardingCompleted,
    user?.vendor?.isOnboardingCompleted,

    previous?.onboardingCompleted,
    previous?.verification?.onboardingCompleted,
    previous?.profile?.onboardingCompleted,
    previous?.buyer?.onboardingCompleted,
    previous?.vendor?.onboardingCompleted,
    previous?.isOnboardingCompleted,
    previous?.profile?.isOnboardingCompleted,
    previous?.buyer?.isOnboardingCompleted,
    previous?.vendor?.isOnboardingCompleted,
  ];

  for (const candidate of candidates) {
    const parsed = toBooleanFlag(candidate);

    if (parsed !== null) {
      return parsed;
    }
  }

  return false;
};

const getEmailVerificationStatus = (user, previous) => {
  const candidates = [
    user?.emailVerified,
    user?.verification?.emailVerified,
    user?.profile?.emailVerified,
    user?.buyer?.emailVerified,
    user?.vendor?.emailVerified,

    previous?.emailVerified,
    previous?.verification?.emailVerified,
    previous?.profile?.emailVerified,
    previous?.buyer?.emailVerified,
    previous?.vendor?.emailVerified,
  ];

  for (const candidate of candidates) {
    const parsed = toBooleanFlag(candidate);

    if (parsed !== null) {
      return parsed;
    }
  }

  return false;
};

const getAccountStatus = (user, previous) => {
  return (
    user?.accountStatus ||
    user?.verification?.accountStatus ||
    previous?.accountStatus ||
    previous?.verification?.accountStatus ||
    "Active"
  );
};

const getLockedStatus = (user, previous) => {
  const candidates = [
    user?.isLocked,
    user?.verification?.isLocked,

    previous?.isLocked,
    previous?.verification?.isLocked,
  ];

  for (const candidate of candidates) {
    const parsed = toBooleanFlag(candidate);

    if (parsed !== null) {
      return parsed;
    }
  }

  return false;
};

const getSuspendedStatus = (user, previous) => {
  const candidates = [
    user?.isSuspend,
    user?.verification?.isSuspend,

    previous?.isSuspend,
    previous?.verification?.isSuspend,
  ];

  for (const candidate of candidates) {
    const parsed = toBooleanFlag(candidate);

    if (parsed !== null) {
      return parsed;
    }
  }

  return false;
};

const getVerifiedStatus = (user, previous) => {
  const candidates = [
    user?.isVerified,
    user?.verification?.isVerified,

    previous?.isVerified,
    previous?.verification?.isVerified,
  ];

  for (const candidate of candidates) {
    const parsed = toBooleanFlag(candidate);

    if (parsed !== null) {
      return parsed;
    }
  }

  return false;
};

const getVerificationStatus = (user, previous) => {
  return (
    user?.verificationStatus ||
    user?.verification?.verificationStatus ||
    previous?.verificationStatus ||
    previous?.verification?.verificationStatus ||
    null
  );
};

const normalizeAuthUser = (
  nextUser,
  fallbackUser = null,
  fallbackRole = null
) => {
  const user = nextUser || {};
  const previous = fallbackUser || {};

  const role =
    user.role ||
    user.userRole ||
    previous.role ||
    previous.userRole ||
    fallbackRole ||
    null;

  const accountId =
    getPrimaryId(previous) ||
    getPrimaryId(user);

  const profileId =
    user.profileId ||
    user._id ||
    user.id ||
    user?.profile?._id ||
    user?.profile?.id ||
    previous.profileId ||
    '';

  const emailVerified = getEmailVerificationStatus(user, previous);
  const onboardingCompleted = getOnboardingStatus(user, previous);

  const accountStatus = getAccountStatus(user, previous);
  const isLocked = getLockedStatus(user, previous);
  const isSuspend = getSuspendedStatus(user, previous);
  const isVerified = getVerifiedStatus(user, previous);
  const verificationStatus = getVerificationStatus(user, previous);

  return {
    ...previous,
    ...user,

    _id: accountId || user._id || previous._id,
    id: accountId || user.id || previous.id,
    userId: accountId || user.userId || previous.userId,
    accountId: accountId || user.accountId || previous.accountId,
    profileId,
    role,

    emailVerified,
    onboardingCompleted,

    accountStatus,
    isLocked,
    isSuspend,
    isVerified,
    verificationStatus,
  };
};

const readUser = () => {
  try {
    const storedUser = JSON.parse(localStorage.getItem('user')) || null;
    return storedUser ? normalizeAuthUser(storedUser, null, localStorage.getItem('role')) : null;
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
    const profile = getPayload(res, null);
    const currentUser = getState().auth.user || getStoredUser();
    const user = normalizeAuthUser(profile, currentUser, role);


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
      const normalizedUser = normalizeAuthUser(user, state.user, role);

      state.user = normalizedUser;
      state.token = authToken;
      state.role = role || normalizedUser?.role;
      state.isAuthenticated = Boolean(authToken);

      localStorage.setItem('token', authToken);
      localStorage.setItem('role', role || normalizedUser?.role);
      localStorage.setItem('user', JSON.stringify(normalizedUser));
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
      state.user = normalizeAuthUser(action.payload, state.user, state.role);
      state.loading = false;
      state.initialized = true;
      state.isAuthenticated = Boolean(state.token);
      localStorage.setItem('user', JSON.stringify(state.user || {}));
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