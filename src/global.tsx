import { createSignal } from "solid-js";
import useOverlay from "./components/UseOverlay";
import { AuthResult } from "@instantdb/core/dist/module/clientTypes";

export const bodyOverlay = useOverlay();
export const sw: () => Omit<ServiceWorker, 'postMessage'> & {
    postMessage: (message: AppMessage) => void
} = () => navigator.serviceWorker.controller!;

export const [auth, setAuth] = createSignal<AuthResult>();
// Make sure only used after user is logged in
export const user = () => auth()?.user;

export type AppMessage = any
// {
//     type: 'INSTALL_APP',
//     app_id: string,
//     index: string,
//     offline: boolean
// }