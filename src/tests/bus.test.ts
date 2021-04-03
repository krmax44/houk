import { HoukBus } from '..';

describe('bus tests', () => {
	it('readme example works', () => {
		expect.assertions(1);

		jest.spyOn(global.console, 'log');

		const coffeeShop = new HoukBus<{
			order: [name: string, type: string];
		}>();

		coffeeShop.on('order', (name, type) => {
			console.log(`${name} would like a ${type}, please.`);
		});

		const name = 'Max';
		const type = 'Cappuccino with oat milk';
		void coffeeShop.emit('order', name, type);

		expect(console.log).toBeCalledWith(
			'Max would like a Cappuccino with oat milk, please.'
		);
	});
});
