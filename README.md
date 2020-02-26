# Houk

[![Build Status](https://img.shields.io/gitlab/pipeline/krmax44/houk)](https://gitlab.com/krmax44/houk/pipelines)
[![Coverage](https://gitlab.com/krmax44/houk/badges/master/coverage.svg?style=flat)](https://gitlab.com/krmax44/houk/pipelines)
[![bundle size](https://img.shields.io/bundlephobia/minzip/houk)](https://bundlephobia.com/result?p=houk)
[![npm version](https://img.shields.io/npm/v/houk)](https://www.npmjs.com/package/houk)

A safely typed, super simple, universal event bus built for hook chains.

## Installation

```bash
yarn add houk
# or using npm
npm i houk
```

## Example

```ts
import Houk from 'houk';

type Events = {
	greeting: (name: string, text: string) => string;
};

class MyClass extends Houk<Events> {
	async sayHello() {
		const text = 'Hello $name!';
		const name = 'Max';

		const greeting = await this.emit('greeting', name, text);

		console.log('All hooks ran, the hook chain returned:', greeting);
	}
}

const myInstance = new MyClass();
myInstance.on('greeting', (name, text) => {
	return text.replace('$name', name);
});

myInstance.sayHello();

// --> All hooks ran, the hook chain returned: Hello Max!
```

If you just want an open, untyped hook bus, you can use `HoukBus`, where all methods are public. Perfect for use with plain JavaScript.

```js
import { HoukBus } from 'houk';

const bus = new HoukBus();

bus.on('newUser', user => console.log(`Hello ${user}!`));

bus.emit('newUser', 'Max');

// --> Hello Max!
```

## API

The same API applies to `HoukBus` as well, with the difference being that it's not an abstract class, all methods are public and there's no type safety.

### `Houk.on`

Listen to a particular event. Takes the event name, a listener function and whether the listener should only be called once (false by default).

```ts
on(eventName, listener, once?): void
```

### `Houk.off`

Unregister an event listener. Returns true on success and false when the event listener didn't exist before.

```ts
off(eventName, listener): boolean
```

### `Houk.emit`

Only available to deriving classes. Trigger all listeners of a particular event. `...args` will be passed along to the listener. Returns a promise containing the listener return value.

```ts
emit(eventName, ...args): Promise
```

### `Houk.getListeners`

Only available to deriving classes, returns a set of listener functions.
