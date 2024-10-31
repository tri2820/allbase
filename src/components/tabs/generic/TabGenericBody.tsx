import { onCleanup, onMount } from "solid-js";
import { installationOf, AppMetas, install } from "~/components/apps";
import esBundle from "~/lib/bundler";
import threeJSCube from "~/test/threejs-cube?raw";
import threeJSCubeBundle from "/home/tri/Desktop/allbase/examples/three-cube/dist/main.js?raw";


export default function TabGenericBody(props: { app_id: string }) {
  const installation = installationOf(props.app_id);
  const AppMeta = AppMetas.find(
    (AppMeta) => AppMeta.id == props.app_id
  );

  if (!AppMeta || !installation) {
    return <div>Not found</div>;
  }

  let shadow: HTMLDivElement;
  onMount(async () => {
    // @ts-ignore
    window.s = installation.sandbox;
    const shadowRoot = shadow.attachShadow({ mode: "closed" });
    installation.sandbox.setProxyOnShadowRoot(shadowRoot);
    installation.sandbox.setDistortion({
      get: (obj) => {
        if (obj == document.body) {
          throw new Error('document.body is not accessible')
        }

        if (obj == document.getElementById) {
          return {
            ok: false,
            value: (...args: any[]) => {
              return installation.sandbox.getShadowRootProxy()!.getElementById(
                // @ts-ignore
                ...args
              )
            }
          }
        }

        return {
          ok: true,
          value: undefined
        }
      }
    })


    // create index.html
    const div = document.createElement("div");
    div.id = `app`;
    shadowRoot.appendChild(div);
    console.log('shadowRoot', shadowRoot)



    const style = document.createElement('style');
    style.textContent = `
      #app {
        height: 100vh;
      }
    `;
    shadowRoot.appendChild(style);


    // const js = threeJSCube;
    const js = threeJSCubeBundle;
    const { error, output } = await esBundle(js);
    if (error) {
      console.log(error);
      return;
    }
    try {
      const result = installation.sandbox.evaluate(output);
      console.log("result", result);
    } catch (error) {
      console.log("error", error);
    }
  });

  onCleanup(() => {
    console.log("me destroyed!");
  });

  return <div ref={shadow!} class="w-full h-full" />;
}
