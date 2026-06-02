const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { User, PasswordReset } = require('../models');
const { generateToken } = require('../utils/token');

async function register(req, res, next) {
  try {
    const { name, email, password, phone } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash, phone });
    const token = generateToken({ id: user.id, email: user.email });

    return res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken({ id: user.id, email: user.email });

    return res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    return next(error);
  }
}

async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.json({ message: 'If the user exists, a reset token was generated' });
    }

    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await PasswordReset.create({ userId: user.id, token, expiresAt });

    console.log(`Password reset token for ${email}: ${token}`);

    return res.json({ message: 'Reset token generated (check backend logs)' });
  } catch (error) {
    return next(error);
  }
}

async function resetPassword(req, res, next) {
  try {
    const { token, newPassword } = req.body;

    const reset = await PasswordReset.findOne({ where: { token, used: false } });
    if (!reset || new Date(reset.expiresAt) < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const user = await User.findByPk(reset.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    reset.used = true;
    await reset.save();

    return res.json({ message: 'Password updated successfully' });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword
};
