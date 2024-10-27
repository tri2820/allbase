import { JSX } from "solid-js";

import { Tabs } from "@kobalte/core/tabs";
import { bodyOverlay } from "~/global";
import AppBar from "./AppBar";

export default function Layout(props: { children?: JSX.Element }) {
  return (
    <Tabs
      as="div"
      onMouseMove={bodyOverlay.hideSoon}
      onMouseLeave={bodyOverlay.hideSoon}
      aria-label="Main navigation"
      class="tabs min-h-screen flex items-start"
      orientation="vertical"
    >
      <AppBar />
      <div class="relative h-screen py-2 pr-2 flex-1">
        <div class="h-full flex flex-col bg-neutral-950 rounded-lg border-neutral-900  border overflow-hidden">
          {props.children}
        </div>
      </div>
    </Tabs>
  );
}