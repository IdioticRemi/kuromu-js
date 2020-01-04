const { Command } = require('klasa');

const DIGITS_TO_UNITS = new Map([
	[9, 's'],
	[6, 'ms'],
	[3, 'μs']
]);

const rebootKeys = ['message', 'timestamp'].map(key => `restart.${key}`);

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			permissionLevel: 10,
			guarded: true,
			description: language => language.get('COMMAND_REBOOT_DESCRIPTION')
		});
	}

	async run(msg) {
		await Promise.all([
			...this.client.providers.map(provider => provider.shutdown()),
			await this.client.settings.update({
				restart: {
					message: await msg.sendLocale('COMMAND_REBOOT'),
					timestamp: process.hrtime.bigint()
				}
			})
		]);

		process.exit();
	}

	async init() {
		const [message, timestamp] = await Promise.all(rebootKeys.map(key => this._resolveSetting(key)));
		await this.client.settings.reset(rebootKeys);

		if (message) await message.sendLocale("COMMAND_REBOOT_DONE", [timestamp, this.constructor.getFriendlyDuration(timestamp)]);
		else this.client.emit('info', 'No restart channel');
	}

	_resolveSetting(path) {
		const { settings, languages: { default: language } } = this.client;

		const route = typeof path === 'string' ? path.split('.') : path;
		const piece = settings.gateway.schema.get(route.join('.'));

		if (!settings.get(route.join('.'))) return undefined;

		try {
			return piece.serializer.deserialize(settings.get(route.join('.')), piece, language);
		} catch (err) {
			return undefined;
		}
	}

	static bigAbs(bigint) {
		return bigint < 0 ? -bigint : bigint;
	}

	static getFriendlyDuration(from, to = process.hrtime.bigint()) {
		const time = this.bigAbs(to - from).toString();
		let shift, suffix;

		const digits = time.length;
		for (const [d, suf] of DIGITS_TO_UNITS) {
			if (digits > d) {
				shift = -d;
				suffix = suf;
				break;
			}
		}

		const whole = time.slice(0, shift);
		const fractional = `${time.slice(shift, shift + 1)}${this._roundDigit(time.slice(shift + 1, shift + 3))}`;
		return `${whole}.${fractional}${suffix}`;
	}

	static _roundDigit([digit, otherDigit]) {
		return Number(digit) + (otherDigit >= 5);
	}

};