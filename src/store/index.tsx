import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type Store = {
  user?: string;
  /** Session token from sign-in, sent as `Authorization: Bearer` to authenticated endpoints. */
  token?: string;
  setUser: (user?: string, token?: string) => void;
};

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      setUser: (user?: string, token?: string) => set(() => ({ user, token })),
    }),
    {
      name: "sample",
      // getStorage: () => localStorage,
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
