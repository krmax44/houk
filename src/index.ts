import alwaysArray from 'always-array';

type Fn = (...q: any) => void;
type ListenerSet = Set<{ fn: Fn; once: boolean }>;
type Listeners = Map<string, ListenerSet>;

interface Events {
	[key: string]: Fn;
}

export default abstract class Houk<E extends Events> {
	protected listeners: Listeners = new Map();

	/**
	 * Add an event listener
	 * @param event The event to listen to
	 * @param fn The event handler
	 * @param once If true, the listener will be removed once invoked
	 */
	public on<P extends keyof E>(
		event: P & string,
		fn: E[P],
		once = false
	): void {
		const listeners = this.getListeners(event);
		listeners.add({ fn, once });
		this.listeners.set(event, listeners);
	}

	/**
	 * Remove an event listener
	 * @param event The event name
	 * @param fn The event handler
	 */
	public off<P extends keyof E>(event: P & string, fn: E[P]): boolean {
		const listeners = this.getListeners(event);
		let found = false;

		for (const listener of listeners) {
			if (listener.fn === fn) {
				listeners.delete(listener);
				found = true;
			}
		}

		return found;
	}

	/**
	 Emit an event to all listeners.
	 * @param event The event name
	 * @param args Arguments that will be passed to the listener function.
	 */
	protected async emit<P extends keyof E>(
		event: P & string,
		...args: Parameters<E[P]>
	): Promise<Exclude<ReturnType<E[P]>, Promise<ReturnType<E[P]>>>> {
		const listeners = this.getListeners(event);

		if (listeners.size === 0) {
			return args.length === 1 ? args[0] : args;
		}

		let lastReturn: any = args;
		for (const listener of listeners.values()) {
			const params = alwaysArray(lastReturn);
			const returnValue = await Promise.resolve(listener.fn(...params));
			lastReturn = returnValue === undefined ? lastReturn : returnValue;
		}

		return lastReturn;
	}

	/**
	 * Get all listeners of a particular event
	 * @param event Event name
	 */
	protected getListeners(event: string): ListenerSet {
		return this.listeners.get(event) || new Set();
	}
}

/**
 * HoukBus allows you to use Houk without creating an extended class.
 * All methods are public.
 */
export class HoukBus extends Houk<Events> {
	public emit = super.emit;

	public getListeners = super.getListeners;
}

// istanbul ignore next
if (typeof module !== 'undefined') {
	module.exports = Houk;
	module.exports.default = Houk;
	module.exports.Houk = Houk;
	module.exports.HoukBus = HoukBus;
}
