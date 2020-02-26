import Houk from '..';

type Events = {
	greeting: (name: string, text: string) => string;
};

class MyClass extends Houk<Events> {
	async sayHello(): Promise<void> {
		const text = 'Hello $name!';
		const name = 'Max';

		const greeting = await this.emit('greeting', name, text);

		console.log('All hooks ran, the hook chain returned:', greeting);
	}
}

describe('example', () => {
	test('example works', async () => {
		const consoleSpy = jest.spyOn(console, 'log');

		const myInstance = new MyClass();
		myInstance.on('greeting', (name, text) => {
			return text.replace('$name', name);
		});

		await myInstance.sayHello();

		expect(consoleSpy).toHaveBeenCalledWith(
			'All hooks ran, the hook chain returned:',
			'Hello Max!'
		);
	});
});
