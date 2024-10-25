import "ses";
import Membrane from "./membrane";


declare global {
  interface Window {
    sesLockedDown: boolean;
  }
}

export type SandboxOptions = {
  id: string;
  globals: {};
  window: Window;
};

export class Sandbox {
  private membrane = new Membrane();
  private compartment: Compartment;

  

  constructor(options: SandboxOptions) {
    const safeWindow = this.membrane.wrap(options.window);

    // TODO: Implement distortion logic
    this.membrane

    this.compartment = new Compartment({
      id: options.id,
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
