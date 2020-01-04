const { Event } = require('klasa');

module.exports = class extends Event {

	constructor(...args) {
		super(...args);

		this.counter = 0;
	}

	run(data) {
		if (this.counter === 3) this.client.console.log(data);
		else this.counter++;
	}

};
