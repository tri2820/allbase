import { marked } from "marked";
import { For, JSX, Show } from "solid-js";
import { Dynamic } from "solid-js/web";
import {
  installationOf,

  AppMetas,
  mkButton,
  AppMeta,
  selectedAppId,

} from "~/components/apps";

const views: Record<string, (props: any) => JSX.Element> = {
  false: () => (
    <div class="text-neutral-600">Select a app to see it's details</div>
  ),
  true: (props: { app: AppMeta }) => {
    const html = () => marked.parse(props.app.readme) as string;
    const icon = () => <props.app.icon class="w-10 h-10 " />;
    return (
      <div>
        <div class="flex items-start space-x-4">
          <div class="icon flex-none">{icon()}</div>
          <div class="flex-1">
            <div class="py-2 space-y-1">
              <div class="font-bold text-2xl">{props.app.name}</div>
              <div class="text-neutral-400 line-clamp-1">
                {props.app.author_name}
              </div>
            </div>
            <div class="text-neutral-400">{props.app.description}</div>

            <div class="flex items-center space-x-2 py-2">
              <Show
                fallback={mkButton("install")(props.app)}
                when={installationOf(props.app.id)}
              >
                {(installation) => (
                  <>
                    {mkButton("remove")(props.app)}
                    {installation().disabled
                      ? mkButton("enable")(props.app)
                      : mkButton("disable")(props.app)}
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
              <For each={props.app.categories}>
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
  const app = () => AppMetas.find((e) => e.id == selectedAppId());

  return (
    <div class="p-6  flex-1">
      <Dynamic
        component={views[app() ? "true" : "false"]}
        app={app()}
      />
    </div>
  );
}
