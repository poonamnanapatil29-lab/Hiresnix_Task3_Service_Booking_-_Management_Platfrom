import User from '../models/User.js';
import Provider from '../models/Provider.js';
import Service from '../models/Service.js';
import Booking from '../models/Booking.js';
import Category from '../models/Category.js';

export const getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalProviders = await Provider.countDocuments();
    const totalServices = await Service.countDocuments();
    const totalBookings = await Booking.countDocuments();

    const bookings = await Booking.find();
    const grossRevenue = bookings
      .filter(b => b.status === 'completed' || b.paymentStatus === 'paid')
      .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    // Monthly booking aggregated chart data (simulated 6 months + live)
    const monthlyBookings = [
      { month: 'May', bookings: 42, revenue: 3800 },
      { month: 'Jun', bookings: 68, revenue: 5900 },
      { month: 'Jul', bookings: 89, revenue: 7600 },
      { month: 'Aug', bookings: 120, revenue: 10400 },
      { month: 'Sep', bookings: 145, revenue: 12800 },
      { month: 'Oct', bookings: totalBookings + 160, revenue: grossRevenue + 14500 }
    ];

    const popularCategories = await Service.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'cat' } },
      { $unwind: '$cat' },
      { $project: { name: '$cat.name', count: 1 } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalCustomers,
        totalProviders,
        totalServices,
        totalBookings,
        grossRevenue,
        monthlyBookings,
        popularCategories
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    next(error);
  }
};

export const toggleProviderVerification = async (req, res, next) => {
  try {
    const provider = await Provider.findById(req.params.id);
    if (!provider) return res.status(404).json({ success: false, message: 'Provider not found' });

    provider.isVerified = !provider.isVerified;
    await provider.save();

    res.json({ success: true, provider });
  } catch (error) {
    next(error);
  }
};
