"use strict";
var test = require("tape");
var numberToLong_1 = require("./numberToLong");
test('numberToLong', function (assert) {
    for (var _i = 0, _a = [-1, -1480920190811, 0, 1, 1480920190811]; _i < _a.length; _i++) {
        var num = _a[_i];
        assert.equal(num, numberToLong_1.default(num).toNumber());
    }
    assert.end();
});
