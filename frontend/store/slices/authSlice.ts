
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {jwtDecode} from 'jwt-decode';

type User = { id: string; email: string; role: string; country: string } | null;

type AuthState = {
  token: string | null;
  user: User;
};

const initialState: AuthState = {
  token: null,
  user: null,
};

function decodeToken(token: string): User {
  try {
    const p: any = jwtDecode(token);
    // Keep only expected fields
    return { id: p.sub, email: p.email, role: p.role, country: p.country };
  } catch {
    return null;
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Save token and derive user
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
      state.user = decodeToken(action.payload);
      if (typeof window !== 'undefined') {
        try { localStorage.setItem('token', action.payload); } catch {}
      }
    },

    // Clear auth state and localStorage
    clearToken(state) {
      state.token = null;
      state.user = null;
      if (typeof window !== 'undefined') {
        try { localStorage.removeItem('token'); } catch {}
      }
    },

    // Load token from localStorage into state 
    loadTokenFromStorage(state) {
      if (typeof window === 'undefined') return;
      try {
        const t = localStorage.getItem('token');
        if (t) {
          state.token = t;
          state.user = decodeToken(t);
        }
      } catch {
        state.token = null;
        state.user = null;
      }
    },
  },
});

export const { setToken, clearToken, loadTokenFromStorage } = authSlice.actions;
export default authSlice.reducer;
