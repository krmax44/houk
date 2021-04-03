/* eslint-disable @typescript-eslint/ban-types */

import Houk from '..';
import wait from 'waait';

describe('sync tests', () => {
	it('respects promises, if asked', async () => {
		expect.assertions(4);

		let a = false;
		let b = false;

		class Test extends Houk<{
			event1: [];
			event2: [];
		}> {
			public async fire(): Promise<void> {
				await this.emit('event1');
				expect(a).toBe(true);
			}

			public async fireSync(): Promise<void> {
				await this.emitSync('event2');
				expect(b).toBe(true);
			}
		}

		const t = new Test();

		const listener1 = jest.fn(async () => {
			await wait(1);
			expect(a).toBe(true);
		});
		const listener2 = jest.fn(() => {
			a = true;
		});

		const listener3 = jest.fn(async () => {
			await wait(1);
			expect(b).toBe(false);
		});
		const listener4 = jest.fn(() => {
			b = true;
		});

		t.on('event1', listener1);
		t.on('event1', listener2);
		t.on('event2', listener3);
		t.on('event2', listener4);

		await t.fire();
		await t.fireSync();
	});
});
