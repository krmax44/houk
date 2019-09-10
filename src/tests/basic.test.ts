import { expect } from 'chai';
import * as random from './utils/random';
import Houk from '..';
import 'mocha';

const randomString = random.randomString();
const randomObject = random.randomObject();

class TestClass extends Houk {
	public value: string = '';

	public async fire(): Promise<any> {
		this.value = await this.emit('test', randomObject, randomString);
	}
}

describe('basic hook', () => {
	it('should receive the event', async () => {
		const test = new TestClass();
		let thisArg;
		let arg;

		test.on('test', function(string: string) {
			thisArg = this;
			arg = string;

			return string + string;
		});

		await test.fire();

		expect(thisArg).to.eql(randomObject);
		expect(arg).to.equal(randomString);
		expect(test.value).to.equal(randomString + randomString);
	});
});
