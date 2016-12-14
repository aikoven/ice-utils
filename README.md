# Ice Utils [![npm version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]

A set of utilities that makes using ZeroC ICE with JS easier.

## API

### toPromise(icePromise: Ice.Promise): Promise

Turn Ice promise to normal one. Useful with `async`/`await` because `await`ing
Ice promises leads to infinite loops.

**Example**

```js
async function fn() {
  const icePromise = myPrx.someOperation();
  
  const result = await toPromise(icePromise);
  
  return result;
} 
```

### numberToLong(num: number): Ice.Long

Convert number to `Ice.Long`. Ice only provides method to convert `Ice.Long`
to number, but reverse conversion is necessary if you need to supply operation
parameter of type `long`, or implement a servant method that returns `long`.
 
See [JavaScript Mapping for Long Integers](https://doc.zeroc.com/display/Ice36/JavaScript+Mapping+for+Built-In+Types#JavaScriptMappingforBuilt-InTypes-JavaScriptMappingforLongIntegers).

### operation(name?: string): MethodDecorator

Decorator factory for convenient operation implementation on servants.

Automatically adds `["amd"]` metadata because sync operations make little sense 
in JS world.

**Parameters**

* **name**: Operation name. Defaults to decorated method name.

**Example**

```js
class MyServant extends MySlices.MyServant {
  @operation()
  myOperation() {
    return doSomeStuff()
     .then(doSomeOtherStuff);
  }
}
``` 
 
**Example**

```js
class MyServant extends MySlices.MyServant {
  @operation()
  async myOperation() {
    const result = await doSomeStuff();
    return result;
  }
}
```


[npm-image]: https://badge.fury.io/js/ice-utils.svg
[npm-url]: https://badge.fury.io/js/ice-utils
[travis-image]: https://travis-ci.org/aikoven/ice-utils.svg?branch=master
[travis-url]: https://travis-ci.org/aikoven/ice-utils
