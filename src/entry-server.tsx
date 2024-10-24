// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
          {assets}
          <noscript>
            <style>
              {`/**
    * Reinstate scrolling for non-JS clients
    */
    .simplebar-content-wrapper {
      scrollbar-width: auto;
      -ms-overflow-style: auto;
    }

    .simplebar-content-wrapper::-webkit-scrollbar,
    .simplebar-hide-scrollbar::-webkit-scrollbar {
      display: initial;
      width: initial;
      height: initial;
    }`}
            </style>
          </noscript>
        </head>
        <body>
          <div id="app">{children}</div>
          {scripts}
        </body>
      </html>
    )}
  />
));
