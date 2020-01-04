const {Command} = require('klasa');
const {MessageAttachment} = require('discord.js');
const {createCanvas, loadImage} = require('canvas');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            cooldown: 15,
            aliases: [],
            description: language => language.get('COMMAND_QUEUE_DESCRIPTION')
        });
    }

    async run(message) {
        if (!message.guild['player'].connected) return await message.sendLocale('MUSIC_PLAYER_NOT-CONNECTED');
        if (!message.guild['player'].playing) return await message.sendLocale('MUSIC_PLAYER_NOT-PLAYING');
	    if (message.guild['player'].queue.length <= 0) return await message.sendLocale('COMMAND_QUEUE_EMPTY');
        if (message.guild['trivia'].players.size > 0) return await message.sendLocale('MUSIC_PLAYER_TRIVIA-PLAYING');

        const current = message.guild['player'].nowPlaying;
        const playtime = (message.guild['player'].connection.dispatcher.streamTime / 1000).toFixed(0);
        const duration = current.duration;
        const p_s = (playtime / duration).toFixed(3);
        const v_m = Math.max(Math.min((message.guild['player'].volume || 0), 150), 0) / 150;

        const canvas = createCanvas(1600, 800);
        const ctx = canvas.getContext('2d');
        const grd = ctx.createLinearGradient(70, 710, canvas.width - 70, 715);
        grd.addColorStop(0, '#FF033E');
        grd.addColorStop(0.5, '#FF4141');
        grd.addColorStop(1, 'orange');

        // Base layout
        ctx.fillStyle = '#2a2a2a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#313131';
        ctx.fillRect(0, 660, canvas.width, 140);

        /* Queue */
        for (let i = message.guild['player'].current + 1; i < message.guild['player'].current + 8; i++) {
            const ratio = 660 / 7;
            const height = ratio * (i - message.guild['player'].current - 1);

            ctx.fillStyle = '#454545';
            this.roundRect(ctx, 0, height - 1, canvas.width, 1, 1);

            if (!message.guild['player'].queue[i]) {
                ctx.fillStyle = '#313131';
                this.roundRect(ctx, 5, height + 2, 120, ratio - 4, 10);
            } else {
                const image = await loadImage(message.guild['player'].queue[i].info.thumbnails.default.url);

                ctx.save();
                this.roundRect(ctx, 5, height + 2, 120, ratio - 4, 5);
                ctx.clip();
                ctx.drawImage(image, -15, height - 18, 160, ratio + 36);
                ctx.restore();

                ctx.font = '26px Arial';
                ctx.textAlign = 'left';
                ctx.fillStyle = '#FFFFFF';
                ctx.fillText(message.guild['player'].queue[i].title, ratio + 50, height + ratio * 0.6, 990 - ratio);
                ctx.fillText(message.guild['player'].queue[i].author, 1060, height + ratio * 0.6, 430);
                ctx.fillText(message.guild['player'].queue[i].duration.toString().toHHMMSS(), 1510, height + ratio * 0.6, 80);
            }
        }

        /* Current song information */
        // Progress bar
        ctx.fillStyle = ctx.strokeStyle = '#3a3a3a';
        this.roundRect(ctx, 70, 675, canvas.width - 140, 5);
        ctx.fillStyle = ctx.strokeStyle = grd;
        this.roundRect(ctx, 70, 675, (canvas.width - 140) * p_s, 5);
        ctx.fillStyle = ctx.strokeStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(70 + (canvas.width - 140) * p_s, 677.5, 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        // Playtimes
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#bababa';
        ctx.fillText((playtime).toString().toHHMMSS(), 35, 685, 60);
        ctx.fillText((duration).toString().toHHMMSS(), canvas.width - 35, 685, 60);

        // Show song title
        ctx.textAlign = 'left';
        ctx.font = '32px Arial';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(current.title, 150, 730, canvas.width - 190);
        ctx.fillStyle = '#bababa';
        ctx.fillText(current.author, 150, 780, canvas.width - 390);

        // Show song image
        const image = await loadImage(current.info.thumbnails.default.url);
        ctx.save();
        this.roundRect(ctx, 10, 700, 120, 90, 10);
        ctx.clip();
        ctx.drawImage(image, -10, 680, 160, 130);
        ctx.restore();

        // Volume indicator
        ctx.fillStyle = ctx.strokeStyle = '#3a3a3a';
        this.roundRect(ctx, canvas.width - 380, 765, 260, 10);
        ctx.fillStyle = ctx.strokeStyle = '#FFFFFF';
        this.roundRect(ctx, canvas.width - 380, 765, 260 * v_m, 10);
        ctx.textAlign = 'right';
        ctx.fillText(`${message.guild['player'].volume} %`, canvas.width - 20, 780, 80);

        // Play state indicator
        ctx.fillStyle = '#FFFFFF';
        if (!message.guild['player'].paused) {
            ctx.fillRect(canvas.width - 440, 750, 10, 40);
            ctx.fillRect(canvas.width - 415, 750, 10, 40);
        } else {
            ctx.beginPath();
            ctx.moveTo(canvas.width - 440, 750);
            ctx.lineTo(canvas.width - 415, 770);
            ctx.lineTo(canvas.width - 440, 790);
            ctx.fill();
            ctx.closePath();
        }

        return await message.channel.send(new MessageAttachment(canvas.toBuffer(), 'server-queue.png'));
    }

    roundRect(ctx, x, y, width, height, radius) {
        if (typeof radius === 'undefined') {
            radius = 5;
        }
        if (typeof radius === 'number') {
            radius = {tl: radius, tr: radius, br: radius, bl: radius};
        } else {
            const defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
            for (const side in defaultRadius) {
                radius[side] = radius[side] || defaultRadius[side];
            }
        }
        ctx.beginPath();
        ctx.moveTo(x + radius.tl, y);
        ctx.lineTo(x + width - radius.tr, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
        ctx.lineTo(x + width, y + height - radius.br);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
        ctx.lineTo(x + radius.bl, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
        ctx.lineTo(x, y + radius.tl);
        ctx.quadraticCurveTo(x, y, x + radius.tl, y);
        ctx.closePath();
        ctx.fill();
    }

};
