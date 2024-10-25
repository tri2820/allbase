import { onCleanup, onMount } from "solid-js";
import { installationOf, miniappMetas } from "~/components/miniapps";
import esBundle from "~/lib/bundler";

export default function TabGenericBody(props: { miniapp_id: string }) {
  const installation = installationOf(props.miniapp_id);
  const miniappMeta = miniappMetas.find(
    (miniappMeta) => miniappMeta.id == props.miniapp_id
  );

  if (!miniappMeta || !installation) {
    return <div>Not found</div>;
  }

  let shadow: HTMLDivElement;
  onMount(async () => {
    installation.sandbox.shadowRoot = shadow.attachShadow({ mode: "closed" });
    const js = `
      (() => {
        const div = document.createElement("div");
        div.textContent = "This is the generic tab's shadow root";
        globalThis.shadowRoot.appendChild(div);
      })()
    `;
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

  return <div ref={shadow!} />;
}
