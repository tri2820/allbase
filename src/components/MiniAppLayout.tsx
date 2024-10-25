import { Tabs } from "@kobalte/core/tabs";
import { JSX, Show } from "solid-js";

export default function MiniAppLayout(props: {
  sidebar?: JSX.Element;
  children?: JSX.Element;
}) {
  return (
    <div class="flex items-start h-full">
      <Show when={props.sidebar}>
        <div class="w-80 h-full border-r border-neutral-900 overflow-y-auto overflow-x-hidden nice-scrollbar">
          {props.sidebar}
        </div>
      </Show>

      <div class="h-full flex-1 overflow-y-auto overflow-x-hidden nice-scrollbar">
        {props.children}
      </div>
    </div>
  );
}
