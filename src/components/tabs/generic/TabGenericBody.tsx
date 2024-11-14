import { onCleanup, onMount } from "solid-js";
import { appMetas, bindShadowRoot, installationOf } from "~/components/apps";

export default function TabGenericBody(props: { app_id: string }) {
  const installation = installationOf(props.app_id);
  const AppMeta = appMetas.find((AppMeta) => AppMeta.id == props.app_id);

  if (!AppMeta || !installation) {
    return <div>Not found</div>;
  }

  let shadow: HTMLDivElement;
  onMount(async () => {
    const shadowRoot = shadow.attachShadow({ mode: "closed" });
    bindShadowRoot(installation, shadowRoot);
  });

  onCleanup(() => {
    console.log("me destroyed!");
  });

  return <div ref={shadow!} id="body" class="w-full h-full" />;
}
