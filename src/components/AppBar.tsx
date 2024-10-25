import { DropdownMenu } from "@kobalte/core/dropdown-menu";
import { Tabs } from "@kobalte/core/tabs";
import {
  VsAccount,
  VsAdd,
  VsCheck,
  VsCommentDiscussion,
  VsLoading,
  VsPassFilled,
  VsPulse,
} from "solid-icons/vs";
import { Show } from "solid-js";
import { newTaskHint, setNewTaskHint, TaskManager } from "./TaskManager";

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
          <DropdownMenu.Content class="dropdown-menu__content">
            <Show
              when={TaskManager.sortedTasks().length > 0}
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

                {TaskManager.sortedTasks().map((task) => (
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
                ))}
              </div>
            </Show>
            <DropdownMenu.Arrow />
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu>

      <div class="w-full px-4">
        <div class="bg-neutral-900 h-[1px] " />
      </div>

      <Tabs.List class="tabs__list">
        <Tabs.Trigger class="tabs__trigger" value="add" as="div">
          <VsAdd class="w-6 h-6 " />
        </Tabs.Trigger>
        <Tabs.Trigger class="tabs__trigger" value="profile" as="div">
          <VsAccount class="w-6 h-6 " />
        </Tabs.Trigger>
        <Tabs.Trigger class="tabs__trigger " value="chat" as="div">
          <VsCommentDiscussion class="w-6 h-6" />
        </Tabs.Trigger>
        <Tabs.Indicator class="tabs__indicator" />
      </Tabs.List>
    </div>
  );
}
