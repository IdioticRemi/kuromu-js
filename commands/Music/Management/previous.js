const { Command } = require('klasa');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            aliases: ['prev'],
            description: language => language.get('COMMAND_PREVIOUS_DESCRIPTION')
        });
    }

    async run(message) {
        if (!message.guild['player'].connected) return await message.sendLocale('MUSIC_PLAYER_NOT-CONNECTED');
        if (message.member.voice && message.member.voice.channelID !== message.guild['player'].voice.id) return await message.sendLocale('MUSIC_PLAYER_USER-NOT-CONNECTED');
        if (!message.guild['player'].playing) return await message.sendLocale('MUSIC_PLAYER_NOT-PLAYING');
        if (message.guild['trivia'].players.size > 0) return await message.sendLocale('MUSIC_PLAYER_TRIVIA-PLAYING');

        try {
            await message.guild['player'].resume();
        } catch (e) {
            e = null;
        }
        message.guild['player'].paused = false;

        await message.guild['player'].prev().playNext();

        return await message.sendLocale('COMMAND_PREVIOUS');
    }

};