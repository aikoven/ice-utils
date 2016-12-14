import * as test from "tape";
import numberToLong from "./numberToLong";


test('numberToLong', assert => {
  for (const num of [-1, -1480920190811, 0, 1, 1480920190811]) {
    assert.equal(num, numberToLong(num).toNumber());
  }

  assert.end();
});
