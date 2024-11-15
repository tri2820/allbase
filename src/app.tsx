import "@fontsource/poppins/100.css";
import "@fontsource/poppins/200.css";
import "@fontsource/poppins/300.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/poppins/800.css";
import "@fontsource/poppins/900.css";
import { Link, MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { onMount, Suspense } from "solid-js";
import "./app.css";
import { Auth } from "./components/Auth";
import { installations, setInstallations } from "./components/apps";
import { local } from "./local";
import { serialize, deserialize } from "seroval";
import { Portal } from "solid-js/web";
import { Toast } from "@kobalte/core/toast";

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
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
