import Houk from '..';

describe('basic tests', () => {
	it('emits to listeners', () => {
		expect.assertions(13);

		class Test extends Houk<{
			event1: [something: number];
			event2: [example: string, life: number];
			event3: [obj: { foo: boolean }];
		}> {
			public fire(): void {
				void this.emit('event1', 4);
				void this.emit('event2', 'foo', 42);
			}

			public fireSync(): void {
				void this.emitSync('event3', { foo: true });
			}
		}

		const t = new Test();

		const listener1 = jest.fn((a) => {
			expect(a).toBe(4);
			t.off('event1', listener1);
		});

		const listener2 = jest.fn((a, b) => {
			expect(a).toBe('foo');
			expect(b).toBe(42);
		});

		const listener3 = jest.fn((a, b) => {
			expect(a).toBe('foo');
			expect(b).toBe(42);
		});

		const listener4 = jest.fn((a) => {
			expect(a.foo).toBe(true);
		});

		const listener5 = jest.fn((a) => {
			expect(a.foo).toBe(true);
		});

		t.on('event1', listener1);
		t.on('event2', listener2, true);
		t.on('event2', listener3);
		t.on('event3', listener4);
		t.on('event3', listener5);

		t.fire();
		t.fire();
		t.fireSync();

		expect(listener1).toHaveBeenCalledTimes(1);
		expect(listener2).toHaveBeenCalledTimes(1);
		expect(listener3).toHaveBeenCalledTimes(2);
		expect(listener4).toHaveBeenCalledBefore(listener5);
	});
});
