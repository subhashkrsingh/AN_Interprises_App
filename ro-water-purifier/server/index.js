const http = require('http');
const app = require('./src/app');
const env = require('./src/config/env');
const logger = require('./src/config/logger');
const { initSocket } = require('./src/config/socket');

const server = http.createServer(app);

initSocket(server);

server.listen(env.port, () => {
  logger.info(`Server running on port ${env.port}`);
});
