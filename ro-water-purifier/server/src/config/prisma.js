const { PrismaClient } = require('@prisma/client');
const logger = require('./logger');

const prisma = new PrismaClient({
  log: [
    { level: 'error', emit: 'event' },
    { level: 'warn', emit: 'event' },
  ],
});

prisma.$on('error', (event) => logger.error(event));
prisma.$on('warn', (event) => logger.warn(event));

module.exports = prisma;
