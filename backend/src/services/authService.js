const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

const registerUser = async ({ name, email, password }) => {
  const exists = await User.findOne({ email });
  if (exists) throw Object.assign(new Error('Email already registered'), { statusCode: 400 });

  const user = await User.create({ name, email, password });
  return { user: { _id: user._id, name: user.name, email: user.email, role: user.role }, token: generateToken(user._id) };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    throw Object.assign(new Error('Invalid email or password'), { statusCode: 401 });
  }
  return { user: { _id: user._id, name: user.name, email: user.email, role: user.role }, token: generateToken(user._id) };
};

module.exports = { registerUser, loginUser };
