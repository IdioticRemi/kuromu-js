const { Command } = require('klasa');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            aliases: [],
            description: language => language.get('COMMAND_RESUME_DESCRIPTION')
        });
    }

    async run(message) {
        if (!message.guild['player'].connected) return await message.sendLocale('MUSIC_PLAYER_NOT-CONNECTED');
        if (message.member.voice && message.member.voice.channelID !== message.guild['player'].voice.id) return await message.sendLocale('MUSIC_PLAYER_USER-NOT-CONNECTED');
        if (!message.guild['player'].playing) return await message.sendLocale('MUSIC_PLAYER_NOT-PLAYING');
        if (message.guild['trivia'].players.size > 0) return await message.sendLocale('MUSIC_PLAYER_TRIVIA-PLAYING');

        if (!message.guild['player'].paused) return await message.sendLocale('COMMAND_RESUME_ALREADY-PLAYING');

        await message.guild['player'].resume();

        return await message.sendLocale('COMMAND_RESUME');
    }

};