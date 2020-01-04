const { Command, RichDisplay, util: { isFunction } } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['commands'],
			guarded: true,
			description: language => language.get('COMMAND_HELP_DESCRIPTION'),
			usage: '(Command:command)'
		});

		this.createCustomResolver('command', (arg, possible, message) => {
			if (!arg || arg === '') return undefined;
			return this.client.arguments.get('command').run(arg, possible, message);
		});
	}

	async run(message, [command]) {
		if (command) {
			let cmd = new MessageEmbed()
				.setAuthor(`${message.language.get("COMMAND_HELP_CMD", command.name)}`, message.author.avatarURL())
				.setColor(this.client.accent)
				//.setThumbnail(this.client.user.avatarURL())
				.setDescription(isFunction(command.description) ? command.description(message.language) : command.description)
				.addField(message.language.get("COMMAND_HELP_USAGE"), `\`\`\`${command.usage.fullUsage(message)}\`\`\``)
				.addField(message.language.get("COMMAND_HELP_EXTENDED"), (isFunction(command.extendedHelp) ? command.extendedHelp(message.language) : command.extendedHelp).toString().substring(0, 1023))
				.setFooter(message.language.get("COMMAND_HELP_REQUESTED", message.author.tag))
				.setTimestamp();

			return message.sendMessage(cmd);
		}
		const template = new MessageEmbed()
			.setColor(this.client.accent)
			//.setThumbnail(this.client.user.avatarURL())
			.setFooter(message.language.get("COMMAND_HELP_REQUESTED", message.author.tag))
			.setTitle(message.language.get("COMMAND_HELP_INFO"))
			.setTimestamp();

		const display = new RichDisplay(template)
			.setFooterPrefix(`${message.language.get("COMMAND_HELP_REQUESTED", message.author.tag)} (`)
			.setFooterSuffix(")");

		const help = await this.buildHelp(message);
		const categories = Object.keys(help);

		categories.forEach(cat => {
			const subCategories = Object.keys(help[cat]);

			display.addPage(template => {
				template.setTitle(message.language.get("COMMAND_HELP_CATEGORY", cat));

				let text = '';
				subCategories.forEach(subCat => {
					text += `\n[››](http://a.a/) ${subCat}\n\n${help[cat][subCat].join(" | ")}\n`;
				});

				template.setDescription(text);
				return template;
			});
		});

		display.setInfoPage(template.setDescription(message.language.get("COMMAND_HELP_INFOS", display)));
		display.infoPage.setFooter(`${message.language.get("COMMAND_HELP_REQUESTED", message.author.tag)} (Page ℹ)`);

		return await display.run(message, { filter: (reaction, user) => user.id === message.author.id });
	}

	async buildHelp(message) {
		const help = {};

		await Promise.all(this.client.commands.map((command) =>
			this.client.inhibitors.run(message, command, true)
				.then(() => {
					if (!help.hasOwnProperty(command.category)) help[command.category] = {};
					if (!help[command.category].hasOwnProperty(command.subCategory)) help[command.category][command.subCategory] = [];

					help[command.category][command.subCategory].push(`\`${command.name}\``);
				})
				.catch(() => {
					// oof
				})
		));

		return help;
	}

};
