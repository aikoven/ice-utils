"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ice_1 = require("ice");
var iceErrorHandlers = [];
var iceWarn = ice_1.Ice.IncomingAsync.prototype.__warning;
ice_1.Ice.IncomingAsync.prototype.__warning = function (error) {
    if (!iceErrorHandlers)
        return iceWarn.call(this, error);
    var context = {};
    if (this._connection !== null) {
        try {
            var connInfo = this._connection.getInfo();
            if (connInfo instanceof ice_1.Ice.IPConnectionInfo) {
                context.remoteHost = connInfo.remoteAddressm;
                context.remotePort = connInfo.remotePort;
            }
        }
        catch (exc) {
            // Ignore.
        }
    }
    for (var _i = 0, iceErrorHandlers_1 = iceErrorHandlers; _i < iceErrorHandlers_1.length; _i++) {
        var handler = iceErrorHandlers_1[_i];
        handler(error, context, this._current);
    }
};
function default_1(handler) {
    iceErrorHandlers.push(handler);
    return function () {
        var index = iceErrorHandlers.indexOf(handler);
        iceErrorHandlers.splice(index, 1);
    };
}
exports.default = default_1;
