import randomString from './utils/randomString';
import Houk from '..';

const random = randomString();

type Events = {
	test: (a: string) => string | Promise<string> | undefined;
};

class TestClass extends Houk<Events> {
	public value = '';

	public async fire(): Promise<void> {
		this.value = (await this.emit('test', random)) as string;
	}
}

describe('basic hookchain', () => {
	it('should run in order', async () => {
		const test = new TestClass();
		let arg;

		test.on('test', string => {
			arg = string;

			return string + string;
		});

		test.on('test', () => undefined); // Just a hook that returns nothing

		test.on('test', async function(string: string) {
			await new Promise(resolve => setTimeout(resolve, 5));
			return string.toUpperCase();
		});

		await test.fire();

		expect(arg).toEqual(random);
		expect(test.value).toEqual((random + random).toUpperCase());
	});
});
