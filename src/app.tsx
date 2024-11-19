import "@fontsource/poppins/100.css";
import "@fontsource/poppins/200.css";
import "@fontsource/poppins/300.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/poppins/800.css";
import "@fontsource/poppins/900.css";
import { Toast } from "@kobalte/core/toast";
import { Link, MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { deserialize } from "seroval";
import { onMount, Suspense } from "solid-js";
import { Portal } from "solid-js/web";
import "./app.css";
import { installations, setInstallations } from "./components/apps";
import { Auth } from "./components/Auth";
import { local } from "./local";

export default function App() {
  onMount(async () => {
    const keys = await local.keys();
    const serializeds = await Promise.all(keys.map((k) => local.getItem(k)));
    const _installations = serializeds.map((s) => deserialize(s as string));
    setInstallations(_installations as any[]);
    console.log("_installations", _installations, installations());
  });

  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <div class="Home">
            <Title>AllBase</Title>
            <Link rel="canonical" href="http://allbase.app/" />
          </div>

          <Suspense>
            <Auth>{props.children}</Auth>
          </Suspense>

          <Portal>
            <Toast.Region>
              <Toast.List class="toast__list" />
            </Toast.Region>
          </Portal>
          {/* 
          <script type="module" src="./main.mjs"></script> */}
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
