
const http = require('http');
const { Worker } = require('worker_threads');
const config = require('../config/config');
const router = require('../src/router');

let workers = [];

for (let i = 0; i < config.NUM_WORKERS; i++) {
  const worker = new Worker('./src/workers/worker.js');
  workers.push(worker);
}

const server = http.createServer((req, res) => {
  const worker = workers.shift();
  workers.push(worker);

  worker.once('message', (response) => {
    res.writeHead(200, { 'Content-type': 'text/plain' });
    res.end(response);
  });

  worker.postMessage({ url: req.url, method: req.method, router: router });
});

server.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});
                                 
