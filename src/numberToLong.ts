import {Ice} from "ice";

const MAX_INT = Math.pow(2, 53);

/**
 * Convert number to Ice.Long
 *
 * @param num JS number
 * @returns Ice.Long instance
 */
export default function numberToLong(num: number): Ice.Long {
  if (num > MAX_INT || num < -MAX_INT)
    throw new Error("Can't convert number to long: out of bounds");

  const low = num >>> 0;

  const high = ((num - low) / 0x100000000) >>> 0;

  return new Ice.Long(high, low);
}
