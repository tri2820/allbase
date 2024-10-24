import { Dynamic, For } from "solid-js/web";
import {
  actionLabel,
  miniapps,
  selectedMiniappId,
  setSelectedMiniappId,
} from "./miniapps";

export default function TabAddSidebar() {
  return (
    <div class="overflow-y-auto overflow-x-hidden flex-1">
      <div class="uppercase tracking-tight text-sm py-4 px-6">MiniApps</div>

      <div class="px-6 py-2">
        <input class="outline-none w-full bg-neutral-900 rounded border border-neutral-800 p-1 text-sm" />
      </div>

      <div>
        <For each={miniapps}>
          {(e) => (
            <div
              onClick={() => {
                if (selectedMiniappId() == e.id) {
                  setSelectedMiniappId();
                  return;
                }
                setSelectedMiniappId(e.id);
              }}
              data-selected={selectedMiniappId() == e.id}
              class="flex items-start cursor-pointer space-x-4 px-6 py-4 hover:bg-neutral-900 data-[selected=true]:bg-neutral-900"
            >
              <div class="icon flex-none">
                <e.icon class="w-8 h-8 " />
              </div>
              <div class="flex-1 space-y-1">
                <div class="font-bold line-clamp-1 leading-none">{e.name}</div>
                <div class="text-neutral-400 line-clamp-1 leading-none ">
                  {e.description}
                </div>
                <div class="flex items-center w-full ">
                  <div class="flex-1 text-neutral-400 text-xs line-clamp-1 font-semibold leading-none ">
                    {e.author_name}
                  </div>
                  <button class="button-sm">
                    <Dynamic component={actionLabel[e.status]} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}
