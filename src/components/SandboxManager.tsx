import "ses";
import { createSignal } from "solid-js";
import { Sandbox } from "~/lib/sandbox/sanbox";

const [sandboxes, setSandboxes] = createSignal<Sandbox[]>([]);
export class SandboxManager {
  static lockdown() {
    if (window.sesLockedDown) return;
    window.sesLockedDown = true;
    lockdown({
      errorTaming: "unsafe-debug",
      consoleTaming: "unsafe",
      overrideTaming: "severe",
    });
  }

  static createNewSandbox(miniapp_id: string, js: string) {
    const id = crypto.randomUUID();
    const sandbox = new Sandbox({
      id,
      globals: {},
      window: window,
    });
    setSandboxes([...sandboxes(), sandbox]);

    return id;
  }
}
