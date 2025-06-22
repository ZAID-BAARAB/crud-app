// src/services/authService.ts
import axios from 'axios';
import { SERVER_IP } from '../constants/constants';
import { store } from '../redux/store';
import {
  setAuthTokens,
  setCurrentUser,
  logout as logoutAction,
} from '../redux/slices/authSlice';
import type { User } from '../redux/slices/authSlice';

/**
 * Authenticate user (login) and store tokens & user info in Redux
 */
export const authenticateUser = async (
  email: string,
  password: string
): Promise<{ accessToken: string; refreshToken: string }> => {
  const response = await axios.post(
    `${SERVER_IP}/api/v1/auth/authenticate`,
    { email, password },
    { headers: { 'Content-Type': 'application/json' } }
  );

  if (response.status === 200) {
    const { access_token, refresh_token } = response.data;
    // Dispatch tokens
    store.dispatch(
      setAuthTokens({ accessToken: access_token, refreshToken: refresh_token, email })
    );
    // setting  current user based on his JWT Token
    await whoAmI(access_token);

    return { accessToken: access_token, refreshToken: refresh_token };
  }

  throw new Error('Authentication failed');
};

/**
 * Register new user and store tokens & user info
 */
export const registerUser = async (
  firstname: string,
  lastname: string,
  email: string,
  password: string,
  role: string = 'USER'
): Promise<{ accessToken: string; refreshToken: string }> => {
  try {
    const response = await axios.post(
      `${SERVER_IP}/api/v1/auth/register`,
      { firstname, lastname, email, password, role },
      { headers: { 'Content-Type': 'application/json' } }
    );

    if (response.status === 200) {
      const { access_token, refresh_token } = response.data;
      store.dispatch(
        setAuthTokens({ accessToken: access_token, refreshToken: refresh_token, email })
      );
      // Fetch and set current user after registration
      await whoAmI(access_token);

       window.location.href = '/';

      return { accessToken: access_token, refreshToken: refresh_token };
      
    }

    throw new Error('Registration failed');
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // Try to extract backend error message
      const backendMsg = error.response.data?.message || error.response.data?.error || JSON.stringify(error.response.data);
      throw new Error(backendMsg || 'Registration failed');
    }
    throw new Error('Registration failed');
  }
};

/**
 * Fetch current user profile and update Redux store
 */
export const whoAmI = async (accessToken: string): Promise<User> => {
  // const accessToken = store.getState().auth.accessToken;
  if (!accessToken) throw new Error('No access token found. Please log in.');

  const response = await axios.get<User>(
    `${SERVER_IP}/api/v1/users/whoami`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (response.status === 200) {
    store.dispatch(setCurrentUser(response.data));
    return response.data;
  }

  throw new Error('Failed to fetch user details');
};

/**
 * Logout user both server-side and client-side
 */
export const logout = async (): Promise<void> => {
  const accessToken = store.getState().auth.accessToken;

  if (accessToken) {
    try {
      await axios.post(
        `${SERVER_IP}/api/v1/auth/logout`,
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
    } catch {
      console.warn('Server logout failed, proceeding with client cleanup');
    }
  }
  store.dispatch(logoutAction());
  // Redirect to login page after logout
  window.location.href = '/login';
};

/**
 * Refresh access token using stored refreshToken
 */
export const refreshAccessToken = async (): Promise<{ accessToken: string; refreshToken: string }> => {
  const refreshToken = store.getState().auth.refreshToken;
  if (!refreshToken) throw new Error('No refresh token available');

  const response = await axios.post(
    `${SERVER_IP}/api/v1/auth/refresh-token`,
    { refresh_token: refreshToken },
    { headers: { 'Content-Type': 'application/json' } }
  );

  if (response.status === 200) {
    const { access_token, refresh_token } = response.data;
    store.dispatch(setAuthTokens({ accessToken: access_token, refreshToken: refresh_token }));
    return { accessToken: access_token, refreshToken: refresh_token };
  }

  // On failure, force logout
  store.dispatch(logoutAction());
  throw new Error('Token refresh failed');
};

//<======= Oauth2 Google Login =======>//
export const googleLogin = async (idToken: string): Promise<void> => {
  console.log('Google ID Token:', idToken);
  const response = await axios.post(`${SERVER_IP}/api/v1/auth/google`, {
    idToken
  });

  if (response.status === 200) {
    const { access_token, refresh_token } = response.data;

    store.dispatch(
      setAuthTokens({
        accessToken: access_token,
        refreshToken: refresh_token,
      })
    );
    console.log('Access Token:', access_token);
    await whoAmI(access_token);

  } else {
    throw new Error('Google login failed');
  }
};

