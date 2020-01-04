const { Command } = require('klasa');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            aliases: ['joinvoice', 'jv'],
            cooldown: 20,
            cooldownLevel: 'guild',
            description: language => language.get('COMMAND_JOIN_DESCRIPTION')
        });
    }

    async run(message) {
        if (!message.member.voice || !message.member.voice.channel) return message.sendLocale('MUSIC_PLAYER_NO-VOICE');
        if (!message.member.voice.channel.joinable) return message.sendLocale('COMMAND_JOIN_NOT-JOINABLE');
        if (message.guild['trivia'].players.size > 0) return await message.sendLocale('MUSIC_PLAYER_TRIVIA-PLAYING');

        const success = await message.guild['player']
            .setVoice(message.member.voice.channel)
            .setText(message.channel)
            .joinVoice();

        if (!success) return message.channel.sendLocale('COMMAND_JOIN_NO-SUCCESS');

        return message.sendLocale('COMMAND_JOIN', [message.member.voice.channel.name, (message.member.voice.channel.bitrate / 1000).toFixed(0)]);
    }

};
