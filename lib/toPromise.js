"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ice_1 = require("ice");
/**
 * Turn Ice promise to normal one.
 *
 * @param promise Ice promise.
 * @returns Native promise.
 */
function toPromise(promise) {
    return new Promise(function (resolve, reject) {
        promise.then(function (result) {
            if (result instanceof ice_1.Ice.Promise) {
                resolve();
            }
            else {
                resolve(result);
            }
        }, reject);
    });
}
exports.default = toPromise;
