import { ModuleSource } from "@endo/module-source";
import { VirtualEnvironment } from "@locker/near-membrane-base";
import "ses";
import { createSESVirtualEnvironment } from "../ses-membrane";
import VITE_CLIENT_MJS from "~/lib/dev-server/vite-client.mjs?raw";
import TEST_MJS from "~/lib/dev-server/test.mjs?raw";

import estraverse from "estraverse";
import escodegen from "escodegen";
import { parseModule } from "esprima-next";
import { getResolvePathFunction, installationOf, proxyFetch } from "~/components/apps";

declare global {
  interface Window {
    sesLockedDown: boolean;
  }
}

function findImportPatternMatches(src: string) {
  const importPattern = new RegExp(
    '(^|[^.]|\\.\\.\\.)\\bimport(\\s*(?:\\(|/[/*]))',
    'g'
  );
  
  const matches = [];
  for (const match of src.matchAll(importPattern)) {
    matches.push({
      match: match[0],
      position: match.index,
    });
  }
  
  return matches;
}


function replaceImportWithAllBaseImFromMatches(src: string, matches: ReturnType<typeof findImportPatternMatches>) {
  let updatedSrc = src;
  for (let i = matches.length - 1; i >= 0; i--) {
    const { position, match } = matches[i];
    const replacement = match.replace(/\bimport/, 'allbase_im');
    updatedSrc =
      updatedSrc.slice(0, position) +
      replacement +
      updatedSrc.slice(position + match.length);
  }
  return updatedSrc;
}


const transformReplaceImport = (code: string) => {
  const before = findImportPatternMatches(code);
  if (before.length === 0) {
    return code;
  }
  
  // Parse the code using Esprima to generate the AST (Program node)
  const ast = parseModule(code);

  // Use estraverse to replace dynamic import statements
  const result = estraverse.replace(ast as any, {
    enter: function (node) {
      if (node.type === "ImportExpression") {
        return {
          type: "CallExpression",
          callee: { type: "Identifier", name: "allbase_im" },
          arguments: [node.source], // Keep the original module source
          optional: false,
        };
      }
    },
  });

  // Generate the transformed code
  let transformedCode = escodegen.generate(result);

  const afterAST = findImportPatternMatches(transformedCode);
  if (afterAST.length > 0) {
    // maybe there's "import(" pattern in comment
    transformedCode = replaceImportWithAllBaseImFromMatches(transformedCode, afterAST);
    
    const afterFixComments = findImportPatternMatches(transformedCode);
    if (afterFixComments.length > 0) {
     console.error('Cannot fix import', transformedCode, afterFixComments)
      throw new Error('Cannot fix import');
    }
  }

  return transformedCode;
};



export type Distortion = Map<any, () => any>;
export class Sandbox {
  private shadowRoot: ShadowRoot | undefined;
  private env: VirtualEnvironment | undefined;
  private revoke: (() => void) | undefined;
  private distortion: Distortion | undefined;
  private compartment: Compartment | undefined;
  private resolvePath: ResolvePath | undefined;
  
  // private shadowRootProxy: ShadowRoot | undefined;
  private modules = new Map<string, {
    source: ModuleSource
  }>()


  static lockdown() {
    if (window.sesLockedDown) return;
    window.sesLockedDown = true;
    lockdown({
      overrideTaming: "severe",
      errorTaming: 'unsafe-debug',
    });
  }

  constructor(public id: string, public permissions: {
    allow_page_reload: boolean
  }) {
    Sandbox.lockdown();
  }

  async fetch(importSpecifier: string){
    if (!this.resolvePath) throw new Error('resolvePath not initialized')
    const path = this.resolvePath(importSpecifier)  
    return await proxyFetch(path);
  }

  getCachedModule(specifier: string) {
    const cached = this.modules.get(specifier);

    if (cached) {
      return {
        source: cached.source,
        specifier,
        compartment: this.compartment, // reflexive
      } 
    }
  }

  async fetchAndCache(specifier: string) {
    console.log('fetching...', specifier)
    const code = await this.fetch(specifier)
    console.log('fetched', specifier, code)
    const module = {
      source: new ModuleSource(transformReplaceImport(code)),
      specifier,
      compartment: this.compartment
    }
    
    console.log('cache', {specifier, module, code});
    this.modules.set(specifier, module)
    return module
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

    const source = new ModuleSource(transformReplaceImport(VITE_CLIENT_MJS))
    this.modules.set("/@vite/client", { source })
    this.modules.set("/src//@vite/client", { source })

    const ins = installationOf(this.id);
    if (!ins) throw new Error("No installation found for " + this.id);

    const { resolvePath, indexPath } = getResolvePathFunction(ins.meta.index);
    this.resolvePath = resolvePath;
    const this_sandbox = this;
    const compartment = new Compartment({
      __options__: true, 
      __evadeHtmlCommentTest__: true,
      id: this.id,
      globals: {
        allbase_im: async (dep: string) => {
          return compartment.import(dep);
        },
        Math,
      },
      // modules: {
      //   'submodule/dependency': new ModuleSource(`
      //     export default 42;
      //   `),
      // },
      // moduleMapHook(moduleSpecifier: string) {
      //     console.log('moduleMapHook >', 'moduleSpecifier', moduleSpecifier);
      //     return undefined
      // },
      importHook: async (importSpecifier: string, referrerSpecifier: string) => {
        const cached = this_sandbox.getCachedModule(importSpecifier)
        if (cached) return cached;
        const module = await this_sandbox.fetchAndCache(importSpecifier)          
        return module

      },
      importNowHook(importSpecifier: string, referrerSpecifier: string) {
        console.log('importNowHook >', 'please import', importSpecifier, 'from', referrerSpecifier, 'this.modules', this_sandbox.modules);
        const module = this_sandbox.getCachedModule(importSpecifier)
        return module
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
        const baseUrl = new URL(referrerSpecifier, 'http://example.com'); // Use a dummy base
        const resolvedUrl = new URL(importSpecifier, baseUrl);
        return resolvedUrl.pathname;
      },
      
      importMetaHook: (_moduleSpecifier: string, meta: any) => {
        console.log('importMetaHook >', 'moduleSpecifier', _moduleSpecifier, 'meta', meta);
        meta.url = 'http://localhost:5173/';
        
      },
    });

    this.compartment = compartment;

    const { env, revoke } = createSESVirtualEnvironment(window, compartment, {
      distortionCallback(v) {
        if (!this_sandbox.distortion) throw new Error('distortion not initialized');
        const distorted_v = this_sandbox.distortion.get(v as any);
        // console.log('distorted_v', distorted_v, 'for', v)
        return distorted_v ?? v;
      },
      globalObjectShape: window,
      endowments: Object.getOwnPropertyDescriptors({}),
    });

    this.env = env;
    this.revoke = revoke;
    
    return this.compartment;
  }

  evaluate(code: string) {
      const compartment = this.compartment ?? this.init();
      return compartment.evaluate(code, {
        __evadeHtmlCommentTest__: true,
        // __evadeImportExpressionTest__: true
      });
  }

  cacheModule(specifier: string, code: string) {
    this.modules.set(specifier, { source: new ModuleSource(transformReplaceImport(code)) })
  }

  importNow(specifier: string) {
    if (specifier == '/@vite/client' || specifier == '/src//@vite/client') {
      console.warn('Skipping import of vite client');
      return;
    }
    
    try {
      const compartment = this.compartment ?? this.init();
      const namespace = compartment.importNow(specifier);
      return namespace
    } catch (error) {
      console.error(error)
    }
    
  }

  import(specifier: string) {
    if (specifier == '/@vite/client' || specifier == '/src//@vite/client') {
      console.warn('Skipping import of vite client');
      return;
    }
    
    try {
      const compartment = this.compartment ?? this.init();
      const namespace = compartment.import(specifier);
      return namespace
    } catch (error) {
      console.error(error)
    }
    
  }

  setShadowRoot(shadowRoot: ShadowRoot){
    this.shadowRoot = shadowRoot;
    this.buildDistortion();
  }

  buildDistortion() {
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

    
    const { value: querySelector } = Object.getOwnPropertyDescriptor(
      Document.prototype,
      "querySelector"
    )!;

    const { value: reload } = Object.getOwnPropertyDescriptor(
      location,
      "reload"
    )!;

    const { get: head } = Object.getOwnPropertyDescriptor(
      Document.prototype,
      "head"
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
          if (!this.shadowRoot) throw new Error("shadowRoot not set");
          return this.shadowRoot.getElementById('body');
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
          if (!this.shadowRoot) throw new Error("shadowRoot not set");
          return this.shadowRoot.getElementById(
            // @ts-ignore
            ...args
          );
        },
      ],
      [
        querySelector,
        (...args: any[]) => {
          if (!this.shadowRoot) throw new Error("shadowRoot not set");
          return this.shadowRoot.querySelector(
            // @ts-ignore
            ...args
          );
        },
      ],
      [reload, this.permissions.allow_page_reload ? reload : 
        async () => {
            console.error('forbidden');
        }
      ],
      [head, () => {
        if (!this.shadowRoot) throw new Error("shadowRoot not set");
        return  this.shadowRoot.getElementById('head');
      }]
    ]);

  
    this.distortion = distortion;
  }

  destroy(){
    this.revoke?.();
    this.compartment = undefined;
    this.env = undefined;
    this.distortion = undefined;
    this.modules.clear();
    this.shadowRoot = undefined;
  }
}
