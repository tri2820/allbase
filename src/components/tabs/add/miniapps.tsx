import { IconTypes } from "solid-icons";
import {
  VsArrowBoth,
  VsCommentDiscussion,
  VsEdit,
  VsProject,
} from "solid-icons/vs";
import { createSignal } from "solid-js";
import { TaskManager } from "~/components/TaskManager";

export type MiniApp = {
  id: string;
  name: string;
  description: string;
  readme: string;
  categories: string[];
  author_name: string;
  icon: IconTypes | string;
  status: "not_installed" | "installed" | "installed_but_disabled";
};
export const miniapps: MiniApp[] = [
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
    status: "installed",
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
    status: "not_installed",
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
    status: "not_installed",
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
    status: "not_installed",
  },
];

export const [selectedMiniappId, setSelectedMiniappId] = createSignal<
  string | undefined
>(undefined);

export const actionButton = {
  install: (props: { miniapp: MiniApp }) => (
    <button
      class="button-sm"
      onClick={(e) => {
        e.stopPropagation();
        install(props.miniapp);
      }}
    >
      Install
    </button>
  ),
  remove: (props: { miniapp: MiniApp }) => (
    <button
      onClick={(e) => {
        e.stopPropagation();
        remove(props.miniapp);
      }}
      class="button-sm"
    >
      Remove
    </button>
  ),
  enable: (props: { miniapp: MiniApp }) => (
    <button
      onClick={(e) => {
        e.stopPropagation();
        enable(props.miniapp);
      }}
      class="button-sm"
    >
      Enable
    </button>
  ),
  disable: (props: { miniapp: MiniApp }) => (
    <button
      onClick={(e) => {
        e.stopPropagation();
        disable(props.miniapp);
      }}
      class="button-sm"
    >
      Disable
    </button>
  ),
};

export const install = async (miniapp: MiniApp) => {
  const id = TaskManager.addTask({
    type: "install",
    miniapp_id: miniapp.id,
    description: `Install ${miniapp.name}`,
  });

  // Install

  await new Promise((resolve) => setTimeout(resolve, 5000));
  TaskManager.markComplete(id);
};

export const remove = async (miniapp: MiniApp) => {
  const id = TaskManager.addTask({
    type: "remove",
    miniapp_id: miniapp.id,
    description: `Remove ${miniapp.name}`,
  });

  // Remove

  await new Promise((resolve) => setTimeout(resolve, 5000));
  TaskManager.markComplete(id);
};

export const enable = async (miniapp: MiniApp) => {
  const id = TaskManager.addTask({
    type: "enable",
    miniapp_id: miniapp.id,
    description: `Enable ${miniapp.name}`,
  });

  // Enable

  await new Promise((resolve) => setTimeout(resolve, 5000));
  TaskManager.markComplete(id);
};

export const disable = async (miniapp: MiniApp) => {
  const id = TaskManager.addTask({
    type: "disable",
    miniapp_id: miniapp.id,
    description: `Disable ${miniapp.name}`,
  });

  // Disable

  await new Promise((resolve) => setTimeout(resolve, 5000));
  TaskManager.markComplete(id);
};
