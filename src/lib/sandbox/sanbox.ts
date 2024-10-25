import "ses";
import Membrane from "./membrane";


declare global {
  interface Window {
    sesLockedDown: boolean;
  }
}

export type SandboxOptions = {
  id: string;
};

if (typeof window !== "undefined") {
  // @ts-ignore
  window.mem = new Membrane()
  // @ts-ignore
  console.log('window.mem', window.mem)
}

export class Sandbox {
  private membrane = new Membrane();
  private compartment: Compartment;

  static lockdown(){
    if (window.sesLockedDown) return;
    window.sesLockedDown = true;
    lockdown({
      overrideTaming: "severe",
    });
  }

  constructor(options: SandboxOptions) {
    const safeWindow = this.membrane.wrap(window);
    // TODO: make alert and stuffs appear on top level (call `alert` instead of `window.alert`)
    const globals : any = {
      ...safeWindow,
      window: safeWindow,
      console,
      Date,
      Math
    };

    this.compartment = new Compartment({
      id: options.id,
      globals,
      __options__: true,
    });
  }

  evaluate(code: string) {
    console.log('code', code)
    return this.compartment.evaluate(code, {
      __evadeHtmlCommentTest__: true,
    });
  }
}
