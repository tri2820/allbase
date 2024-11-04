import { IconTypes } from "solid-icons";
import {
  BsBugFill,
  BsChatFill,
  BsCursorFill,
  BsKanban,
  BsPenFill,
  BsSafeFill,
  BsTable,
} from "solid-icons/bs";
import { createSignal } from "solid-js";
import { addTask, markComplete, RunningTaskData } from "~/components/tasks";
import { compile } from "~/lib/compiler";
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
  index: string;
};

export const [installations, setInstallations] = createSignal<Installation[]>(
  []
);
export type Installation = {
  id: string;
  disabled: boolean;
  onShadowRoot: (shadowRoot: ShadowRoot) => void
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
    backgroundColor: "#129aab",
    index:
      "https://github.com/tri2820/allbase/blob/main/examples/three-cube/dist/index.html",
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
    backgroundColor: "#fa3a4a",
    index:
      "https://github.com/tri2820/allbase/blob/main/examples/three-cube/dist/index.html",
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
    backgroundColor: "#0ba749",
    index:
      "https://github.com/tri2820/allbase/blob/main/examples/three-cube/dist/index.html",
  },

  {
    id: "0000-0000-0000-0014",
    name: "Table",
    description:
      "Create and edit tables with formulas and formatting. Collaborate with others in real-time.",
    readme: `# Table

Create and edit tables with formulas and formatting. Collaborate with others in real-time.

## Features

- Create and edit tables
- Formulas
- Formatting
- Real-time collaboration

## How to use

1. Open the app
2. Click on the add button to add a new table
3. Type in the table name
4. Click save to save the table
5. Click on a table to edit it
6. Type in a formula to calculate values
7. Use the formatting options to change the appearance of the table
`,
    author_name: "AllBase",
    icon: BsTable,
    categories: ["Productivity", "Table"],
    backgroundColor: "#4a53fa",
    index:
      "https://github.com/tri2820/allbase/blob/main/examples/three-cube/dist/index.html",
  },
  {
    id: "0000-0000-0000-0015",
    name: "Whiteboard",
    description:
      "A collaborative whiteboard app for team brainstorming and visual note-taking",
    readme:
      "# Whiteboard\n\nWhiteboard is a collaborative digital canvas designed for teams and individuals to brainstorm, sketch, and share ideas. Perfect for project planning, flowcharts, and real-time team collaboration.\n\n## Features\n\n- Draw and erase\n- Type notes\n- Real-time collaboration\n- Sticky notes and shapes\n- Image import\n\n## How to Use\n\n1. Open the app and start or join a board.\n2. Click and drag to draw; use the eraser to remove items.\n3. Add text anywhere by clicking on the board.\n4. Organize ideas with sticky notes and shapes.\n5. Invite teammates to collaborate in real-time.\n\n---\n\nCreated by AllBase",
    author_name: "AllBase",
    icon: BsCursorFill,
    categories: ["Productivity", "Collaboration", "Notes"],
    backgroundColor: "#fd6005",
    index:
      "https://github.com/tri2820/allbase/blob/main/examples/three-cube/dist/index.html",
  },
  {
    id: "0000-0000-0000-0002",
    name: "Test app",
    description: "A simple test app for AllBase. Renders a 3D cube.",
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
    backgroundColor: "#992bff",
    index:
      "https://github.com/tri2820/allbase/blob/main/examples/three-cube/dist/index.html",
  },
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
  let resolvePath: (relativePath: string) => string;
  const url = new URL(app.index);

  const segments = url.pathname.split("/");
  const indexFile = segments.pop();

  if (!indexFile) {
    throw new Error("No index file found");
  }

  const folderUrl = `${url.origin}${segments.join("/")}/`;
  console.log("folderUrl", folderUrl);
  console.log('indexFile', indexFile);

  // If the host is github.com
  // Modify the URL to include the raw parameter 
  if (url.hostname === "github.com") {
    // WARNING: Only works for root-relative paths
    resolvePath = (relativePath: string) => {
      if (relativePath.startsWith("/")) relativePath = relativePath.slice(1);
      console.log('called with', relativePath);
      const url = new URL(relativePath, folderUrl);
      url.searchParams.set("raw", "true");
      const absolutePath = url.toString();
      console.log('return', absolutePath, folderUrl);
      return absolutePath;
    }
  }
  // ... other hosts
  // Fallback
  else {
    resolvePath = (relativePath: string) => {
      if (relativePath.startsWith("/")) relativePath = relativePath.slice(1);
      const url = new URL(relativePath, folderUrl);
      return url.toString();
    }

  }

  const indexPath = resolvePath(indexFile);
  const proxyPath = `/proxy?url=${encodeURIComponent(indexPath)}`;
  let compiledResult: ReturnType<typeof compile>;
  try {
    const response = await fetch(proxyPath);
    const html = await response.text();
    compiledResult = compile(html);
    console.log("Compiled result:", compiledResult, html, proxyPath);
  } catch (error) {
    console.error("Error:", error);
    return;
  }


  Sandbox.lockdown();
  const sandbox = new Sandbox({
    id: app.id,
  });


  const onShadowRoot = (shadowRoot: ShadowRoot) => {
    sandbox.setProxyOnShadowRoot(shadowRoot);
    sandbox.setDistortion({
      get: (obj) => {
        if (obj == document.body) {
          throw new Error('document.body is not accessible')
        }

        if (obj == document.getElementById) {
          return {
            ok: false,
            value: (...args: any[]) => {
              return sandbox.getShadowRootProxy()!.getElementById(
                // @ts-ignore
                ...args
              )
            }
          }
        }

        return {
          ok: true,
          value: undefined
        }
      }
    })

    console.log('set innerHTML');
    shadowRoot.innerHTML = compiledResult.body;


    compiledResult.stylesheets.forEach(async (stylesheet) => {
      const styleElement = document.createElement('style');
      if (stylesheet.href) {
        console.log(stylesheet.href);
        const absolutePath = resolvePath(stylesheet.href);
        const proxyPath = `/proxy?url=${encodeURIComponent(absolutePath)}`;
        const response = await fetch(proxyPath);
        styleElement.textContent = await response.text();
      } else {
        styleElement.textContent = stylesheet.content;
      }
      shadowRoot.appendChild(styleElement);
    });

    compiledResult.scripts.forEach(async (script) => {
      let js: string;
      if (script.src) {
        const absolutePath = resolvePath(script.src);
        const proxyPath = `/proxy?url=${encodeURIComponent(absolutePath)}`;
        const response = await fetch(proxyPath);
        js = await response.text();
      } else {
        js = script.content;
      }

      sandbox.evaluate(js);
    })
  }

  const installation = {
    id: app.id,
    disabled: false,
    onShadowRoot,
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
