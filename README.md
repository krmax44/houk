# Houk

[![GitHub CI Status](https://img.shields.io/github/workflow/status/krmax44/houk/build/master)](https://github.com/krmax44/houk/actions?query=workflow%3Abuild)
[![Code Coverage](https://img.shields.io/codecov/c/github/krmax44/houk)](https://codecov.io/gh/krmax44/houk)
[![bundle size](https://img.shields.io/bundlephobia/minzip/houk)](https://bundlephobia.com/result?p=houk)
[![npm version](https://img.shields.io/npm/v/houk)](https://www.npmjs.com/package/houk)

A safely typed, super simple, universal event bus with awesome IDE auto completions. Requires TypeScript 4+.

## Installation

```bash
yarn add houk
# or using npm
npm i houk
```

## Example

```ts
import Houk from 'houk';

class CoffeeShop extends Houk<{
	order: [name: string, type: string];
}> {
	makeMeACoffee() {
		const name = 'Max';
		const type = 'Cappuccino with oat milk';

		this.emit('order', name, type);
	}
}

const barista = new CoffeeShop();
barista.on('order', (name, type) => {
	console.log(`${name} would like a ${type}, please.`);
});

barista.makeMeACoffee();

// --> Max would like a Cappuccino with oat milk, please.
```

## API

### Constructor

The Houk constructor requires one type argument:

```ts
class MyClass extends Houk<{
	eventName: [arg1: string, arg2: number];
}> {}
```

The object links the event names to the arguments the listener functions will receive. As labeled tuple types were introduced with TypeScript 4, make sure to be on the latest version.
In the example above, the listener function for the event `eventName` must be called with `arg1` of type `string` and `arg2` with type number. Rest parameters and optional types are possible.

### `Houk.on`

Listen to a particular event. Takes the event name, a listener function and whether the listener should only be called once (false by default).

```ts
on(eventName, listener, once?): void
```

### `Houk.off`

Unregister an event listener. Returns true on success and false when the event listener didn't exist before.

```ts
off(eventName, listener) => boolean
```

### `Houk.emit`

Only available to deriving classes. Trigger all listeners of a particular event. `...args` will be passed along to the listeners.

The listeners will all be called at once. It returns a Promise, which will resolve once all listeners have reached completion.

```ts
emit(eventName, ...args) => Promise
```

### `Houk.emitSync`

Only available to deriving classes. Trigger all listeners of a particular event. `...args` will be passed along to the listeners.

The listeners will be called once at a time, in order of registration. It returns a Promise, which will resolve once all listeners have reached completion.

```ts
emit(eventName, ...args) => Promise
```

### `Houk.getListeners`

Only available to deriving classes, returns a set of listener functions.

```ts
getListeners(eventName) => Set<() => {})>
```

## v3 Breaking Changes

Houk used to be both an event and hook chain bus. The concept of combining those two into one is neat, but definitely janky at times, which paired together with type safety doesn't feel right. Therefore, I decided to drop hook chains and make Houk a super-simple, type-safe event bus only.
