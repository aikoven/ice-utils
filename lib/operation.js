"use strict";
/**
 * @private
 * Find operation table containing operation with given name.
 */
function getOpTable(servantType, opName) {
    while (servantType != null) {
        if (servantType.__ops && servantType.__ops.raw[opName] != null)
            return servantType.__ops;
        if (servantType.__implements) {
            var opTable = getOpTableFromInterfaces(servantType.__implements, opName);
            if (opTable)
                return opTable;
        }
        servantType = servantType.__parent;
    }
}
/**
 * @private
 */
function getOpTableFromInterfaces(interfaces, opName) {
    for (var _i = 0, interfaces_1 = interfaces; _i < interfaces_1.length; _i++) {
        var interface_ = interfaces_1[_i];
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
function operation(name) {
    return function (prototype, key, descriptor) {
        var opName = name || key;
        // get generated class prototype
        while (!prototype.hasOwnProperty('__dispatch')) {
            prototype = Object.getPrototypeOf(prototype);
            if (prototype == null)
                throw new Error("Can't add operation '" + opName + ". Not a servant class'");
        }
        // operation table containing defined operation
        var opTable = getOpTable(prototype.constructor, opName);
        if (opTable == null)
            throw new Error("No operation " + opName + " in type '" + prototype.ice_id() + "'");
        // copy operation config
        var opConfig = opTable.raw[opName].slice();
        // set "amd" metadata for operation
        opConfig[3] = 1;
        var OpTable = opTable.constructor;
        // top-level operation table, may be undefined
        var servantOpTable = prototype.constructor.__ops;
        // override operation table
        prototype.constructor.__ops = new OpTable(Object.assign({}, servantOpTable && servantOpTable.raw, (_a = {},
            _a[opName] = opConfig,
            _a)));
        // add AMD method
        Object.assign(prototype, (_b = {},
            _b[key + "_async"] = function (cb) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                Promise.resolve((_a = descriptor.value).call.apply(_a, [this].concat(args))).then(function (res) {
                    if (res === undefined) {
                        cb.ice_response();
                    }
                    else if (Array.isArray(res)) {
                        cb.ice_response.apply(cb, res);
                    }
                    else {
                        cb.ice_response(res);
                    }
                }, function (error) { return cb.ice_exception(error); });
                var _a;
            },
            _b));
        var _a, _b;
    };
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = operation;
