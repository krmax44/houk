import randomString from './utils/randomString';
import Houk from '..';

const random = randomString();

type Events = {
	test: (a: string) => string;
};

class TestClass extends Houk<Events> {
	public value = '';

	public async fire(): Promise<void> {
		this.value = await this.emit('test', random);
	}
}

describe('basic hook', () => {
	it('should receive the event', async () => {
		const test = new TestClass();
		let arg;

		test.on('test', string => {
			arg = string;

			return string + string;
		});

		await test.fire();

		expect(arg).toEqual(random);
		expect(test.value).toEqual(random + random);
	});
});
