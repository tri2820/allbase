import { marked } from "marked";
import { For, JSX, Show } from "solid-js";
import { Dynamic } from "solid-js/web";
import {
  installationOf,
  MiniAppMeta,
  miniappMetas,
  mkButton,
  selectedMiniappId,
} from "~/components/miniapps";

const views: Record<string, (props: any) => JSX.Element> = {
  false: () => (
    <div class="text-neutral-600">Select a miniapp to see it's details</div>
  ),
  true: (props: { miniapp: MiniAppMeta }) => {
    const html = () => marked.parse(props.miniapp.readme) as string;
    const icon = () => <props.miniapp.icon class="w-10 h-10 " />;
    return (
      <div>
        <div class="flex items-start space-x-4">
          <div class="icon flex-none">{icon()}</div>
          <div class="flex-1">
            <div class="font-bold text-2xl">{props.miniapp.name}</div>
            <div class="text-neutral-400">{props.miniapp.description}</div>
            <div class="flex items-center space-x-2 py-2">
              <Show
                fallback={mkButton("install")(props.miniapp)}
                when={installationOf(props.miniapp.id)}
              >
                {(installation) => (
                  <>
                    {mkButton("remove")(props.miniapp)}
                    {installation().disabled
                      ? mkButton("enable")(props.miniapp)
                      : mkButton("disable")(props.miniapp)}
                  </>
                )}
              </Show>
            </div>
          </div>
        </div>

        <div class="h-[1px] w-full bg-neutral-900 my-4" />

        <div class="flex flex-start space-x-2 ">
          <div
            class="prose prose-invert text-white max-w-none flex-1 "
            innerHTML={html()}
          />

          <div class="flex-none w-40 border-l border-neutral-900 p-2 ">
            <div class="uppercase tracking-tight text-sm py-4">Categories</div>

            <div class="flex flex-wrap gap-2">
              <For each={props.miniapp.categories}>
                {(e) => (
                  <div class="border border-neutral-900 px-2 py-1 text-sm">
                    {e}
                  </div>
                )}
              </For>
            </div>
          </div>
        </div>
      </div>
    );
  },
};

export default function TabAddBody() {
  const miniapp = () => miniappMetas.find((e) => e.id == selectedMiniappId());

  return (
    <div class="p-6  flex-1">
      <Dynamic
        component={views[miniapp() ? "true" : "false"]}
        miniapp={miniapp()}
      />
    </div>
  );
}
