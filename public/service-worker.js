"use strict";
(() => {
  // src/service-worker.ts
  var service_worker_default = null;
  self.addEventListener("install", (event) => {
    console.log("Service Worker installing.");
  });
  self.addEventListener("activate", (event) => {
    console.log("Service Worker activating.");
  });
  self.addEventListener("fetch", (event) => {
    event.respondWith(
      (async () => {
        const url = new URL(event.request.url);
        const intercept = url.pathname.startsWith("/:namespace");
        if (intercept) {
          console.log("Intercept:", event.request.url);
          const responseData = { message: "Hello from the Service Worker!" };
          return new Response(JSON.stringify(responseData), {
            headers: { "Content-Type": "application/json" }
          });
        }
        const response = await fetch(event.request);
        return response;
      })()
    );
  });
  self.addEventListener("message", (event) => {
    console.log(`Message received: ${event.data}`);
  });
})();
