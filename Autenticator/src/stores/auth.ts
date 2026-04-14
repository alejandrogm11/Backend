import { defineStore } from 'pinia';
import { ofetch } from 'ofetch';

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
  actions: {
    async initSession() {
      try {
        const data = await ofetch('/api/auth/me', {
          credentials: 'include',
        });
        this.user = data;
        this.isAuthenticated = true;
      } catch (error) {
        console.error(error);
        this.user = null;
        this.isAuthenticated = false;
      }
    },

    async logout() {
      try {
        await ofetch('/api/auth/logout', {
          method: 'POST',
          credentials: 'include',
        });
        this.user = null;
        this.isAuthenticated = false;
      } catch (error) {
        console.error(error);
      }
    },
  },
});
