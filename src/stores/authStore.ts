import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  udiseCode: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (udiseCode: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (udiseCode: string, name?: string) => {
        const user = { udiseCode, name };
        set({ user, isAuthenticated: true });
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'ise-auth-storage',
      storage: {
        getItem: (udiseCode) => {
          const str = sessionStorage.getItem(udiseCode);
          return str ? JSON.parse(str) : null;
        },
        setItem: (udiseCode, value) => {
          sessionStorage.setItem(udiseCode, JSON.stringify(value));
        },
        removeItem: (udiseCode) => sessionStorage.removeItem(udiseCode),
      },
    }
  )
);