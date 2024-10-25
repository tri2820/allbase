import { For } from "solid-js/web";
import {
  installationOf,
  miniappMetas,
  mkButton,
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
        <For each={miniappMetas}>
          {(m) => {
            const btn = () => {
              const installation = installationOf(m.id);
              if (installation) {
                if (installation.disabled) {
                  return mkButton("enable");
                }
                return mkButton("remove");
              }
              return mkButton("install");
            };

            // const doingLabel = () => {
            //   if (
            //     tasks().some(
            //       (t) =>
            //         t.type == "install" && t.miniapp_id == m.id && !t.completed
            //     )
            //   ) {
            //     return "Installing";
            //   }

            //   if (
            //     tasks().some(
            //       (t) =>
            //         t.type == "remove" && t.miniapp_id == m.id && !t.completed
            //     )
            //   ) {
            //     return "Removing";
            //   }

            //   if (
            //     tasks().some(
            //       (t) =>
            //         t.type == "disable" && t.miniapp_id == m.id && !t.completed
            //     )
            //   ) {
            //     return "Disabling";
            //   }

            //   if (
            //     tasks().some(
            //       (t) =>
            //         t.type == "enable" && t.miniapp_id == m.id && !t.completed
            //     )
            //   ) {
            //     return "Enabling";
            //   }
            // };

            return (
              <div
                onClick={() => {
                  if (selectedMiniappId() == m.id) {
                    setSelectedMiniappId();
                    return;
                  }
                  setSelectedMiniappId(m.id);
                }}
                data-selected={selectedMiniappId() == m.id}
                class="flex items-start cursor-pointer space-x-4 px-6 py-4 hover:bg-neutral-900 data-[selected=true]:bg-neutral-900"
              >
                <div class="icon flex-none">
                  <m.icon class="w-8 h-8 " />
                </div>
                <div class="flex-1 space-y-1">
                  <div class="font-bold line-clamp-1 leading-none">
                    {m.name}
                  </div>
                  <div class="text-neutral-400 line-clamp-1 leading-none ">
                    {m.description}
                  </div>
                  <div class="flex items-center w-full ">
                    <div class="flex-1 text-neutral-400 text-xs line-clamp-1 font-semibold leading-none ">
                      {m.author_name}
                    </div>
                    {btn()(m)}
                  </div>
                </div>
              </div>
            );
          }}
        </For>
      </div>
    </div>
  );
}
