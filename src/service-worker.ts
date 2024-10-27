/// <reference lib="webworker" />
export default null
declare let self: ServiceWorkerGlobalScope

import localforage from 'localforage';
import { AppMessage } from './global';
const store = localforage.createInstance({
    name: "apps"
});


self.addEventListener('install', (event) => {
    console.log('Service Worker installing.');
    // Perform install steps if needed (e.g., caching resources)
    store.setItem('greet', 'hello world')

});

self.addEventListener('activate', (event) => {
    console.log('Service Worker activating.');
});

self.addEventListener('fetch', (event) => {
    if (event.request.url.startsWith(self.location.origin)) {
        // Respond to the request
        event.respondWith(
            (async () => {

                // const match = await caches.match(event.request);
                console.log('hello', await store.getItem('greet'))
                const url = new URL(event.request.url);
                const intercept = url.pathname.startsWith('/:namespace')
                if (intercept) {
                    console.log('Intercept:', event.request.url);
                    const responseData = { message: 'Hello from the Service Worker!' };
                    return new Response(JSON.stringify(responseData), {
                        headers: { 'Content-Type': 'application/json' }
                    });
                }
                // return caches.open(RUNTIME).then(cache => {
                //     return fetch(event.request).then(response => {
                //       // Put a copy of the response in the runtime cache.
                //       return cache.put(event.request, response.clone()).then(() => {
                //         return response;
                //       });
                //     });
                //   });

                // Fallback to the network for other requests
                const response = await fetch(event.request);
                return response;
            })()
        );
    }
})


self.addEventListener("message", (event) => {
    const message = event.data as AppMessage
    if (message.type == 'INSTALL_APP') {
        console.log('set', message)
    }
});