const { Command } = require('klasa');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            aliases: ['leavevoice', 'lv', 'stop'],
            description: language => language.get('COMMAND_LEAVE_DESCRIPTION')
        });
    }

    async run(message) {
        if (!message.guild['player'].voice || !message.guild['player'].connected) {
            await message.guild['player'].destroy();
            await message.guild['trivia'].reset();

            return await message.sendLocale('MUSIC_PLAYER_NOT-CONNECTED');
        }

        if (!message.member.voice || message.member.voice.channelID !== message.guild['player'].voice.id) return await message.sendLocale('MUSIC_PLAYER_USER-NOT-CONNECTED');

        await message.guild['player'].destroy();
        await message.guild['trivia'].reset();

        return await message.sendLocale('COMMAND_LEAVE', [message.member.voice.channel.name, (message.member.voice.channel.bitrate / 1000).toFixed(0)]);
    }

};