import { IconTypes } from "solid-icons";
import { BsBugFill, BsChatFill, BsCursorFill, BsKanban, BsPassFill, BsPenFill, BsSafe, BsSafeFill } from "solid-icons/bs";
import { createSignal } from "solid-js";
import {
  addTask,
  markComplete,
  RunningTaskData
} from "~/components/tasks";
import { sw } from "~/global";
import { Sandbox } from "~/lib/sandbox/sanbox";

export type AppMeta = {
  id: string;
  name: string;
  description: string;
  readme: string;
  categories: string[];
  author_name: string;
  icon: IconTypes | string;
  backgroundColor: `#${string}`;
};

export const [installations, setInstallations] = createSignal<Installation[]>(
  []
);
export type Installation = {
  id: string;
  sandbox: Sandbox;
  disabled: boolean;
};

export const AppMetas: AppMeta[] = [
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
    icon: BsChatFill,
    categories: ["Communication", "Collaboration"],
    backgroundColor: '#129aab'
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
    icon: BsKanban,
    categories: ["Productivity", "Project Management"],
    backgroundColor: '#fa3a4a'
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
    icon: BsPenFill,
    categories: ["Productivity", "Note-taking"],
    backgroundColor: '#0ba749'
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
    icon: BsBugFill,
    categories: ["Development", "Testing"],
    backgroundColor: '#992bff'
  },
  {
    id: "0000-0000-0000-0014",
    name: "Password Vault",
    description:
      "Safely store and manage your passwords. Auto-fill login credentials with a single click.",
    readme: `# Password Vault

Safely store and manage your passwords. Auto-fill login credentials with a single click.

## Features

- Store passwords
- Auto-fill login credentials

## How to use

1. Open the app
2. Click on the add button to add a new password
3. Type in the password name and password
4. Click save to save the password
5. Click on a password to auto-fill the login credentials
`,
    author_name: "AllBase",
    icon: BsSafeFill,
    categories: ["Security", "Password Management"],
    backgroundColor: '#4a53fa'
  },
  {
    id: "0000-0000-0000-0015",
    name: "Whiteboard",
    description: "A collaborative whiteboard app for team brainstorming and visual note-taking",
    readme: "# Whiteboard\n\nWhiteboard is a collaborative digital canvas designed for teams and individuals to brainstorm, sketch, and share ideas. Perfect for project planning, flowcharts, and real-time team collaboration.\n\n## Features\n\n- Draw and erase\n- Type notes\n- Real-time collaboration\n- Sticky notes and shapes\n- Image import\n\n## How to Use\n\n1. Open the app and start or join a board.\n2. Click and drag to draw; use the eraser to remove items.\n3. Add text anywhere by clicking on the board.\n4. Organize ideas with sticky notes and shapes.\n5. Invite teammates to collaborate in real-time.\n\n---\n\nCreated by AllBase",
    author_name: "AllBase",
    icon: BsCursorFill,
    categories: ["Productivity", "Collaboration", "Notes"],
    backgroundColor: "#fd6005"
  }

];

export const [selectedAppId, setSelectedAppId] = createSignal<
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


export const install = async (app: AppMeta) => {
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  // sw().postMessage({
  //   type: 'INSTALL_APP',
  //   app_id: app.id,
  //   path: 'https://github.com/tri2820/allbase/tree/main/examples/three-cube/dist',
  //   offline: false
  // });
  // return;


  Sandbox.lockdown();
  const installation = {
    id: app.id,
    disabled: false,
    sandbox: new Sandbox({
      id: app.id,
    }),
  };
  setInstallations([...installations(), installation]);
};

export const remove = async (app: AppMeta) => {
  // Remove
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  setInstallations([
    ...installations().filter((installation) => installation.id != app.id),
  ]);
};

export const enable = async (app: AppMeta) => {
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  const installation = installationOf(app.id);
  if (!installation) return;
  setInstallations([
    ...installations().filter((installation) => installation.id != app.id),
    {
      ...installation,
      disabled: false,
    },
  ]);
};

export const disable = async (app: AppMeta) => {
  // Disable
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  const installation = installationOf(app.id);
  if (!installation) return;
  setInstallations([
    ...installations().filter((installation) => installation.id != app.id),
    {
      ...installation,
      disabled: true,
    },
  ]);
};

export const installationOf = (app_id: string) =>
  installations().find((installation) => installation.id == app_id);

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

  const taskAction = taskify(f)((app) => ({
    type,
    app_id: app.id,
    description: `${label} ${app.name}`,
  }));

  return (app: AppMeta) => {
    const [doing, setDoing] = createSignal(false);

    return (
      <button
        onClick={async (e) => {
          e.stopPropagation();
          setDoing(true);
          await taskAction(app);
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
