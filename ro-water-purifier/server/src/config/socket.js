const env = require('./env');
const logger = require('./logger');

let io = null;

function initSocket(server) {
  try {
    const { Server } = require('socket.io');
    io = new Server(server, {
      cors: {
        origin: env.socketOrigin,
        credentials: true,
      },
    });

    io.on('connection', (socket) => {
      logger.info(`Socket connected: ${socket.id}`);
      socket.join('admins');
      socket.on('disconnect', () => logger.info(`Socket disconnected: ${socket.id}`));
    });
  } catch {
    logger.warn('Socket.IO dependency not installed. Real-time notifications are disabled.');
  }

  return io;
}

function emitAdminNotification(payload) {
  if (!io) return;
  io.to('admins').emit('admin:notification', payload);
}

module.exports = { initSocket, emitAdminNotification };
