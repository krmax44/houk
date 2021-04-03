import Houk from '..';

describe('readme example', () => {
	it("doesn't put me to shame", () => {
		expect.assertions(1);

		jest.spyOn(global.console, 'log');

		class CoffeeShop extends Houk<{
			order: [name: string, type: string];
		}> {
			makeMeACoffee() {
				const name = 'Max';
				const type = 'Cappuccino with oat milk';

				void this.emit('order', name, type);
			}
		}

		const barista = new CoffeeShop();
		barista.on('order', (name, type) => {
			console.log(`${name} would like a ${type}, please.`);
		});

		barista.makeMeACoffee();

		expect(console.log).toBeCalledWith(
			'Max would like a Cappuccino with oat milk, please.'
		);
	});
});
