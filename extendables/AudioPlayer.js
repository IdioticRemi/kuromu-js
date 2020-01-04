const { Extendable, KlasaGuild } = require("klasa");
const { Player, TriviaGame } = require("../libs/music");

module.exports = class extends Extendable {
    constructor(...args) {
        super(...args, { appliesTo: [KlasaGuild] });
    }

    get player () {
        if (!this._player) {
            this._player = new Player(this.client, this.id);
        }

        return this._player;
    }

    get trivia () {
        if (!this._trivia) {
            this._trivia = new TriviaGame(this);
        }

        return this._trivia;
    }
};