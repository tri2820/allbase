// TODO: revokable, expandos
export type Distortion = {
  // Before an object passes through the membrane
  get: (obj: any) => any
  // Before a function is called
  apply: (
    obj: any,
    func: any,
    args: any
  ) => undefined | {
    value: any
  }
}

export default class Membrane<T extends object> {
  private proxyMap = new WeakMap<T, T>();
  public distortion?: Distortion;

  static shouldWrap(target: any) {
    // return Object.isExtensible(target)
    // To work on prototype also
    return (
      target && (typeof target === "function" || typeof target === "object")
    );
  }

  static isATypedArray(x: any) {
    return (
      x instanceof Float32Array ||
      x instanceof Float64Array ||
      x instanceof Int8Array ||
      x instanceof Int16Array ||
      x instanceof Int32Array ||
      x instanceof Uint8Array ||
      x instanceof Uint8ClampedArray ||
      x instanceof Uint16Array ||
      x instanceof Uint32Array ||
      x instanceof BigInt64Array ||
      x instanceof BigUint64Array
    );
  }

  static isAnArray(x: any) {
    return (
      Array.isArray(x) ||
      x instanceof Float32Array ||
      x instanceof Float64Array ||
      x instanceof Int8Array ||
      x instanceof Int16Array ||
      x instanceof Int32Array ||
      x instanceof Uint8Array ||
      x instanceof Uint8ClampedArray ||
      x instanceof Uint16Array ||
      x instanceof Uint32Array ||
      x instanceof BigInt64Array ||
      x instanceof BigUint64Array
    );
  }

  static placeholder(value: any) {
    if (value === null) return null;
    if (value === undefined) return undefined;

    // satisfy Array.isArray (more strict than instaceof Array)
    if (Array.isArray(value)) return [];

    if (value instanceof Float32Array) {
      return new Float32Array(0);
    }

    if (value instanceof Float64Array) {
      return new Float64Array(0);
    }

    if (value instanceof Int8Array) {
      return new Int8Array(0);
    }

    if (value instanceof Int16Array) {
      return new Int16Array(0);
    }

    if (value instanceof Int32Array) {
      return new Int32Array(0);
    }

    if (value instanceof Uint8Array) {
      return new Uint8Array(0);
    }

    if (value instanceof Uint8ClampedArray) {
      return new Uint8ClampedArray(0);
    }

    if (value instanceof Uint16Array) {
      return new Uint16Array(0);
    }

    if (value instanceof Uint32Array) {
      return new Uint32Array(0);
    }

    if (value instanceof BigInt64Array) {
      return new BigInt64Array(0);
    }

    if (value instanceof BigUint64Array) {
      return new BigUint64Array(0);
    }

    if (typeof value === "number") {
      return 1;
    }

    // Satisfy instanceof C
    return Object.create(Object.getPrototypeOf(value));
  }

  wrap<K extends T>(target: K): K {
    this.distortion?.get(target)

    if (!Membrane.shouldWrap(target)) return target;

    if (Membrane.isATypedArray(target)) {
      Object.seal(target);
      return target;
    }

    // Preserve identity as well as double negation
    if (this.proxyMap.has(target)) {
      const value = this.proxyMap.get(target);
      if (value) return value as K;
    }

    // console.log("wrap", target);
    // To bypass invariants on [[Get]] for Proxy objects
    // Allow returning Proxy< O > instead of O when the property is read-only and non-configurable

    const _this_membrane = this;

    let shadowTarget;
    if (typeof target === "function") {
      shadowTarget = function () { } as K;
    } else {
      shadowTarget = Membrane.placeholder(target);
    }

    const handler: ProxyHandler<K> = {
      construct(shadowTarget, argArray, newTarget) {
        const wrappedArgs = argArray.map((arg) => _this_membrane.wrap(arg));
        const dangerousValue = Reflect.construct(
          target as any,
          wrappedArgs,
          // calling the original constructor
          newTarget
        );
        return _this_membrane.wrap(dangerousValue);
      },
      defineProperty(shadowTarget, property, attributes) {
        const ok = Reflect.defineProperty(target, property, attributes);
        return ok && Reflect.defineProperty(shadowTarget, property, attributes);
      },
      deleteProperty(shadowTarget, p) {
        const ok = Reflect.deleteProperty(target, p);
        return ok && Reflect.deleteProperty(shadowTarget, p);
      },
      isExtensible(shadowTarget) {
        const ok = Reflect.isExtensible(target);
        return ok && Reflect.isExtensible(shadowTarget);
      },
      preventExtensions(shadowTarget) {
        const ok = Reflect.preventExtensions(target);
        return ok && Reflect.preventExtensions(shadowTarget);
      },
      setPrototypeOf(shadowTarget, v) {
        const p = _this_membrane.wrap(v as any);
        Reflect.setPrototypeOf(target, p);
        return Reflect.setPrototypeOf(shadowTarget, p);
      },
      getPrototypeOf: (shadowTarget) => {
        const prototype = Reflect.getPrototypeOf(target);

        const result = _this_membrane.wrap(prototype as any);

        return result;
      },
      has(shadowTarget, p) {
        return Reflect.has(target, p);
      },
      ownKeys: (shadowTarget) => {
        return Reflect.ownKeys(target);
      },
      getOwnPropertyDescriptor: (shadowTarget, prop) => {
        const descriptor = Reflect.getOwnPropertyDescriptor(target, prop);
        if (descriptor == undefined) return descriptor;

        const d =
          "value" in descriptor
            ? {
              configurable: descriptor.configurable,
              enumerable: descriptor.enumerable,
              writable: true,
              value: this.wrap(descriptor.value as any),
            }
            : {
              configurable: descriptor.configurable,
              enumerable: descriptor.enumerable,
              get: _this_membrane.wrap(descriptor.get as any),
              set: _this_membrane.wrap(descriptor.set as any),
            };

        // const d_ = Reflect.getOwnPropertyDescriptor(shadowTarget, prop);
        // console.log("getOwnPropertyDescriptor", {
        //   prop,
        //   return: d,
        //   spec: d_,
        // });
        return d;
      },

      apply: function (shadowFunctionTarget, _this, args) {

        // Wrap `this` before calling foreign function
        // To think about it, `this` is also just an argument to the foreign function
        // After wrapped, the values should be on the same side as the function
        const wrappedThis = _this_membrane.wrap(_this);
        const wrappedArgs = args.map((arg) => _this_membrane.wrap(arg));

        const result = _this_membrane.distortion?.apply(wrappedThis, target, wrappedArgs)
        if (result) return _this_membrane.wrap(result.value);

        const dangerousValue = Reflect.apply(
          target as Function,
          wrappedThis,
          wrappedArgs
        );

        // Put the result value on the other side
        const p = _this_membrane.wrap(dangerousValue);
        return p;
      },

      set: (shadowTarget, prop, value) => {
        const p = this.wrap(value);
        Reflect.set(target, prop, p);
        return true;
      },

      get: (shadowTarget, prop, receiver) => {
        // If a getter is encountered, the getter would be executed in the other world
        // Since receiver is of this world, we need to refer to the counterpart of receiver in the other world
        // and pass it properly to the getter
        const wrappedReceiver = this.wrap(receiver);

        const value = Reflect.get(target, prop, wrappedReceiver) as K[keyof K];
        const p = this.wrap(value as any);
        // console.log("get", prop, receiver, target, value, p);

        return p;
      },
    };

    const arrHandler = {
      get: handler.get,
      set: handler.set,
      has: handler.has,
      ownKeys: handler.ownKeys,
      getOwnPropertyDescriptor: handler.getOwnPropertyDescriptor,
      defineProperty: handler.defineProperty,
      deleteProperty: handler.deleteProperty,
      construct: handler.construct,
      isExtensible: handler.isExtensible,
      preventExtensions: handler.preventExtensions,
      setPrototypeOf: handler.setPrototypeOf,
      // getPrototypeOf: handler.getPrototypeOf,
      apply: handler.apply,
    };
    const proxy = new Proxy<K>(
      shadowTarget,
      Membrane.isAnArray(target) ? arrHandler : handler
    );

    this.proxyMap.set(target, proxy);
    this.proxyMap.set(proxy, target);

    const descriptors = Object.getOwnPropertyDescriptors(target);

    // // Avoid copy all keys
    if (Array.isArray(target)) {
      //   // Object.defineProperty(shadowTarget, "length", {
      //   //   get: function () {
      //   //     return this.byteLength;
      //   //   },
      //   //   enumerable: true,
      //   //   configurable: false,
      //   // });
      // } else if (Array.isArray(target)) {
    } else {
      for (const key of Object.keys(descriptors)) {
        const shadowDescriptor = Object.create(null);
        const descriptor = descriptors[key];
        shadowDescriptor.enumerable = descriptor.enumerable;
        shadowDescriptor.configurable = descriptor.configurable;

        if ("value" in descriptor) {
          // TODO: use actual writable and wrap actual value?
          shadowDescriptor.writable = true;
          shadowDescriptor.value = Membrane.placeholder(descriptor.value);

          // shadowDescriptor.value = this.wrap(descriptor.value as any);
        } else {
          shadowDescriptor.get = this.wrap(descriptor.get as any);
          shadowDescriptor.set = this.wrap(descriptor.set as any);
        }

        Object.defineProperty(shadowTarget, key, shadowDescriptor);
      }
    }

    return proxy;
  }
}
