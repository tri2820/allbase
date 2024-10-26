// @refresh reload
import { mount, StartClient } from "@solidjs/start/client";

// In Chrome, Application > Update on reload
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('/service-worker.js') // Adjust the path as necessary
            .then(registration => {
                console.log('Service Worker registered with scope:', registration.scope);
                
            })
            .catch(error => {
                console.error('Service Worker registration failed:', error);
            });

        navigator.serviceWorker.ready.then( registration => {
            if (!registration.active) {
                console.log('failed to communicate')
                return;
            }

            registration.active.postMessage("Hi service worker");
        });
});
}


mount(() => <StartClient />, document.getElementById("app")!);
