const { Command } = require('klasa');
const { Player } = require('../../../libs/music');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            aliases: ['repeatmode'],
            description: language => language.get('COMMAND_REPEAT_DESCRIPTION'),
            usage: '<set|reset|show> [mode:str]',
            subcommands: true,
            usageDelim: ' '
        });
    }

    async set(message, [mode]) {
        if (!message.guild['player'].connected) return await message.sendLocale('MUSIC_PLAYER_NOT-CONNECTED');
        if (message.member.voice && message.member.voice.channelID !== message.guild['player'].voice.id) return await message.sendLocale('MUSIC_PLAYER_USER-NOT-CONNECTED');
        if (message.guild['trivia'].players.size > 0) return await message.sendLocale('MUSIC_PLAYER_TRIVIA-PLAYING');
        if (isNaN(mode)) return await message.sendLocale('COMMAND_REPEAT-SET_NO-MODE');

        message.guild['player'].setRepeat(parseInt(mode));

        return await message.sendLocale('COMMAND_REPEAT-SET', [message.guild['player'].repeat]);
    }

    async show(message) {
        if (!message.guild['player'].connected) return await message.sendLocale('MUSIC_PLAYER_NOT-CONNECTED');
        if (message.guild['trivia'].players.size > 0) return await message.sendLocale('MUSIC_PLAYER_TRIVIA-PLAYING');

        return await message.sendLocale('COMMAND_REPEAT-SHOW', [message.guild['player'].repeat]);
    }

    async reset(message) {
        if (!message.guild['player'].connected) return await message.sendLocale('MUSIC_PLAYER_NOT-CONNECTED');
        if (message.member.voice && message.member.voice.channelID !== message.guild['player'].voice.id) return await message.sendLocale('MUSIC_PLAYER_USER-NOT-CONNECTED');
        if (message.guild['trivia'].players.size > 0) return await message.sendLocale('MUSIC_PLAYER_TRIVIA-PLAYING');

        await message.guild['player'].setRepeat(new Player().repeat);

        return await message.sendLocale('COMMAND_REPEAT-RESET', [message.guild['player'].repeat]);
    }

};