
import { createSlice } from '@reduxjs/toolkit';
import apiClient, { clearAuthStorage } from '../api/apiClient';
import { getPayload, getMessage } from '../utils/apiResponse';

const USER_STORAGE_KEYS = {
  buyer: 'buyerUser',
  vendor: 'vendorUser',
  founder: 'founderUser',
};

const getUserStorageKey = (role) => {
  return USER_STORAGE_KEYS[role] || null;
};

const getStoredUser = (role = null) => {
  try {
    const currentRole =
      role || localStorage.getItem('role');

    const storageKey =
      getUserStorageKey(currentRole);

    if (!storageKey) {
      return null;
    }

    const storedUser =
      localStorage.getItem(storageKey);

    if (!storedUser) {
      return null;
    }

    return JSON.parse(storedUser);
  } catch {
    const currentRole =
      role || localStorage.getItem('role');

    const storageKey =
      getUserStorageKey(currentRole);

    if (storageKey) {
      localStorage.removeItem(storageKey);
    }

    return null;
  }
};

const toBoolean = (
  value,
  fallback = false
) => {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    const normalized =
      value.trim().toLowerCase();

    if (normalized === 'true') {
      return true;
    }

    if (normalized === 'false') {
      return false;
    }
  }

  return fallback;
};

const normalizeAuthUser = (
  user = {},
  fallbackUser = null,
  fallbackRole = null
) => {
  const role =
    user.role ||
    fallbackUser?.role ||
    fallbackRole ||
    null;

  const previous =
    fallbackUser?.role === role
      ? fallbackUser
      : {};

  const identity =
    user.identity || {};

  const contact =
    user.contact || {};

  const verification =
    user.verification || {};

  const account =
    user.account || {};

  const preferences =
    user.preferences ||
    previous.preferences ||
    {};


  const normalizedUser = {
    id:
      user.id ||
      user._id ||
      previous.id ||
      previous._id ||
      null,

    role,

    fullName:
      user.fullName ||
      identity.fullName ||
      previous.fullName ||
      previous.identity?.fullName ||
      '',

    email:
      user.email ||
      contact.email ||
      previous.email ||
      previous.contact?.email ||
      '',

    profilePhoto:
      user.profilePhoto ||
      identity.profilePhoto ||
      previous.profilePhoto ||
      previous.identity?.profilePhoto ||
      '',

    serialNumber:
      user.serialNumber ||
      identity.serialNumber ||
      previous.serialNumber ||
      previous.identity?.serialNumber ||
      '',

    emailVerified: toBoolean(
      user.emailVerified ??
      verification.emailVerified,
      previous.emailVerified ?? false
    ),

    onboardingCompleted: toBoolean(
      user.onboardingCompleted,
      previous.onboardingCompleted ?? false
    ),

    accountStatus:
      user.accountStatus ||
      account.accountStatus ||
      previous.accountStatus ||
      'active',

    isActive: toBoolean(
      user.isActive ??
      account.isActive,
      previous.isActive ?? true
    ),

    isSuspended: toBoolean(
      user.isSuspended ??
      user.isSuspend ??
      account.isSuspended,
      previous.isSuspended ?? false
    ),

    isLocked: toBoolean(
      user.isLocked ??
      account.isLocked,
      previous.isLocked ?? false
    ),
  };

  if (role === 'buyer') {
    normalizedUser.preferences = {
      notificationPreference:
        preferences.notificationPreference ??
        '',

      promotionalMessages:
        preferences.promotionalMessages ??
        false,
    };

    normalizedUser.student = {
      ...(user.student || previous.student || {}),

      profilePhoto:
        user.student?.profilePhoto ||
        previous.student?.profilePhoto ||
        normalizedUser.profilePhoto ||
        '',

      gender:
        user.student?.gender ||
        previous.student?.gender ||
        '',

      matricNumber:
        user.student?.matricNumber ||
        previous.student?.matricNumber ||
        '',

      faculty:
        user.student?.faculty ||
        previous.student?.faculty ||
        '',

      department:
        user.student?.department ||
        previous.student?.department ||
        '',

      level:
        user.student?.level ||
        previous.student?.level ||
        '',

      residence:
        user.student?.residence ||
        previous.student?.residence ||
        '',

      address:
        user.student?.address ||
        previous.student?.address ||
        '',
    };

    delete normalizedUser.business;
  }


  if (role === 'vendor') {
    normalizedUser.business = {
      ...(user.business ||
        previous.business ||
        {}),

      storeName:
        user.business?.storeName ??
        previous.business?.storeName ??
        '',

      type:
        user.business?.type ??
        previous.business?.type ??
        false,
    };

    normalizedUser.preferences = {
      notificationPreference:
        preferences.notificationPreference ??
        '',

      promotionalMessages:
        preferences.promotionalMessages ??
        false,
    };

    delete normalizedUser.student;
  }


  if (role === 'founder') {
    normalizedUser.preferences = {
      notificationPreference:
        preferences.notificationPreference ??
        '',

      promotionalMessages:
        preferences.promotionalMessages ??
        false,
    };

    delete normalizedUser.business;
    delete normalizedUser.student;
  }


  return normalizedUser;
};


const readUser = () => {
  const role =
    localStorage.getItem('role');

  const storedUser =
    getStoredUser(role);

  if (!storedUser) {
    return null;
  }

  return normalizeAuthUser(storedUser, null, role);
};

export const fetchUser = () =>
  async (dispatch, getState) => {
    const {
      token,
      role,
    } = getState().auth;

    if (!token || !role) {
      dispatch(logout());
      return null;
    }

    const endpointByRole = {
      buyer: '/buyer/profile/me',
      vendor: '/vendor/profile/me',
      founder: '/founder/profile/me',
    };

    const endpoint =
      endpointByRole[role];

    if (!endpoint) {
      dispatch(logout());
      return null;
    }

    dispatch(authLoading());

    try {
      const res = await apiClient.get(endpoint);

      const profile = getPayload(res, null);

      const currentUser = getStoredUser(role);

      const normalizedUser = normalizeAuthUser(
        profile,
        currentUser,
        role
      );

      dispatch(setUser(normalizedUser));

      return normalizedUser;
    } catch (error) {
      dispatch(
        authFailure(
          getMessage(error, 'Session expired'))
      );
      dispatch(logout());
      return null;
    }
  };

const initialRole = localStorage.getItem('role');

const initialState = {
  user: readUser(),

  token:
    localStorage.getItem('token') || null,

  role: initialRole || null,

  isAuthenticated:
    Boolean(
      localStorage.getItem('token')
    ),

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
      const {
        user,
        accessToken,
        token,
        role,
      } = action.payload;

      const authToken = accessToken || token;

      const userRole = role || user?.role || null;

      const previousUser =
        userRole === state.role
          ? state.user
          : getStoredUser(userRole);

      const normalizedUser =
        normalizeAuthUser(
          user,
          previousUser,
          userRole
        );

      state.user = normalizedUser;
      state.token = authToken;
      state.role = userRole;
      state.isAuthenticated = Boolean(authToken);
      state.loading = false;
      state.initialized = true;
      state.error = null;

      if (authToken) {
        localStorage.setItem(
          'token',
          authToken
        );
      }

      if (userRole) {
        localStorage.setItem(
          'role',
          userRole
        );
      }

      const storageKey =  getUserStorageKey(userRole);

      if (storageKey) {
        localStorage.setItem(
          storageKey,
          JSON.stringify(
            normalizedUser
          )
        );
      }

      localStorage.removeItem(
        'user'
      );
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
      const role =
        state.role ||
        action.payload?.role ||
        null;

      const normalizedUser =
        normalizeAuthUser(
          action.payload,
          state.user,
          role
        );

      state.user = normalizedUser;

      state.loading = false;

      state.initialized = true;

      const storageKey = getUserStorageKey(role);

      if (storageKey) {
        localStorage.setItem(
          storageKey,
          JSON.stringify(
            normalizedUser
          )
        );
      }

      localStorage.removeItem('user');
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