const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'mini-movements-secret-key-2026';
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || 'mini-movements-refresh-token-secret-xyz';

const generateAccessToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: '15m' });
const generateRefreshToken = (id) => jwt.sign({ id }, REFRESH_SECRET, { expiresIn: '30d' });

const setCookies = (res, accessToken, refreshToken) => {
  const isProd = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
  
  const commonOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    path: '/'
  };

  res.cookie('accessToken', accessToken, {
    ...commonOptions,
    maxAge: 15 * 60 * 1000 // 15 mins
  });
  
  res.cookie('refreshToken', refreshToken, {
    ...commonOptions,
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(`📝 Signup attempt: ${email}`);

    // Input Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields (name, email, password) are required.' });
    }

    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'This email is already registered.' });
    }

    const user = await User.create({ name, email, password });
    
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save();
    
    setCookies(res, accessToken, refreshToken);

    res.status(201).json({ 
      user: { _id: user._id, name: user.name, email: user.email, role: user.role }, 
      accessToken 
    });
  } catch (err) {
    console.error('❌ Registration Error:', err.message);
    
    // Catch Mongoose Validation Errors (e.g. password too short)
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    
    res.status(500).json({ message: 'Database error during registration', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Invalid email or password' });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save();
    setCookies(res, accessToken, refreshToken);

    res.json({ user: { _id: user._id, name: user.name, email: user.email, role: user.role }, accessToken });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const isProd = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
    
    // Clear user's refresh token from DB if they are authenticated
    if (req.user) {
      req.user.refreshToken = '';
      await req.user.save();
    }

    const cookieOptions = {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      path: '/'
    };

    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);
    
    res.json({ message: 'Logged out successfully 🧸👋' });
  } catch (err) {
    console.error('❌ Signout Error:', err);
    res.status(500).json({ message: 'Server error during signout' });
  }
};

exports.refresh = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ message: 'No refresh token' });

    const decoded = jwt.verify(token, REFRESH_SECRET);
    const user = await User.findById(decoded.id).select('+refreshToken');
    if (!user || user.refreshToken !== token) return res.status(401).json({ message: 'Invalid refresh token' });

    const accessToken = generateAccessToken(user._id);
    const isProd = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
    
    res.cookie('accessToken', accessToken, {
      httpOnly: true, 
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax', 
      maxAge: 15 * 60 * 1000
    });
    res.json({ accessToken });
  } catch (err) {
    console.error('❌ Refresh Error:', err.message);
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

exports.getMe = async (req, res) => { res.json(req.user); };

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const user = await User.findById(req.user._id);
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().sort('-createdAt');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
