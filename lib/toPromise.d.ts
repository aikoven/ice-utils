import { Ice } from "ice";
/**
 * Turn Ice promise to normal one.
 *
 * @param promise Ice promise.
 * @returns Native promise.
 */
export default function toPromise<T>(promise: Ice.Promise<T>): Promise<T>;
