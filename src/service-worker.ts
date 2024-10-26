/// <reference lib="webworker" />
export default null
declare let self: ServiceWorkerGlobalScope

self.addEventListener('install', (event) => {
    console.log('Service Worker installing.');
    // Perform install steps if needed (e.g., caching resources)
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker activating.');
});

self.addEventListener('fetch', (event) => {
    // Respond to the request
    event.respondWith(
        (async () => {
            const url = new URL(event.request.url);
            const intercept = url.pathname.startsWith('/:namespace')
            if (intercept) {
                console.log('Intercept:', event.request.url);
                const responseData = { message: 'Hello from the Service Worker!' };
                return new Response(JSON.stringify(responseData), {
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            // Fallback to the network for other requests
            const response = await fetch(event.request);
            return response;
        })()
    );
})


self.addEventListener("message", (event) => {
    console.log(`Message received: ${event.data}`);
});