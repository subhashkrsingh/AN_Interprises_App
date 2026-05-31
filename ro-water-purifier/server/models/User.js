const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, trim: true, required: true },
    email: { type: String, trim: true, lowercase: true, unique: true, required: true },
    username: { type: String, trim: true, lowercase: true, unique: true, required: true },
    mobile: { type: String, trim: true, unique: true, required: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['Super Admin', 'Admin', 'Staff', 'Customer'], default: 'Customer' },
    avatar: { type: String, default: '' },
    address: { type: String, trim: true, default: '' },
    city: { type: String, trim: true, default: '' },
    state: { type: String, trim: true, default: '' },
    pinCode: { type: String, trim: true, default: '' },
    isEmailVerified: { type: Boolean, default: false },
    emailVerifyToken: { type: String },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
    otpCode: { type: String, select: false },
    otpExpires: { type: Date },
    refreshTokens: [{ token: String, createdAt: Date }],
    googleId: { type: String, default: '' },
    lastLoginAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.hasValidOtp = function (otp) {
  if (!this.otpCode || !this.otpExpires) return false;
  return this.otpCode === otp && new Date() < this.otpExpires;
};

userSchema.methods.addRefreshToken = function (token) {
  this.refreshTokens.push({ token, createdAt: new Date() });
  return this.save();
};

userSchema.methods.removeRefreshToken = function (token) {
  this.refreshTokens = this.refreshTokens.filter((rt) => rt.token !== token);
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
