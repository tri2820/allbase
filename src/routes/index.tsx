import { Tabs } from "@kobalte/core/tabs";
import { For } from "solid-js";
import AppLayout from "~/components/AppLayout";
import MiniAppLayout from "~/components/MiniAppLayout";
import { installations } from "~/components/miniapps";
import TabAddBody from "~/components/tabs/add/TabAddBody";
import TabAddSidebar from "~/components/tabs/add/TabAddSidebar";
import TabGenericBody from "~/components/tabs/generic/TabGenericBody";
import TabGenericSidebar from "~/components/tabs/generic/TabGenericSidebar";
import TabProfileBody from "~/components/tabs/profile/TabProfileBody";

export default function Home() {
  return (
    <AppLayout>
      <Tabs.Content class="tabs__content" value="profile">
        <MiniAppLayout>
          <TabProfileBody />
        </MiniAppLayout>
      </Tabs.Content>
      <Tabs.Content class="tabs__content" value="add">
        <MiniAppLayout sidebar={<TabAddSidebar />}>
          <TabAddBody />
        </MiniAppLayout>
      </Tabs.Content>

      <For each={installations()}>
        {(ins) => (
          <Tabs.Content class="tabs__content" value={ins.id}>
            <MiniAppLayout sidebar={<TabGenericSidebar />}>
              <TabGenericBody miniapp_id={ins.id} />
            </MiniAppLayout>
          </Tabs.Content>
        )}
      </For>
    </AppLayout>
  );
}
