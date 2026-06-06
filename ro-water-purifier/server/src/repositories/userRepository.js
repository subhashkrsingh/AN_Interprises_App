const prisma = require('../config/prisma');

const userInclude = {
  roles: {
    include: {
      role: {
        include: {
          permissions: {
            include: { permission: true },
          },
        },
      },
    },
  },
};

const userRepository = {
  findByEmail(email) {
    return prisma.user.findUnique({
      where: { email },
      include: userInclude,
    });
  },
  findById(id) {
    return prisma.user.findUnique({
      where: { id },
      include: userInclude,
    });
  },
  update(id, data) {
    return prisma.user.update({
      where: { id },
      data,
      include: userInclude,
    });
  },
};

module.exports = userRepository;
