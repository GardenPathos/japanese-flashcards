const fs = require('fs');
const restify = require('restify');
const restifyPlugins = require('restify-plugins');
const yaml = require('js-yaml');

const routes = require('./src/routes/index.js');
const config = yaml.safeLoad(fs.readFileSync('./conf/config.yaml'));

/**
 * Initialize server
 */
const server = restify.createServer({
  name: config.name,
  version: config.version,
});

/**
 * Insert middleware
 */
server.use(restifyPlugins.jsonBodyParser({ mapParams: true }));
server.use(restifyPlugins.acceptParser(server.acceptable));
server.use(restifyPlugins.queryParser({ mapParams: true }));
server.use(restifyPlugins.fullResponse());

/**
 * Define endpoints
 */
// GET /health
server.get('/health', (req, res, next) => {
  console.log('health check started');
  console.log(`query string params passed: ${req.query}`);
  res.send({ success: true });
  console.log('response sent');
  return next();
});

// GET /get
server.get('/get', (req, res, next) => routes.flashcards.get(req, res, next));

// GET /reset
server.get('/reset', (req, res, next) => routes.flashcards.reset(req, res, next));

server.listen(config.server.port, () => {
  console.log(`Server ready and listening on port ${config.server.port}`);
});
