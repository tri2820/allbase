import { For, JSX } from "solid-js";
import AppLayout from "~/components/AppLayout";
import MiniAppLayout from "~/components/MiniAppLayout";
import { installations } from "~/components/miniapps";
import { activeTabId } from "~/components/tabs";
import TabAddBody from "~/components/tabs/add/TabAddBody";
import TabAddSidebar from "~/components/tabs/add/TabAddSidebar";
import TabGenericBody from "~/components/tabs/generic/TabGenericBody";
import TabGenericSidebar from "~/components/tabs/generic/TabGenericSidebar";
import TabProfileBody from "~/components/tabs/profile/TabProfileBody";

function TabContent(props: { children?: JSX.Element; id: string }) {
  return (
    <div
      data-show={props.id == activeTabId()}
      class="h-full data-[show=true]:block hidden"
    >
      {props.children}
    </div>
  );
}

export default function Home() {
  return (
    <AppLayout>
      <TabContent id="profile">
        <MiniAppLayout>
          <TabProfileBody />
        </MiniAppLayout>
      </TabContent>

      <TabContent id="add">
        <MiniAppLayout showSidebar sidebar={<TabAddSidebar />}>
          <TabAddBody />
        </MiniAppLayout>
      </TabContent>

      <For each={installations()}>
        {(ins) => (
          <TabContent id={ins.id}>
            <MiniAppLayout sidebar={<TabGenericSidebar />}>
              <TabGenericBody miniapp_id={ins.id} />
            </MiniAppLayout>
          </TabContent>
        )}
      </For>
    </AppLayout>
  );
}
