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

export class Sandbox {
  private membrane = new Membrane();
  private compartment: Compartment | undefined;
  public shadowRoot: ShadowRoot | undefined;

  static lockdown(){
    if (window.sesLockedDown) return;
    window.sesLockedDown = true;
    lockdown({
      overrideTaming: "severe",
    });
  }

  constructor(public options: SandboxOptions) {
    
  }

  // lazily init when shadowRoot and stuffs have been all setup
  private init(){
    const safeWindow = this.membrane.wrap(window);
    // TODO: make alert and stuffs appear on top level (call `alert` instead of `window.alert`)
    const globals : any = {
      ...safeWindow,
      window: safeWindow,
      console,
      Date,
      Math,
      shadowRoot: this.shadowRoot ? this.membrane.wrap(this.shadowRoot) : undefined
    };

    this.compartment = new Compartment({
      id: this.options.id,
      globals,
      __options__: true,
    });

    return this.compartment
  }

  evaluate(code: string) {
    const compartment = this.compartment ?? this.init();
    return compartment.evaluate(code, {
      __evadeHtmlCommentTest__: true,
    });
  }
}
