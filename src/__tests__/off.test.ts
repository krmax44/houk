import randomString from './utils/randomString';
import Houk from '..';

const random = randomString();

function reverse(input: string): string {
	return input
		.split('')
		.reverse()
		.join('');
}

type Events = {
	test: (a: string) => any;
};

class TestClass extends Houk<Events> {
	public value = '';

	public async fire(): Promise<any> {
		this.value = await this.emit('test', random);
	}
}

describe('remove listener', () => {
	it('should remove the listener', async () => {
		const test = new TestClass();
		let arg = '';

		function listener(input: string): string {
			arg = input;

			return input + input;
		}

		test.on('test', listener);

		test.on('test', async function(string: string) {
			await new Promise(resolve => setTimeout(resolve, 5));
			const successfullyRemoved = test.off('test', listener);

			return successfullyRemoved ? string.toUpperCase() : reverse(string);
		});

		await test.fire();
		await test.fire();

		const valueOutput = reverse(random);

		expect(arg).toEqual(random);
		expect(test.value).toEqual(valueOutput);
	});
});
