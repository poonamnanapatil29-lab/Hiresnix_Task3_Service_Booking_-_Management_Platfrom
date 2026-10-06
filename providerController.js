import Provider from '../models/Provider.js';
import Service from '../models/Service.js';
import Booking from '../models/Booking.js';
import Review from '../models/Review.js';

export const getProviders = async (req, res, next) => {
  try {
    const providers = await Provider.find()
      .populate('user', 'name email avatar phone address')
      .sort({ rating: -1 });

    res.json({ success: true, count: providers.length, providers });
  } catch (error) {
    next(error);
  }
};

export const getProviderProfile = async (req, res, next) => {
  try {
    const provider = await Provider.findById(req.params.id).populate('user', 'name email avatar phone address');
    if (!provider) return res.status(404).json({ success: false, message: 'Provider not found' });

    const services = await Service.find({ provider: provider._id, isActive: true }).populate('category');
    const reviews = await Review.find({ provider: provider._id }).populate('customer', 'name avatar').sort({ createdAt: -1 });

    res.json({ success: true, provider, services, reviews });
  } catch (error) {
    next(error);
  }
};

export const getProviderDashboardStats = async (req, res, next) => {
  try {
    const provider = await Provider.findOne({ user: req.user.id });
    if (!provider) return res.status(404).json({ success: false, message: 'Provider profile not found' });

    const bookings = await Booking.find({ provider: provider._id });
    const services = await Service.find({ provider: provider._id });
    const reviews = await Review.find({ provider: provider._id });

    const totalBookings = bookings.length;
    const pendingBookings = bookings.filter(b => b.status === 'pending').length;
    const completedBookings = bookings.filter(b => b.status === 'completed').length;
    const totalRevenue = bookings
      .filter(b => b.status === 'completed' || b.paymentStatus === 'paid')
      .reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);

    const uniqueCustomers = new Set(bookings.map(b => b.customer.toString())).size;

    res.json({
      success: true,
      stats: {
        totalBookings,
        pendingBookings,
        completedBookings,
        totalRevenue,
        totalServices: services.length,
        customerCount: uniqueCustomers,
        rating: provider.rating,
        reviewCount: provider.reviewCount
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateAvailability = async (req, res, next) => {
  try {
    const provider = await Provider.findOne({ user: req.user.id });
    if (!provider) return res.status(404).json({ success: false, message: 'Provider profile not found' });

    if (req.body.workingDays) provider.availability.workingDays = req.body.workingDays;
    if (req.body.timeSlots) provider.availability.timeSlots = req.body.timeSlots;
    if (req.body.serviceAreas) provider.serviceAreas = req.body.serviceAreas;
    if (req.body.businessName) provider.businessName = req.body.businessName;
    if (req.body.bio) provider.bio = req.body.bio;

    await provider.save();
    res.json({ success: true, availability: provider.availability, provider });
  } catch (error) {
    next(error);
  }
};
