const { Event, Colors } = require('klasa');
const fetch = require('node-fetch');
const DBL = require('dblapi.js');

const config = require('../libs/config');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			once: true
		});

		this.it = Math.randint(0, config.games.length - 1);
	}

	async run() {
		this.client.console.log(`${new Colors({text: 'black', background: 'cyan'}).format(`[CLUSTER:${this.client.shard.id}]`)} Logged in as ${this.client.user.tag}!`);

		await this.client.tasks.get('cleanup').run();

		await this.updateStats();
		await this.updatePresence();

		setInterval(async () => await this.updateStats(), 30000);
		setInterval(async () => await this.updatePresence(), 60000);

		/*
		if (this.client.shard) {
			if (this.client.shard.id === this.client.shard.count - 1) {
				await this.updateArcane();
				await this.updateTopGG();

				setInterval(async () => await this.updateArcane(), 900000);
				setInterval(async () => await this.updateTopGG(), 900000);
			}
		} else {
			await this.updateArcane();
			await this.updateTopGG();

			setInterval(async () => await this.updateArcane(), 900000);
			setInterval(async () => await this.updateTopGG(), 900000);
		}
		*/
	}

	init() {
		this.dbl = new DBL(config.top_gg, this.client);
	}

	async updateStats() {
		let [users, guilds, connections] = [0, 0, 0];

		if (this.client.shard) {
			const results = await this.client.shard.broadcastEval(`[this.users.size, this.guilds.size, this.voice.connections.size]`);
			for (const result of results) {
				users += result[0];
				guilds += result[1];
				connections += result[2];
			}
		}

		this.stats = {
			guilds: guilds || this.client.guilds.size,
			shards: this.client.shard ? this.client.shard.count : 1,
			users: users || this.client.users.size,
			connections: connections || this.client.voice.connections.size
		};
	}

	async updatePresence() {
		await this.client.user.setActivity({
			name: config.games[this.it][0](this.client, this.stats),
			type: config.games[this.it][1]
		});

		this.it === config.games.length - 1 ? this.it = 0 : this.it += 1;
	}

	async updateArcane() {
		try {
			await fetch('https://arcane-botcenter.xyz/api/584053340384657438/stats', {
				method: 'post',
				headers: {
					'Authorization': config.arcane,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					server_count: this.stats.guilds,
					shard_count: this.stats.shards,
					member_count: this.stats.users
				})
			});
		} catch (e) { }
	}

	async updateTopGG() {
		await this.dbl.postStats(this.stats.guilds, this.client.shard ? this.client.shard.ids[0] : 0, this.stats.shards);
	}
};