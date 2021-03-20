import Houk from '..';

describe('HoukClass', () => {
	it('emits to listeners', async () => {
		expect.assertions(2);

		class Test extends Houk<{
			event1: [something: number];
		}> {
			public fire(): void {
				void this.emit('event1', 4);
			}
		}

		let called = false;
		const t = new Test();

		const promise = t.awaitEvent('event1').then(() => {
			called = true;
		});
		expect(called).toBe(false);
		t.fire();

		await promise;
		expect(called).toBe(true);
	});
});
