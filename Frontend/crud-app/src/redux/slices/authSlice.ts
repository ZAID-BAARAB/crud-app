// src/redux/slices/authSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { ACCESS_TOKEN_KEY, CURRENT_USER_EMAIL_KEY, CURRENT_USER_KEY, IS_AUTHENTICATED_KEY, REFRESH_TOKEN_KEY } from '../../constants/storageKeys';

// Define the User interface (profile information)
export interface User {
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  verified: boolean;
}

// Define the AuthState interface
export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  currentUserEmail: string | null;
  currentUser: User | null;
  isAuthenticated: boolean;
}

// Read initial tokens and user from localStorage
const initialState: AuthState = {
  accessToken: localStorage.getItem(ACCESS_TOKEN_KEY),
  refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
  currentUserEmail: localStorage.getItem(CURRENT_USER_EMAIL_KEY),
  currentUser: localStorage.getItem(CURRENT_USER_KEY)
    ? JSON.parse(localStorage.getItem(CURRENT_USER_KEY)!)
    : null,
  isAuthenticated: !!localStorage.getItem('accessToken') && !!localStorage.getItem('refreshToken'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthTokens: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string; email?: string }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      // Optionally store user email
      if (action.payload.email) {
        state.currentUserEmail = action.payload.email;
        localStorage.setItem(CURRENT_USER_EMAIL_KEY, action.payload.email);
      }
      // Persist tokens
      localStorage.setItem(ACCESS_TOKEN_KEY, action.payload.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, action.payload.refreshToken);
      // Persist isAuthenticated
      localStorage.setItem(IS_AUTHENTICATED_KEY, 'true');
    },
    setCurrentUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.currentUserEmail = null;
      state.currentUser = null;
      state.isAuthenticated = false;
      // Clear storage
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(CURRENT_USER_EMAIL_KEY);
      localStorage.removeItem(CURRENT_USER_KEY);
      localStorage.setItem(IS_AUTHENTICATED_KEY, 'false');
    },
  },
});

// Export actions
export const { setAuthTokens, setCurrentUser, logout } = authSlice.actions;

// Selectors
export const selectAccessToken = (state: RootState) => state.auth.accessToken;
export const selectRefreshToken = (state: RootState) => state.auth.refreshToken;
export const selectCurrentUserEmail = (state: RootState) => state.auth.currentUserEmail;
export const selectCurrentUser = (state: RootState) => state.auth.currentUser;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;

// Export reducer
export default authSlice.reducer;
