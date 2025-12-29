import { useStore } from "../store";

export enum AccountStatus {
    LoggedOut,
    Authenticated,
}

export const Status = (): AccountStatus => {
    const store = useStore.getState();
    if (!store.user) return AccountStatus.LoggedOut;
    return AccountStatus.Authenticated;
}