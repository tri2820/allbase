import { onMount } from "solid-js";
import { install, installationOf, miniappMetas } from "~/components/miniapps";
import * as esbuild from "esbuild-wasm";
import { fetchPlugin } from "~/lib/bundler/plugins/fetch-plugin";
import { unpkgPathPlugin } from "~/lib/bundler/plugins/unpkg-path-plugin";
import esBundle from "~/lib/bundler";

export default function TabGenericBody(props: { miniapp_id: string }) {
  const installation = installationOf(props.miniapp_id);
  const miniappMeta = miniappMetas.find(
    (miniappMeta) => miniappMeta.id == props.miniapp_id
  );

  if (!miniappMeta || !installation) {
    return <div>Not found</div>;
  }

  onMount(async () => {
    const js = `console.log(globalThis, globalThis.Math)`;
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

  return (
    <div>
      {JSON.stringify(miniappMeta)} {JSON.stringify(installation)}
    </div>
  );
}
