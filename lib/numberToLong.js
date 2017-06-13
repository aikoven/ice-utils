"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ice_1 = require("ice");
var MAX_INT = Math.pow(2, 53);
/**
 * Convert number to Ice.Long
 *
 * @param num JS number
 * @returns Ice.Long instance
 */
function numberToLong(num) {
    if (num > MAX_INT || num < -MAX_INT)
        throw new Error("Can't convert number to long: out of bounds");
    var low = num >>> 0;
    var high = ((num - low) / 0x100000000) >>> 0;
    return new ice_1.Ice.Long(high, low);
}
exports.default = numberToLong;
