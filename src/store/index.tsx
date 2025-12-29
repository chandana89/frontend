import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type Store = {
  user?: string;
  setUser: (user?: string) => void;
};

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      setUser: (user?: string) => set(() => ({ user })),
    }),
    {
      name: "sample",
      // getStorage: () => localStorage,
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
