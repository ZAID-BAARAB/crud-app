// src/redux/slices/authSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

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
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  currentUserEmail: localStorage.getItem('currentUserEmail'),
  currentUser: localStorage.getItem('currentUser')
    ? JSON.parse(localStorage.getItem('currentUser')!)
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
        localStorage.setItem('currentUserEmail', action.payload.email);
      }
      // Persist tokens
      localStorage.setItem('accessToken', action.payload.accessToken);
      localStorage.setItem('refreshToken', action.payload.refreshToken);
      // Persist isAuthenticated
      localStorage.setItem('isAuthenticated', 'true');
    },
    setCurrentUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      localStorage.setItem('currentUser', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.currentUserEmail = null;
      state.currentUser = null;
      state.isAuthenticated = false;
      // Clear storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('currentUserEmail');
      localStorage.removeItem('currentUser');
      localStorage.setItem('isAuthenticated', 'false');
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
