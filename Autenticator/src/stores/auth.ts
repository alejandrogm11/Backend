import { defineStore } from 'pinia';
import { ofetch } from 'ofetch';
import type { FetchError } from 'ofetch';

interface AuthUser {
  id: string;
  email: string;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as AuthUser | null,
    isAuthenticated: false,
    loading: false,
  }),

  getters: {
    isLogged: (state) => state.isAuthenticated === true,
  },
  actions: {
    async initSession() {
      // Check if the user is authenticated
      // if the user is not authenticated the request is not sent
      if (this.isAuthenticated) return;

      try {
        const data = await ofetch('/api/auth/me', {
          credentials: 'include',
        });
        this.user = data;
        this.isAuthenticated = true;
      } catch (error: unknown) {
        const err = error as FetchError;
        if (err?.response?.status === 401) {
          this.user = null;
          this.isAuthenticated = false;
        } else {
          console.error(err);
        }
      }
    },
    async login(email: string, password: string, rememberMe: boolean) {
      this.loading = true;
      try {
        const data = await ofetch('/api/auth/login', {
          method: 'POST',
          credentials: 'include',
          body: {
            email,
            password,
            rememberMe,
          },
          headers: {
            'Content-Type': 'application/json',
          },
        });
        this.user = { id: data.user.id, email };
        this.isAuthenticated = true;
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      await ofetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      this.user = null;
      this.isAuthenticated = false;
    },
  },
});
