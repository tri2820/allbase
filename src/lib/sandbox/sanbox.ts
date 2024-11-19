import { ModuleSource } from "@endo/module-source";
import { VirtualEnvironment } from "@locker/near-membrane-base";
import "ses";
import { reinstall } from "~/components/apps";
import { createSESVirtualEnvironment } from "../ses-membrane";


declare global {
  interface Window {
    sesLockedDown: boolean;
  }
}

export type SandboxOptions = {
  id: string;
};

export type Distortion = Map<any, () => any>;
export class Sandbox {
  private env: VirtualEnvironment | undefined;
  private distortion: Distortion | undefined;
  private compartment: Compartment | undefined;
  // private shadowRootProxy: ShadowRoot | undefined;
  private modules : {
    specifier: string;
    source: ModuleSource;
  }[] = []

  static lockdown() {
    if (window.sesLockedDown) return;
    window.sesLockedDown = true;
    lockdown({
      overrideTaming: "severe",
      errorTaming: 'unsafe-debug',
    });
  }

  constructor(public options: SandboxOptions) {
    Sandbox.lockdown();
  }

  // lazily init when shadowRoot and stuffs have been all setup
  private init() {
    // const fetchWithNamespace = harden((...args: any[]) => {
    //   const url = args[0];

    //   if (typeof url === 'string' && url.startsWith('https://')) {
    //     const namespace = this.options.id;
    //     console.log('Original URL:', url);
    //     const originalParam = encodeURIComponent(url)
    //     const modifiedUrl = new URL(`${window.location.protocol}//${window.location.host}/app/${namespace}`);
    //     modifiedUrl.searchParams.set('original', originalParam);

    //     console.log('Modified URL:', modifiedUrl);
    //     return fetch(modifiedUrl, ...args.slice(1));
    //   }

    //   console.log('URL did not match criteria for modification:', url);
    //   return fetch(url, ...args.slice(1));
    // });


    
    // // TODO: Remove fetch and stuffs
    // const safeWindow = this.membrane.wrap(window);
    // const globals: any = {
    //   // Why does this give illegal invocation?
    //   // Because some function would have globalThis as `this`, instead of `window`
    //   // Some even weirder and allow window or undefined as `this`, so 
    //   // setTimeout() -> doesn't work, this is set to globalThis
    //   // window.setTimeout() -> works, this is window
    //   // setTimeout.bind(window)() -> works, this is window
    //   // f = setTimeout; f() -> works, this is undefined
    //   // DO NOT UNCOMMENT
    //   // ...safeWindow,

    //   window: safeWindow,
    //   // Dangerous?: Currently make these appear on top level

    //   // There are some others not exposed by ...safeWindow, like console, Date, Math, alert, etc
    //   // TODO: make ALL of these appear on top level (call `alert` instead of `window.alert`)
    //   console,
    //   Date,
    //   Math,

    //   URL,
    //   WebSocket,
    //   // setTimeout: safeWindow.setTimeout,

    //   shadowRoot: this.shadowRootProxy,
    //   fetch: fetchWithNamespace,
    // };

    const globals = {};
    const this_sandbox = this;
    const compartment = new Compartment({
      __options__: true, 
      __evadeHtmlCommentTest__: true,
      id: this.options.id,
      globals,
      modules: {
        'submodule/dependency': new ModuleSource(`
          export default 42;
        `),
      },
      moduleMapHook(moduleSpecifier: string) {
          console.log('moduleMapHook >', 'moduleSpecifier', moduleSpecifier);
          return undefined
      },
      importHook(importSpecifier: string, referrerSpecifier: string) {
          console.log('importHook >', 'please import', importSpecifier, 'from', referrerSpecifier);
          return undefined
      },
      importNowHook(importSpecifier: string, referrerSpecifier: string) {
        console.log('importNowHook >', 'please import', importSpecifier, 'from', referrerSpecifier, 'this.modules', this_sandbox.modules);
        const hmrModule = this_sandbox.modules.find(m => m.specifier === importSpecifier)
        if (hmrModule) {
          return {
            source: hmrModule.source,
            specifier: importSpecifier,
            compartment, // reflexive
          }
        }
        // _sandbox.modules
        // if (importSpecifier === 'dependent') {
        //   return {
        //     source: new ModuleSource(`
        //       import meaning from 'dependency';
        //       export default meaning;
        //     `),
        //     specifier: 'submodule/dependent',
        //     compartment, // reflexive
        //   };
        // } else if (importSpecifier === 'hel'){
        //   return {
        //     source: new ModuleSource(`
        //       console.log('ok');
        //     `),
        //     specifier: 'submodule/hel',
        //     compartment, // reflexive
        //   }
        // }
      },
       /**
       * Resolve a module specifier relative to another module specifier.
       *
       * For example, if we're currently inside a module at `a/b/c.mjs` and we
       * want to import `./d.mjs`, we need to resolve the specifier `./d.mjs`
       * relative to the current module specifier `a/b/c.mjs`.
       *
       * The result of this resolution is `a/b/d.mjs`, which is the full module
       * specifier of the module that we want to import.
       *
       * This hook is used to implement the `import` statement in our sandboxed
       * environment.
       *
       * @param referrerSpecifier - The specifier of the module that we're
       * currently inside of.
       * @param importSpecifier - The specifier of the module that we want to
       * import.
       * @returns The fully resolved specifier of the module that we want to
       * import.
       */
      resolveHook(importSpecifier: string, referrerSpecifier: string) {
        console.log('resolveHook >', ' I want to import', importSpecifier, 'from', referrerSpecifier);
        const path = referrerSpecifier.split('/');
        path.pop();
        path.push(...importSpecifier.split('/'));
        const result = path.join('/')
        console.log('resolveHook >', 'result', result);
        return result;
      },
      importMetaHook: (_moduleSpecifier: string, meta: any) => {
        console.log('importMetaHook >', 'moduleSpecifier', _moduleSpecifier, 'meta', meta);
        meta.url = 'http://localhost:5173/';
        
      },
    });

    this.compartment = compartment;

    const env = createSESVirtualEnvironment(window, compartment, {
      distortionCallback(v) {
        return this_sandbox.distortion?.get(v as any) ?? v;
      },
      globalObjectShape: window,
      endowments: Object.getOwnPropertyDescriptors({}),
    });

    this.env = env;
    
    return this.compartment;
  }

  evaluate(code: string) {
    const compartment = this.compartment ?? this.init();
    return compartment.evaluate(code, {
      __evadeHtmlCommentTest__: true,
    });
  }

  async import(code: string) {
    const compartment = this.compartment ?? this.init();
    const namespace = await compartment.import(code);
    return namespace
  }

  importNow(specifier: string, code: string) {
    const module= {
      specifier,
      source: new ModuleSource(code),
      // importMeta: {
      //   meta: { url: 'https://example.com/index.js' },
      // }
    }
    this.modules.push(module);

    const compartment = this.compartment ?? this.init();
    const namespace = compartment.importNow(specifier);
    return namespace
  }

  buildDistortion(shadowRoot: ShadowRoot) {

    const { get: host } = Object.getOwnPropertyDescriptor(
      ShadowRoot.prototype,
      "host"
    )!;
  
    const { get: body } = Object.getOwnPropertyDescriptor(
      Document.prototype,
      "body"
    )!;
  
    const { value: getElementById } = Object.getOwnPropertyDescriptor(
      Document.prototype,
      "getElementById"
    )!;

    const { value: reload } = Object.getOwnPropertyDescriptor(
      location,
      "reload"
    )!;

  const distortion: Distortion = new Map([
    [
      alert,
      () => {
        console.error("forbidden");
      },
    ],
    [
      body,
      () => {
        console.error("body is not accessible");
      },
    ],
    [
      host,
      () => {
        console.error("host is not accessible");
      },
    ],
    [
      getElementById,
      (...args: any[]) => {
        return shadowRoot.getElementById(
          // @ts-ignore
          ...args
        );
      },
    ],
    [reload,
      async () => {
        reinstall(this.options.id)
      }
    ]
  ]);

  
    this.distortion = distortion;
  }

  // setProxyOnShadowRoot(shadowRoot: ShadowRoot) {
  //   // this.shadowRootProxy = 
  //   // this.membrane.wrap(shadowRoot)
  // }

  // getShadowRootProxy() {
  //   return this.shadowRootProxy
  // }


}
