import "ses";
import Membrane, { Distortion } from "./membrane";


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
  private shadowRootProxy: ShadowRoot | undefined;

  static lockdown() {
    if (window.sesLockedDown) return;
    window.sesLockedDown = true;
    lockdown({
      overrideTaming: "severe",
      errorTaming: 'unsafe-debug',
    });
  }

  constructor(public options: SandboxOptions) {

  }

  // lazily init when shadowRoot and stuffs have been all setup
  private init() {
    const fetchWithNamespace = harden((...args: any[]) => {
      const url = args[0];

      if (typeof url === 'string' && url.startsWith('https://')) {
        const namespace = this.options.id;
        console.log('Original URL:', url);
        const originalParam = encodeURIComponent(url)
        const modifiedUrl = new URL(`${window.location.protocol}//${window.location.host}/app/${namespace}`);
        modifiedUrl.searchParams.set('original', originalParam);

        console.log('Modified URL:', modifiedUrl);
        return fetch(modifiedUrl, ...args.slice(1));
      }

      console.log('URL did not match criteria for modification:', url);
      return fetch(url, ...args.slice(1));
    });


    const safeWindow = this.membrane.wrap(window);
    // TODO: make alert and stuffs appear on top level (call `alert` instead of `window.alert`)
    const globals: any = {
      ...safeWindow,
      window: safeWindow,
      console,
      Date,
      Math,
      shadowRoot: this.shadowRootProxy,
      fetch: fetchWithNamespace
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

  setDistortion(distortion: Distortion) {
    this.membrane.distortion = distortion;
  }

  setProxyOnShadowRoot(shadowRoot: ShadowRoot) {
    this.shadowRootProxy = this.membrane.wrap(shadowRoot)
  }

  getShadowRootProxy() {
    return this.shadowRootProxy
  }
}
