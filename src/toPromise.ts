import {Ice} from "ice";

/**
 * Turn Ice promise to normal one.
 *
 * @param promise Ice promise.
 * @returns Native promise.
 */
export default function toPromise<T>(promise: Ice.Promise<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    promise.then(result => {
      if (result instanceof Ice.Promise) {
        resolve();
      } else {
        resolve(result);
      }
    }, reject);
  });
}
