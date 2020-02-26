import randomString from './utils/randomString';
import Houk from '..';

const random = randomString();

type Events = {
	test: (a: string, b?: string) => any;
};

class TestClass extends Houk<Events> {
	public value = '';

	public async fire(): Promise<any> {
		this.value = await this.emit('test', random);
	}
}

class TestClass2 extends Houk<Events> {
	public value = [''];

	public async fire(): Promise<any> {
		this.value = await this.emit('test', random, random + random);
	}
}

describe('no listeners', () => {
	it('should keep the original value', async () => {
		const test = new TestClass();
		const test2 = new TestClass2();
		await test.fire();
		await test2.fire();
		expect(test.value).toEqual(random);
		expect(test2.value).toEqual([random, random + random]);
	});
});
