type EventTypes = Record<string, any[]>;

type EventStore<Types extends EventTypes> = {
	[key in keyof Types]: Set<(...q: Types[key]) => void>;
};

export default abstract class Houk<Events extends EventTypes> {
	// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
	readonly events = {} as EventStore<Events>;

	/**
	 * Add an event listener
	 * @param event The event to listen to
	 * @param fn The event handler
	 * @param once If true, the listener will be removed once invoked
	 */
	public on<EventName extends keyof Events>(
		event: EventName,
		fn: (...args: Events[EventName]) => void,
		once = false
	): void {
		this.getListeners(event).add(fn);

		if (once) {
			this.on(event, () => {
				this.off(event, fn);
			});
		}
	}

	/**
	 * Remove an event listener
	 * @param event The event name
	 * @param fn The event handler
	 */
	public off<EventName extends keyof Events>(
		event: EventName,
		fn: (...args: Events[EventName]) => void
	): boolean {
		return this.getListeners(event).delete(fn);
	}

	/**
	 * Returns a promise that will resolve once the given event has been triggered.
	 * @param event The event name
	 */
	public async awaitEvent<EventName extends keyof Events>(
		event: EventName
	): Promise<void> {
		return new Promise((resolve: () => void) => {
			this.on(event, resolve, true);
		});
	}

	/**
	 Emit an event to all listeners. Listeners will be called in the order of registration. All listeners run at once.abs
	* @returns The promise will be resolved once all listener functions have returned a resolved promise.
	 * @param event The event name
	 * @param args Arguments that will be passed to the listener functions.
	 */
	protected async emit<EventName extends keyof Events>(
		event: EventName,
		...args: Events[EventName]
	): Promise<void> {
		const promises = [];

		for (const listener of this.getListeners(event)) {
			const promise: any = listener(...args);
			if (promise instanceof Promise) promises.push(promise);
		}

		await Promise.all(promises);
	}

	/**
	 Emit an event to all listeners. Listeners will be called in the order of registration. One listener runs at a time.
	 * @returns The promise will be resolved once all listener functions have returned a resolved promise.
	 * @param event The event name
	 * @param args Arguments that will be passed to the listener functions.
	 */
	protected async emitSync<EventName extends keyof Events>(
		event: EventName,
		...args: Events[EventName]
	): Promise<void> {
		for (const listener of this.getListeners(event)) {
			const promise: any = listener(...args);
			if (promise instanceof Promise) await promise;
		}
	}

	protected getListeners<EventName extends keyof Events>(
		event: EventName
	): EventStore<Events>[EventName] {
		const listeners = this.events[event] || (this.events[event] = new Set());
		return listeners;
	}
}

export class HoukBus<Events extends EventTypes> extends Houk<Events> {
	public emit = super.emit;
	public emitSync = super.emitSync;
	public getListeners = super.getListeners;
}

if (typeof module !== 'undefined') {
	module.exports = Houk;
	module.exports.HoukBus = HoukBus;
}
