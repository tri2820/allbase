import { DropdownMenu } from "@kobalte/core/dropdown-menu";
import { Tabs } from "@kobalte/core/tabs";
import {
  VsAccount,
  VsAdd,
  VsCommentDiscussion,
  VsLoading,
  VsPassFilled,
  VsPulse,
  VsTerminal,
  VsTerminalBash,
  VsTerminalCmd,
} from "solid-icons/vs";
import { createEffect, createSignal, For, JSX, onMount, Show } from "solid-js";
import { newTaskHint, setNewTaskHint, sortedTasks } from "./tasks";
import { install, installations, AppMetas } from "~/components/apps";
import { activeTabId, setActiveTabId } from "./tabs";

function TabsIndicator() {
  const [show, setShow] = createSignal(false);
  let ref: HTMLDivElement;
  onMount(() => {
    const observer = new MutationObserver(() => {
      const activeTab = document.querySelector("[data-tab-active='true']");
      if (activeTab) {
        const rect = activeTab.getBoundingClientRect();
        ref.style.top = `${rect.top}px`;
        ref.style.left = `${rect.left - 10}px`;
      }
    });
    observer.observe(document.body, {
      subtree: true,
      attributes: true,
      attributeFilter: ["data-tab-active"],
    });

    const first = document.querySelector("[data-tab-trigger-id]");
    if (!first) return;

    const rect = first.getBoundingClientRect();
    ref.style.top = `${rect.top - 1}px`;
    ref.style.left = `${rect.left - 10}px`;
    setActiveTabId(first.getAttribute("data-tab-trigger-id")!);
    setShow(true);
  });

  return (
    <div
      ref={ref!}
      data-show={show()}
      class="fixed w-1 rounded-full h-11 bg-white duration-150 hidden data-[show=true]:block"
    />
  );
}

function TabTrigger(props: { children: JSX.Element; id: string }) {
  return (
    <div
      data-tab-trigger-id={props.id}
      onClick={() => {
        setActiveTabId(props.id);
      }}
      data-tab-active={props.id === activeTabId()}
      class="text-neutral-500 m-2 bg-white/5 rounded-lg border border-neutral-900 shadow-lg p-2 cursor-pointer hover:bg-white/10 hover:text-white data-[tab-active=true]:bg-white/10 data-[tab-active=true]:text-white"
    >
      {props.children}
    </div>
  );
}

export default function AppBar() {
  return (
    <div class="bg-black flex flex-col h-screen overflow-y-auto overflow-x-hidden items-center py-4 hide-scrollbar">
      <DropdownMenu
        onOpenChange={() => {
          setNewTaskHint(false);
        }}
      >
        <DropdownMenu.Trigger class="dropdown-menu__trigger relative">
          <Show when={newTaskHint()}>
            <span class="absolute z-[50] -right-2 -top-2 h-4 w-4 rounded-full bg-sky-400" />
            <span class="absolute z-[50] blur -right-2 -top-2 h-4 w-4 rounded-full bg-sky-400 opacity-50 "></span>
          </Show>

          <DropdownMenu.Icon class=" flex items-center justify-center" as="div">
            <VsPulse class="w-6 h-6" />
          </DropdownMenu.Icon>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content class="dropdown-menu__content max-h-60 overflow-auto nice-scrollbar">
            <Show
              when={sortedTasks().length > 0}
              fallback={
                <div class="p-2 px-4 ">
                  <span class="text-sm">No tasks running</span>
                </div>
              }
            >
              <div class="max-h-52 nice-scrollbar">
                <div class="uppercase tracking-tight text-xs px-4 text-neutral-500">
                  Activities
                </div>

                <For each={sortedTasks()}>
                  {(task) => (
                    <div
                      class="p-2 px-4 flex items-center space-x-2  data-[completed=false]:animate-pulse max-w-sm overflow-hidden"
                      data-completed={task.completed ? true : false}
                    >
                      <div class="flex-none">
                        <Show
                          when={task.completed}
                          fallback={<VsLoading class="w-4 h-4 animate-spin" />}
                        >
                          <VsPassFilled class="w-4 h-4" />
                        </Show>
                      </div>
                      <div class="text-sm truncate">{task.description}</div>
                    </div>
                  )}
                </For>
              </div>
            </Show>
            <DropdownMenu.Arrow />
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu>

      <div class="w-full px-4">
        <div class="bg-neutral-900 h-[1px] " />
      </div>

      <div class="pl-[1px]">
        <TabTrigger id="add">
          <VsAdd class="w-6 h-6 " />
        </TabTrigger>
        <TabTrigger id="profile">
          <VsAccount class="w-6 h-6 " />
        </TabTrigger>

        <For each={installations()}>
          {(ins) => {
            const app = AppMetas.find((m) => m.id == ins.id);
            if (!app) return <></>;
            return (
              <TabTrigger id={ins.id}>
                <app.icon class="w-6 h-6" />
              </TabTrigger>
            );
          }}
        </For>

        <TabsIndicator />
      </div>
    </div>
  );
}
