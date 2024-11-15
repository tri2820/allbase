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
import { Sandbox } from "./lib/sandbox/sanbox";
import { ModuleSource } from "@endo/module-source";

export default function App() {
  onMount(async () => {
    const keys = await local.keys();
    const serializeds = await Promise.all(keys.map((k) => local.getItem(k)));
    const _installations = serializeds.map((s) => deserialize(s as string));
    setInstallations(_installations as any[]);
    console.log("_installations", _installations, installations());
  });

  onMount(() => {
    Sandbox.lockdown();
    // const moduleMapHook = (moduleSpecifier: string) => {
    //   if (moduleSpecifier === 'even') {
    //     return {
    //       source: './index.js',
    //       compartment: even,
    //     };
    //   } else if (moduleSpecifier === 'odd') {
    //     return {
    //       source: './index.js',
    //       compartment: odd,
    //     };
    //   }
    // };

    // const even = new Compartment({
    //   resolveHook: nodeResolveHook,
    //   importHook: makeImportHook('https://example.com/even'),
    //   moduleMapHook,
    //   __options__: true, // temporary migration affordance
    // });

    // const src = `
    // export function greet(name) {
    //     console.log(\`Hello, \${name}!\`);
    // }

    // greet('hello')
    // `;

    // // after
    // const compartment = new Compartment({
    //   __options__: true,
    //   modules: {
    //     "my-module-specifier": {
    //       source: new ModuleSource(
    //         //       `
    //         //   export default 42;
    //         // `
    //         src
    //       ),
    //     },
    //   },
    //   globals: {
    //     console,
    //   },
    // });
    // console.log(compartment.importNow("my-module-specifier").default); // 42
    // // compartment.

    const compartment = new Compartment({
      __options__: true,
      modules: {
        "submodule/dependency": new ModuleSource(`
          export default 42;
        `),
      },
      importNowHook(specifier: string) {
        if (specifier === "dependent") {
          return {
            source: new ModuleSource(`
              import meaning from 'dependency';
              export default meaning;
            `),
            specifier: "submodule/dependent",
            compartment, // reflexive
          };
        }
      },
      /**
       * Resolve a module specifier relative to another module specifier.
       *
       * For example, if we're currently inside a module at `a/b/c.mjs` and we
       * want to import `./d.mjs`, we need to resolve the specifier `./d.mjs`
       * relative to the current module specifier `a/b/c.mjs`.
       *
       * The result of this resolution is `a/b/d.mjs`, which is the full module
       * specifier of the module that we want to import.
       *
       * This hook is used to implement the `import` statement in our sandboxed
       * environment.
       *
       * @param referrerSpecifier - The specifier of the module that we're
       * currently inside of.
       * @param importSpecifier - The specifier of the module that we want to
       * import.
       * @returns The fully resolved specifier of the module that we want to
       * import.
       */
      resolveHook(importSpecifier: string, referrerSpecifier: string) {
        const path = referrerSpecifier.split("/");
        path.pop();
        path.push(...importSpecifier.split("/"));
        return path.join("/");
      },
    });
    console.log(compartment.importNow("dependent").default); // 42
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
