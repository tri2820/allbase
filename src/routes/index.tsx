import { Tabs } from "@kobalte/core/tabs";
import AppLayout from "~/components/AppLayout";
import MiniAppLayout from "~/components/MiniAppLayout";
import TabAddBody from "~/components/tabs/add/TabAddBody";
import TabAddSidebar from "~/components/tabs/add/TabAddSidebar";
import TabChatBody from "~/components/tabs/chat/TabChatBody";
import TabProfileBody from "~/components/tabs/profile/TabProfileBody";

export default function Home() {
  return (
    <AppLayout>
      <Tabs.Content class="tabs__content " value="chat">
        <MiniAppLayout>
          <TabChatBody />
        </MiniAppLayout>
      </Tabs.Content>
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
    </AppLayout>
  );
}
