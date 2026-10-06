import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Provider from '../models/Provider.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_servisync_jwt_key_2026_modern_saas', {
    expiresIn: '30d'
  });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, businessName, bio } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const assignedRole = role === 'provider' ? 'provider' : 'customer';

    const user = await User.create({
      name,
      email,
      password,
      role: assignedRole
    });

    let providerProfile = null;
    if (assignedRole === 'provider') {
      providerProfile = await Provider.create({
        user: user._id,
        businessName: businessName || `${name}'s Professional Services`,
        bio: bio || 'Professional verified service provider on ServiSync.',
        serviceAreas: ['New York', 'Brooklyn', 'Queens']
      });
    }

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        address: user.address,
        providerProfile: providerProfile ? providerProfile._id : null
      }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    let providerProfile = null;
    if (user.role === 'provider') {
      providerProfile = await Provider.findOne({ user: user._id });
    }

    res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        address: user.address,
        providerProfile: providerProfile ? providerProfile._id : null
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    let providerProfile = null;
    if (user.role === 'provider') {
      providerProfile = await Provider.findOne({ user: user._id });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        address: user.address,
        savedServices: user.savedServices,
        providerProfile
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.name = req.body.name || user.name;
    user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
    user.avatar = req.body.avatar || user.avatar;
    if (req.body.address) {
      user.address = { ...user.address, ...req.body.address };
    }

    if (req.body.password) {
      user.password = req.body.password;
    }

    await user.save();

    if (user.role === 'provider' && req.body.providerData) {
      await Provider.findOneAndUpdate(
        { user: user._id },
        { $set: req.body.providerData },
        { new: true }
      );
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        address: user.address
      }
    });
  } catch (error) {
    next(error);
  }
};

export const toggleSaveService = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const serviceId = req.params.serviceId;
    const index = user.savedServices.indexOf(serviceId);
    
    if (index > -1) {
      user.savedServices.splice(index, 1);
    } else {
      user.savedServices.push(serviceId);
    }
    await user.save();

    res.json({ success: true, savedServices: user.savedServices });
  } catch (error) {
    next(error);
  }
};
