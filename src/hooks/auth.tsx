import { useStore } from "../store";

export enum AccountStatus {
    LoggedOut,
    Authenticated,
}

export const Status = (): AccountStatus => {
    const store = useStore.getState();
    // Sessions saved before sign-in returned a token have no token; treat them as signed out.
    if (!store.user || !store.token) return AccountStatus.LoggedOut;
    return AccountStatus.Authenticated;
}