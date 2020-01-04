const { Command } = require('klasa');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            aliases: ['sk', 'seeksong'],
            description: language => language.get('COMMAND_SEEK_DESCRIPTION'),
            usage: '[amount:str]'
        });
    }

    async run(message, [amount]) {
        if (!message.guild['player'].connected) return await message.sendLocale('MUSIC_PLAYER_NOT-CONNECTED');
        if (message.member.voice && message.member.voice.channelID !== message.guild['player'].voice.id) return await message.sendLocale('MUSIC_PLAYER_USER-NOT-CONNECTED');
        if (!message.guild['player'].playing) return await message.sendLocale('MUSIC_PLAYER_NOT-PLAYING');
        if (message.guild['trivia'].players.size > 0) return await message.sendLocale('MUSIC_PLAYER_TRIVIA-PLAYING');

        if (!amount) amount = '1';

        const max = message.guild['player'].queue.length - (message.guild['player'].current + 1);

        amount = Math.max(Math.min((Number(amount) || 0), max), 0);

        message.guild['player'].queue.splice(message.guild['player'].current + 1, amount);

        return await message.sendLocale('COMMAND_SEEK', [amount]);
    }

};