const express = require('express');
const server = express();
const client = require('prom-client');
const moment = require('moment');
const collectDefaultMetrics = client.collectDefaultMetrics;


console.log("Starting server");

// Probe every 5th second.
collectDefaultMetrics({ timeout: 5000, prefix: 'heartbeat_' });

const heartbeats = new client.Counter({
  name: `heartbeat_data`,
  help: 'Time since last heartbeat',
  labelNames: ['device'],
});

function log(msg) {
  console.log(moment().format('YYYY/MM/DD - HH:mm:ss') + " - " + msg);
}

server.get('/heartbeat/:name', (req, res) => {
  var token = req.headers['x-secret'] || false;
  if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });
  if (token !== process.env.SECRET) {
    log("Request denied because of invalid token: " + token);
    return res.status(401).json({ auth: false, message: 'Invalid token provided.' });
  }

  heartbeats.inc({ device: req.params.name }, 1, Date.now());
  
  log("Heartbeat received for " + req.params.name)
  res.json({ name: req.params.name, success: true });
});

server.get('/metrics', (req, res) => {
	res.end(client.register.metrics());
});

server.use(function (req, res, next) {
  res.status(404).json({ success: false });
});

server.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).json({ success: false, error: err.message });
});

log('Server listening to 3000, metrics exposed on /metrics endpoint');
log('Listening for heartbeats on /heartbeat/:name and authorizing with secret: ' + process.env.SECRET);
server.listen(3000);