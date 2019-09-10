import { expect } from 'chai';
import * as random from './utils/random';
import Houk from '..';
import 'mocha';

const randomString = random.randomString();
const randomObject = random.randomObject();

function reverse(input: string): string {
	return input
		.split('')
		.reverse()
		.join('');
}

class TestClass extends Houk {
	public value: string = '';

	public async fire(): Promise<any> {
		this.value = await this.emit('test', randomObject, randomString);
	}
}

describe('remove listener', () => {
	it('should remove the listener', async () => {
		const test = new TestClass();
		let thisArg;
		let arg: string;

		function listener(input: string): string {
			thisArg = this;
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

		const valueOutput = reverse(randomString);

		expect(thisArg).to.eql(randomObject);
		expect(arg).to.equal(randomString);
		expect(test.value).to.equal(valueOutput);
	});
});
