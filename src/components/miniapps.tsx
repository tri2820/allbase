import { IconTypes } from "solid-icons";
import {
  VsArrowBoth,
  VsCommentDiscussion,
  VsEdit,
  VsProject,
} from "solid-icons/vs";
import { createSignal } from "solid-js";
import {
  addTask,
  markComplete,
  RunningTask,
  RunningTaskData,
} from "~/components/tasks";
import { Sandbox } from "~/lib/sandbox/sanbox";

export type MiniAppMeta = {
  id: string;
  name: string;
  description: string;
  readme: string;
  categories: string[];
  author_name: string;
  icon: IconTypes | string;
};

export const [installations, setInstallations] = createSignal<Installation[]>(
  []
);
export type Installation = {
  id: string;
  sandbox: Sandbox;
  disabled: boolean;
};

export const miniappMetas: MiniAppMeta[] = [
  {
    id: "0000-0000-0000-0009",

    name: "Communication Hub",
    description:
      "Bring every conversation together—stay in the loop without the clutter.",
    readme: `# Communication Hub

Bring every conversation together—stay in the loop without the clutter.

- Get real-time notifications
- Create threads to keep conversations organized
- Collaborate with others in real-time
- View all your conversations in one place

The communication hub is a central location for all your conversations. It's the easiest way to stay connected with your team and keep your conversations organized.

## Features

- Real-time notifications
- Threaded conversations
- Real-time collaboration
- Centralized conversations

## How to use

1. Open the communication hub
2. Click on a conversation to view it
3. Click on the compose button to start a new conversation
4. Type in the recipient's name and add a message
5. Click send to send the message

`,
    author_name: "AllBase",
    icon: VsCommentDiscussion,
    categories: ["Communication", "Collaboration"],
  },
  {
    id: "0000-0000-0000-0002",
    name: "Threejs Cube",
    description: "A simple test app for AllBase. Renders a Threejs cube.",
    readme: `# Threejs Cube

A simple test app for AllBase. Renders a Threejs cube.

## Features

- Renders a Threejs cube

## How to use

1. Open the app
2. Click on the cube to rotate it

`,
    author_name: "AllBase",
    icon: VsArrowBoth,
    categories: ["Development", "Testing"],
  },

  {
    id: "0000-0000-0000-0012",
    name: "Project Management Board",
    description:
      "Plan and track projects with Kanban boards, Gantt charts, and real-time collaboration.",
    readme: `# Project Management Board

Plan and track projects with Kanban boards, Gantt charts, and real-time collaboration.

## Features

- Kanban boards
- Gantt charts
- Real-time collaboration

## How to use

1. Create a new board
2. Add columns to the board
3. Add tasks to the columns
4. Click on a task to view its details
5. Click on the assignee button to assign a task to someone
6. Click on the comment button to add a comment to a task

`,
    author_name: "AllBase",
    icon: VsProject,
    categories: ["Productivity", "Project Management"],
  },
  {
    id: "0000-0000-0000-0016",
    name: "Collaborative Notes",
    description:
      "A powerful note-taking tool with templates, rich text editing and real-time collaboration.",
    readme: `# Collaborative Notes

A powerful note-taking tool with templates, rich text editing and real-time collaboration.

## Features

- Templates
- Rich text editing
- Real-time collaboration

## How to use

1. Create a new note
2. Choose a template
3. Start typing
4. Click on the share button to share the note with others
5. Click on the comment button to add a comment to the note
`,
    author_name: "AllBase",
    icon: VsEdit,
    categories: ["Productivity", "Note-taking"],
  },
];

export const [selectedMiniappId, setSelectedMiniappId] = createSignal<
  string | undefined
>(undefined);

export function taskify<T>(f: (props: T) => Promise<void>) {
  return (mkTask: (props: T) => RunningTaskData) => {
    return async (props: T) => {
      const task = mkTask(props);
      const id = addTask(task);
      await f(props);
      markComplete(id);
    };
  };
}

export const install = async (miniapp: MiniAppMeta) => {
  // await new Promise((resolve) => setTimeout(resolve, 1000));

  Sandbox.lockdown();
  const installation = {
    id: miniapp.id,
    disabled: false,
    sandbox: new Sandbox({
      id: miniapp.id,
    }),
  };
  setInstallations([...installations(), installation]);
};

export const remove = async (miniapp: MiniAppMeta) => {
  // Remove
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  setInstallations([
    ...installations().filter((installation) => installation.id != miniapp.id),
  ]);
};

export const enable = async (miniapp: MiniAppMeta) => {
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  const installation = installationOf(miniapp.id);
  if (!installation) return;
  setInstallations([
    ...installations().filter((installation) => installation.id != miniapp.id),
    {
      ...installation,
      disabled: false,
    },
  ]);
};

export const disable = async (miniapp: MiniAppMeta) => {
  // Disable
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  const installation = installationOf(miniapp.id);
  if (!installation) return;
  setInstallations([
    ...installations().filter((installation) => installation.id != miniapp.id),
    {
      ...installation,
      disabled: true,
    },
  ]);
};

export const installationOf = (miniapp_id: string) =>
  installations().find((installation) => installation.id == miniapp_id);

export function mkButton(type: "install" | "remove" | "enable" | "disable") {
  const { f, label, doingLabel } = {
    install: {
      f: install,
      label: "Install",
      doingLabel: "Installing...",
    },
    remove: {
      f: remove,
      label: "Remove",
      doingLabel: "Removing...",
    },
    enable: {
      f: enable,
      label: "Enable",
      doingLabel: "Enabling...",
    },
    disable: {
      f: disable,
      label: "Disable",
      doingLabel: "Disabling...",
    },
  }[type];

  const taskAction = taskify(f)((miniapp) => ({
    type,
    miniapp_id: miniapp.id,
    description: `${label} ${miniapp.name}`,
  }));

  return (miniapp: MiniAppMeta) => {
    const [doing, setDoing] = createSignal(false);

    return (
      <button
        onClick={async (e) => {
          e.stopPropagation();
          setDoing(true);
          await taskAction(miniapp);
          setDoing(false);
        }}
        class="button-sm"
        disabled={doing()}
      >
        {doing() ? doingLabel : label}
      </button>
    );
  };
}
