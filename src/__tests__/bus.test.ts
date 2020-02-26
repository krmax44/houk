import randomString from './utils/randomString';
import { HoukBus } from '..';

const random = randomString();

describe('basic hookchain with bus', () => {
	it('should run in order', async () => {
		const test = new HoukBus();
		let arg;

		test.on('test', (string: string) => {
			arg = string;

			return string + string;
		});

		test.on('test', async function(string: string) {
			await new Promise(resolve => setTimeout(resolve, 5));
			return string.toUpperCase();
		});

		const value = await test.emit('test', random);

		expect(arg).toEqual(random);
		expect(value).toEqual((random + random).toUpperCase());
	});
});
