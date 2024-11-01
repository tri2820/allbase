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
import Icon from "~/components/Icon";

const views: Record<string, (props: any) => JSX.Element> = {
  false: () => (
    <div class="c-description">Select a app to see it's details</div>
  ),
  true: (props: { app: AppMeta }) => {
    const html = () => marked.parse(props.app.readme) as string;
    const icon = () => <Icon m={props.app} size="lg" />
    return (
      <div>
        <div class="flex items-start space-x-4">
          <div class="flex-none">{icon()}</div>
          <div class="flex-1">
            <div class="py-2 space-y-1">
              <div class="font-bold text-2xl">{props.app.name}</div>
              <div class="line-clamp-1 c-description">
                {props.app.author_name}
              </div>
            </div>
            <div class="c-description">{props.app.description}</div>

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

        <div class="divider my-4" />

        <div class="flex flex-start space-x-2 ">
          <div
            class="prose prose-invert prose-neutral text-white max-w-none flex-1 "
            innerHTML={html()}
          />

          <div class="flex-none w-40 border-l  p-2 ">
            <div class="uppercase tracking-tight text-sm py-4">Categories</div>

            <div class="flex flex-wrap gap-2">
              <For each={props.app.categories}>
                {(e) => (
                  <div class="border  px-2 py-1 text-sm">
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
