import { onCleanup, onMount } from "solid-js";
import { installationOf, AppMetas } from "~/components/apps";
import esBundle from "~/lib/bundler";
import threeJSCube from "~/test/threejs-cube?raw";
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
    installation.sandbox.shadowRoot = shadow.attachShadow({ mode: "closed" });
    const div = document.createElement("div");
    div.id = `shadow-dom`;
    div.style.width = "100%";
    div.style.height = "100%";

    installation.sandbox.shadowRoot.appendChild(div);

    const js = threeJSCube;
    const { error, output } = await esBundle(js);
    if (error) {
      console.log(error);
      return;
    }
    console.log("output", output);
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
