import useOverlay from "./components/UseOverlay";

export const bodyOverlay = useOverlay();
export const sw: () => Omit<ServiceWorker, 'postMessage'> & {
    postMessage: (message: AppMessage) => void
} = () => navigator.serviceWorker.controller!;


export type AppMessage = {
    type: 'INSTALL_APP',
    app_id: string,
    path: string,
    offline: boolean
}