import "@fontsource/poppins/100.css";
import "@fontsource/poppins/200.css";
import "@fontsource/poppins/300.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/poppins/800.css";
import "@fontsource/poppins/900.css";
import { Link, Meta, MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./app.css";



export default function App() {

  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <div class="Home">
            <Title>AllBase - Power Up Collaboration</Title>
            <Link rel="canonical" href="http://allbase.app/" />
          </div>

          <Suspense>{props.children}</Suspense>
        </MetaProvider>

      )}
    >
      <FileRoutes />
    </Router>
  );
}
