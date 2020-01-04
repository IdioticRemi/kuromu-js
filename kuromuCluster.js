const { BaseCluster } = require("kurasuta");
const { Colors } = require("klasa");

const { token } = require('./libs/config');

module.exports = class extends BaseCluster {
    async launch() {
        this.client.console.startup(`${new Colors({ text: 'black', background: 'cyan' }).format(`[CLUSTER:${this.id}]`)} Cluster ${this.id} loading.`);
        await this.client.login(token);
    }
};