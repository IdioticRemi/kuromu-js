const { Command } = require('klasa');
const { Player } = require('../../../libs/music');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            aliases: ['vol'],
            description: language => language.get('COMMAND_VOLUME_DESCRIPTION'),
            usage: '<set|reset|show> [volume:int]',
            subcommands: true,
            usageDelim: ' '
        });
    }

    async set(message, [volume]) {
        if (!message.guild['player'].connected) return await message.sendLocale('MUSIC_PLAYER_NOT-CONNECTED');
        if (message.member.voice && message.member.voice.channelID !== message.guild['player'].voice.id) return await message.sendLocale('MUSIC_PLAYER_USER-NOT-CONNECTED');
        if (volume !== 0 && (!volume || isNaN(volume))) return await message.sendLocale('COMMAND_VOLUME-SET_NO-VOLUME');
        if (message.guild['trivia'].players.size > 0) return await message.sendLocale('MUSIC_PLAYER_TRIVIA-PLAYING');

        await message.guild.player.setVolume(volume, this.client.owners.has(message.author) && 'force' in message.flagArgs);

        return await message.sendLocale('COMMAND_VOLUME-SET', [message.guild.player.volume]);
    }

    async show(message) {
        if (!message.guild.player.connected) return await message.sendLocale('MUSIC_PLAYER_NOT-CONNECTED');
        if (message.guild['trivia'].players.size > 0) return await message.sendLocale('MUSIC_PLAYER_TRIVIA-PLAYING');

        return await message.sendLocale('COMMAND_VOLUME-SHOW', [message.guild.player.volume]);
    }

    async reset(message) {
        if (!message.guild['player'].connected) return await message.sendLocale('MUSIC_PLAYER_NOT-CONNECTED');
        if (message.member.voice && message.member.voice.channelID !== message.guild['player'].voice.id) return await message.sendLocale('MUSIC_PLAYER_USER-NOT-CONNECTED');
        if (message.guild['trivia'].players.size > 0) return await message.sendLocale('MUSIC_PLAYER_TRIVIA-PLAYING');

        await message.guild.player.setVolume(new Player().volume);

        return await message.sendLocale('COMMAND_VOLUME-RESET', [message.guild.player.volume]);
    }

};
