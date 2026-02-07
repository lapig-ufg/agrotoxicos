require('dotenv').config();
const cluster = require('cluster');
const os = require('os');

const totalCPUs = os.cpus().length;
let clusterWorkerSize = totalCPUs;

if (clusterWorkerSize > 1) {
    if (cluster.isMaster) {
        if (process.env.NODE_ENV === 'dev') {
            clusterWorkerSize = 2;
        } else if (process.env.NODE_ENV === 'worker') {
            clusterWorkerSize = parseInt(process.env.NUMBER_WORKERS);
        } else {
            // Usa 1/4 dos cores disponíveis OU no máximo 8 (o que for menor)
            clusterWorkerSize = Math.min(Math.max(Math.floor(totalCPUs / 4), 1), 8);
        }

        console.log(`Total CPUs: ${totalCPUs}, Workers: ${clusterWorkerSize}`);

        for (let i = 0; i < clusterWorkerSize; i++) {
            let ENV_VAR = {};
            if (i === 0) {
                ENV_VAR = { 'PRIMARY_WORKER': 1 };
            }
            cluster.fork(ENV_VAR);
        }

        cluster.on("exit", function(worker) {
            console.log(process.env.APP_NAME, worker.id, "has exited.");
        });
    } else {
        require('./app.js');
    }
} else {
    require('./app.js');
}