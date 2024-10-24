import "ses";
import Membrane from "./membrane";


declare global {
  interface Window {
    sesLockedDown: boolean;
  }
}

export type SandboxOptions = {
  name: string;
  globals: {};
  window: Window;
};

export class Sandbox {
  private membrane = new Membrane();
  private compartment: Compartment;

  static lockdown() {
    if (window.sesLockedDown) return;
    window.sesLockedDown = true;
    lockdown({
      errorTaming: 'unsafe-debug', consoleTaming: 'unsafe', overrideTaming: 'severe',
    });
  }

  constructor(options: SandboxOptions) {
    const safeWindow = this.membrane.wrap(options.window);

    // TODO: Implement distortion logic
    this.membrane

    this.compartment = new Compartment({
      name: options.name,
      globals: {
        ...safeWindow,
        window: safeWindow,
        self: safeWindow,
        ...options.globals,
      },
      __options__: true,
    });
  }

  evaluate(code: string) {
    return this.compartment.evaluate(code, {
      __evadeHtmlCommentTest__: true,
    });
  }
}
