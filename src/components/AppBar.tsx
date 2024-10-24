import { Tabs } from "@kobalte/core/tabs";
import { A, useLocation } from "@solidjs/router";
import {
  VsAccount,
  VsAdd,
  VsCode,
  VsCommentDiscussion,
  VsExtensions,
  VsHome,
  VsSearch,
} from "solid-icons/vs";
// import { setSidebarClose } from "./Sidebar";
import { createEffect, createSignal, untrack } from "solid-js";

// import { textChannelId, textChannels, voiceChannelId } from "~/signals";

// const [redirectTo, setRedirectTo] = createSignal<string>();
// const t = textChannels()?.at(0)?.id;
// const firstTextChannel = t ? `/text-channel/${t}` : undefined;
// function DiscussionButton() {
//   const loc = useLocation();
//   const active = () =>
//     loc.pathname.startsWith("/text-channel") ||
//     loc.pathname.startsWith("/voice-channel");
//   createEffect(() => {
//     let _redirect_to = untrack(() => redirectTo());
//     if (textChannelId()) _redirect_to = `/text-channel/${textChannelId()}`;
//     if (voiceChannelId()) _redirect_to = `/voice-channel/${voiceChannelId()}`;
//     setRedirectTo(_redirect_to);
//   });

//   return (
//     <A
//       href={redirectTo() ?? firstTextChannel ?? "/"}
//       data-active={active()}
//       class="text-hover p-3 data-[active=true]:border-l-4"
//       onClick={() => {
//         setSidebarClose(false);
//       }}
//     >
//       <VsCommentDiscussion class="w-6 h-6" />
//     </A>
//   );
// }

function ExtensionsButton() {
  const loc = useLocation();
  return (
    <A
      href="/"
      data-active={loc.pathname == "/"}
      class="text-hover p-3 data-[active=true]:border-l-4"
    >
      <VsExtensions class="w-6 h-6" />
    </A>
  );
}

function SearchButton() {
  const loc = useLocation();
  return (
    <A
      href="/search"
      data-active={loc.pathname == "/search"}
      class="text-hover p-3 data-[active=true]:border-l-4"
    >
      <VsSearch class="w-6 h-6" />
    </A>
  );
}

export default function AppBar() {
  return (
    <div class="bg-black flex flex-col h-screen overflow-hidden items-center py-4">
      <Tabs.List class="tabs__list">
        <Tabs.Trigger class="tabs__trigger " value="chat" as="div">
          <VsCommentDiscussion class="w-6 h-6" />
        </Tabs.Trigger>
        <Tabs.Trigger class="tabs__trigger" value="profile" as="div">
          <VsAccount class="w-6 h-6 " />
        </Tabs.Trigger>
        <Tabs.Trigger class="tabs__trigger" value="add" as="div">
          <VsAdd class="w-6 h-6 " />
        </Tabs.Trigger>
        <Tabs.Indicator class="tabs__indicator" />
      </Tabs.List>
    </div>
  );
}
