type EventTypes = {
	[key: string]: any[];
};

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
	 Emit an event to all listeners. Listeners will be called in the order of registration. All listeners run at once.abs
	* @returns The promise will be resolved once all listener functions have returned a resolved promise.
	 * @param event The event name
	 * @param args Arguments that will be passed to the listener functions.
	 */
	protected async emit<EventName extends keyof Events>(
		event: EventName,
		...args: Events[EventName]
	): Promise<void> {
		const promises = [...this.getListeners(event)].map(async (listener) =>
			Promise.resolve(listener(...args))
		);
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
			await Promise.resolve(listener(...args));
		}
	}

	private getListeners<EventName extends keyof Events>(
		event: EventName
	): EventStore<Events>[EventName] {
		if (!this.events[event]) this.events[event] = new Set();

		return this.events[event];
	}
}
