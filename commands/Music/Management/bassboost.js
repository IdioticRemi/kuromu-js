const { Command } = require('klasa');
const { Player } = require('../../../libs/music');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            aliases: ['bass', 'bb'],
            description: language => language.get('COMMAND_BASSBOOST_DESCRIPTION'),
            usage: '<set|reset|show> [gain:int]',
            subcommands: true,
            usageDelim: ' '
        });
    }

    async set(message, [boost]) {
        if (!message.guild['player'].connected) return await message.sendLocale('MUSIC_PLAYER_NOT-CONNECTED');
        if (message.member.voice && message.member.voice.channelID !== message.guild['player'].voice.id) return await message.sendLocale('MUSIC_PLAYER_USER-NOT-CONNECTED');
        if (boost !== 0 && (!boost || isNaN(boost))) return await message.sendLocale('COMMAND_BASSBOOST-SET_NO-GAIN');
        if (message.guild['trivia'].players.size > 0) return await message.sendLocale('MUSIC_PLAYER_TRIVIA-PLAYING');

        message.guild.player.setBassBoost(boost, this.client.owners.has(message.author) && 'force' in message.flagArgs);

        return await message.sendLocale('COMMAND_BASSBOOST-SET', [message.guild.player.bassBoost]);
    }

    async show(message) {
        if (!message.guild.player.connected) return await message.sendLocale('MUSIC_PLAYER_NOT-CONNECTED');
        if (message.guild['trivia'].players.size > 0) return await message.sendLocale('MUSIC_PLAYER_TRIVIA-PLAYING');

        return await message.sendLocale('COMMAND_BASSBOOST-SHOW', [message.guild.player.bassBoost]);
    }

    async reset(message) {
        if (!message.guild['player'].connected) return await message.sendLocale('MUSIC_PLAYER_NOT-CONNECTED');
        if (message.member.voice && message.member.voice.channelID !== message.guild['player'].voice.id) return await message.sendLocale('MUSIC_PLAYER_USER-NOT-CONNECTED');
        if (message.guild['trivia'].players.size > 0) return await message.sendLocale('MUSIC_PLAYER_TRIVIA-PLAYING');

        await message.guild.player.setBassBoost(new Player().bassBoost);

        return await message.sendLocale('COMMAND_BASSBOOST-RESET', [message.guild.player.bassBoost]);
    }

};
