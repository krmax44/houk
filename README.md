# Houk

[![Build Status](https://travis-ci.com/krmax44/houk.svg?branch=master)](https://travis-ci.com/krmax44/houk)
[![install size](https://packagephobia.now.sh/badge?p=houk)](https://packagephobia.now.sh/result?p=houk)
[![bundle size](https://img.shields.io/bundlephobia/minzip/houk)](https://bundlephobia.com/result?p=houk)
[![npm version](https://img.shields.io/npm/v/houk)](https://www.npmjs.com/package/houk)

A super simple event bus built for hook chains.

## Installation

```bash
yarn add houk
# or using npm
npm i houk
```

## Example

```js
import Houk from 'houk';

class MyClass extends Houk {
	constructor() {
		super();
	}

	async fire() {
		const value = 'Hello $name!';

		const newValue = await this.emit(
			'myEvent', // event name
			{ user: 'Max' }, // will be available to the listener function as `this`
			value // will be passed as a parameter to the listener
		);

		console.log('All hooks ran, the new value is ', newValue);
	}
}

const myInstance = new MyClass();
myInstance.on('myEvent', function(value) {
	// Please note that `this` is not available in an arrow function!
	const { user } = this;
	return value.replace('$user', user);
});

myInstance.fire();
```

If you just want an open hook bus, you can use `HoukBus`, where all methods are public.

```js
import { HoukBus } from 'houk';

const bus = new HoukBus();

bus.on('newUser', user => console.log(`Hello ${user}!`));

bus.emit('newUser', undefined, 'Max');

// --> Hello Max!
```

## API

The same API applies to `HoukBus` as well, with the difference being that it's not an abstract class and all methods are public.

### `Houk.on`

Listen to a particular event.

```ts
on(event: string, fn: (...q: any) => any): void
```

### `Houk.off`

Unregister an event listener. Returns true on success and false when the event listener didn't exist before.

```ts
off(event: string, fn: (...q: any) => any): boolean
```

### `Houk.emit`

Only available to deriving classes. Trigger all listeners of a particular event. `thisArg` will be available as `this` to the listener function (as long as it is **not** an arrow function), `...args` will be passed along to the listener. Returns a promise containing the listener return value.

```ts
emit(
  event: string,
  thisArg?: any,
  ...args: any
): Promise<any>
```

### `Houk.getListeners`

Only available to deriving classes, returns a set of listener functions.
