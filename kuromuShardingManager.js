const { ShardingManager } = require("kurasuta");
const { Colors, KlasaConsole } = require("klasa");
const { join } = require('path');

const { clientConfig, colorBase } = require("./libs/config");
const Kuromu = require("./kuromuClient");

require("./libs/prototypes");

const shardingManager = new ShardingManager(join(__dirname, 'kuromuCluster'), {
    client: Kuromu,
    clientOptions: clientConfig,
    development: true,
    clusterCount: 2,
    shardCount: 4
});

const console = new KlasaConsole({
    useColor: true,
    utc: true,
    colors: {
        log: clientConfig.console.colors.startup
    }
});

shardingManager.on('error', message => {
    console.error(message);
});

shardingManager.on("spawn", cluster => {
    console.log(`${new Colors(colorBase.shard).format(`[CLUSTER:${cluster.id}]`)} Cluster ${cluster.id} spawned!`);
});

shardingManager.on('shardReady', shardID => {
    console.log(`${new Colors(colorBase.shard).format(`[${shardID}]`)} Shard ${shardID} is ready!`);
});

shardingManager.on("ready", cluster => {
    console.log(`${new Colors(colorBase.shard).format(`[CLUSTER:${cluster.id}]`)} Cluster ${cluster.id} is ready!`);
});

shardingManager.spawn();
