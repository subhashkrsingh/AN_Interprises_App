const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/userRepository');

const createUserDocument = (user) => {
  if (!user) return null;

  const document = {
    ...user,
    comparePassword: async function (candidatePassword) {
      if (!this.password) return false;
      return bcrypt.compare(candidatePassword, this.password);
    },
    hasValidOtp: function (otp) {
      if (!this.otpCode || !this.otpExpires) return false;
      return this.otpCode === otp && new Date() < new Date(this.otpExpires);
    },
    addRefreshToken: async function (token) {
      await userRepository.addRefreshToken(this.id, token);
      this.refreshTokens = this.refreshTokens || [];
      this.refreshTokens.push({ token, createdAt: new Date() });
      return this;
    },
    removeRefreshToken: async function (token) {
      await userRepository.removeRefreshToken(token);
      if (Array.isArray(this.refreshTokens)) {
        this.refreshTokens = this.refreshTokens.filter((rt) => rt.token !== token);
      }
      return this;
    },
    save: async function () {
      const updates = {
        fullName: this.fullName,
        email: this.email,
        username: this.username,
        mobile: this.mobile,
        password: this.password,
        role: this.role,
        avatar: this.avatar,
        address: this.address,
        city: this.city,
        state: this.state,
        pinCode: this.pinCode,
        isEmailVerified: this.isEmailVerified,
        emailVerifyToken: this.emailVerifyToken,
        passwordResetToken: this.passwordResetToken,
        passwordResetExpires: this.passwordResetExpires,
        otpCode: this.otpCode,
        otpExpires: this.otpExpires,
        googleId: this.googleId,
        lastLoginAt: this.lastLoginAt,
      };
      const updated = await userRepository.updateUser(this.id, updates);
      Object.assign(this, updated);
      return this;
    },
    deleteOne: async function () {
      await userRepository.deleteUser(this.id);
      return this;
    },
  };

  return document;
};

const buildQuery = ({ filters, multiple = false }) => {
  let includePassword = false;
  let includeRefreshTokens = !multiple;

  const exec = async () => {
    if (multiple) {
      const rows = await userRepository.findMany();
      return rows.map(createUserDocument);
    }
    const user = await userRepository.findOne(filters, {
      includePassword,
      includeRefreshTokens,
    });
    return createUserDocument(user);
  };

  return {
    select: async (fields) => {
      const normalized = fields.split(' ').filter(Boolean);
      includePassword = normalized.some((field) => field.includes('+password'));
      includeRefreshTokens = includeRefreshTokens || normalized.includes('refreshTokens');
      return exec();
    },
    then: (resolve, reject) => exec().then(resolve, reject),
    catch: (fn) => exec().catch(fn),
    exec,
  };
};

const User = {
  findOne: (filters) => buildQuery({ filters, multiple: false }),
  findById: (id) => buildQuery({ filters: { id }, multiple: false }),
  find: () => buildQuery({ filters: null, multiple: true }),
  create: async (data) => createUserDocument(await userRepository.createUser(data)),
};

module.exports = User;
