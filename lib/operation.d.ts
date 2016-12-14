import { Ice } from "ice";
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
export default function operation(name?: string): (prototype: Ice.Object, key: string, descriptor: PropertyDescriptor) => void;
