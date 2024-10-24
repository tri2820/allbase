import { Tabs } from "@kobalte/core/tabs";
import { JSX } from "solid-js";

export default function MiniAppLayout(props: {
  sidebar?: JSX.Element;
  children?: JSX.Element;
}) {
  return (
    <div class="flex items-start h-full">
      <div
        class="w-80 h-full border-r border-neutral-900 overflow-y-auto overflow-x-hidden"
        data-simplebar
      >
        {props.sidebar}
      </div>

      <div
        class="flex flex-col h-full flex-1 overflow-y-auto overflow-x-hidden"
        data-simplebar
      >
        {props.children}
      </div>
    </div>
  );
}
