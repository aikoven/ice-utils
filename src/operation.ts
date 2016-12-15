import {Ice} from "ice";

/**
 * @private
 * Find operation table containing operation with given name.
 */
function getOpTable(servantType: any, opName: string) {
  while (servantType != null) {
    if (servantType.__ops && servantType.__ops.raw[opName] != null)
      return servantType.__ops;

    if (servantType.__implements) {
      const opTable =
        getOpTableFromInterfaces(servantType.__implements, opName);

      if (opTable)
        return opTable;
    }

    servantType = servantType.__parent;
  }
}

/**
 * @private
 */
function getOpTableFromInterfaces(interfaces: any[], opName: string) {
  for (const interface_ of interfaces) {
    if (interface_.__ops && interface_.__ops.raw[opName] != null)
      return interface_.__ops;
  }
}

/**
 * Decorator factory for convenient operation implementation on servants.
 *
 * Automatically adds ["amd"] metadata because sync operations make little
 * sense in JS world.
 *
 * @example
 * <pre><code>
 * class MyServant extends MySlices.MyServant {
 *   @operation()
 *   myOperation() {
 *     return doSomeStuff()
 *       .then(doSomeOtherStuff);
 *   }
 * }
 * </code></pre>
 *
 * @example
 * <pre><code>
 * class MyServant extends MySlices.MyServant {
 *   @operation()
 *   async myOperation() {
 *     const result = await doSomeStuff();
 *     return result;
 *   }
 * }
 * </code></pre>
 *
 * @param name Operation name. Defaults to decorated method name.
 *
 * @returns method decorator
 */
export default function operation(name?: string) {
  return (prototype: Ice.Object, key: string,
          descriptor: PropertyDescriptor) => {
    const opName = name || key;

    // get generated class prototype
    while (!prototype.hasOwnProperty('__dispatch')) {
      prototype = Object.getPrototypeOf(prototype);

      if (prototype == null)
        throw new Error(`Can't add operation '${opName}. Not a servant class'`);
    }

    // operation table containing defined operation
    const opTable = getOpTable(prototype.constructor, opName);

    if (opTable == null)
      throw new Error(`No operation ${opName} in type '${prototype.ice_id()}'`);

    // copy operation config
    const opConfig = [...opTable.raw[opName]];
    // set "amd" metadata for operation
    opConfig[3] = 1;

    const OpTable = opTable.constructor;

    // top-level operation table, may be undefined
    const servantOpTable = (prototype.constructor as any).__ops;

    // override operation table
    const newOpTable = new OpTable(Object.assign(
      {}, servantOpTable && servantOpTable.raw, {
        [opName]: opConfig,
      })
    );
    (prototype.constructor as any).__ops = newOpTable;

    // add AMD method
    Object.assign(prototype, {
      [`${opName}_async`](cb: Ice.UpcallRest, ...args: any[]) {
        Promise.resolve(descriptor.value.call(this, ...args)).then(
          res => {
            if (res === undefined) {
              cb.ice_response();
            } else if (newOpTable.find(opName).outParams.length > 0) {
              cb.ice_response(...res);
            } else {
              cb.ice_response(res);
            }
          },
          error => cb.ice_exception(error),
        );
      },
    });
  };
}
