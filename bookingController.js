import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import Provider from '../models/Provider.js';
import Notification from '../models/Notification.js';

export const createBooking = async (req, res, next) => {
  try {
    const { serviceId, bookingDate, timeSlot, customerAddress, notes, paymentMethod } = req.body;

    const service = await Service.findById(serviceId).populate('provider');
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    // Generate random friendly booking reference
    const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
    const bookingId = `SRV-${randomHex}`;

    const booking = await Booking.create({
      bookingId,
      customer: req.user.id,
      provider: service.provider._id,
      service: service._id,
      bookingDate,
      timeSlot,
      totalPrice: service.price,
      customerAddress: {
        street: customerAddress.street || '123 Main St',
        city: customerAddress.city || 'New York',
        state: customerAddress.state || 'NY',
        zipCode: customerAddress.zipCode || '10001'
      },
      notes: notes || '',
      paymentStatus: 'paid',
      status: 'confirmed' // Instant confirmation for streamlined UX
    });

    // Notify provider
    const providerObj = await Provider.findById(service.provider._id);
    if (providerObj) {
      await Notification.create({
        recipient: providerObj.user,
        type: 'booking_created',
        title: 'New Service Booking',
        message: `You have a new booking ${bookingId} for "${service.title}" on ${bookingDate} at ${timeSlot}.`,
        link: '/dashboard/provider'
      });
    }

    // Notify customer
    await Notification.create({
      recipient: req.user.id,
      type: 'booking_created',
      title: 'Booking Confirmed!',
      message: `Your booking ${bookingId} for "${service.title}" has been successfully scheduled.`,
      link: '/dashboard/customer'
    });

    const populated = await Booking.findById(booking._id)
      .populate('service')
      .populate({
        path: 'provider',
        populate: { path: 'user', select: 'name email avatar phone' }
      })
      .populate('customer', 'name email phone');

    res.status(201).json({ success: true, booking: populated });
  } catch (error) {
    next(error);
  }
};

export const getCustomerBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ customer: req.user.id })
      .populate('service')
      .populate({
        path: 'provider',
        populate: { path: 'user', select: 'name email avatar phone' }
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    next(error);
  }
};

export const getProviderBookings = async (req, res, next) => {
  try {
    const provider = await Provider.findOne({ user: req.user.id });
    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider profile not found' });
    }

    const bookings = await Booking.find({ provider: provider._id })
      .populate('service')
      .populate('customer', 'name email phone avatar address')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    next(error);
  }
};

export const updateBookingStatus = async (req, res, next) => {
  try {
    const { status, cancellationReason, bookingDate, timeSlot } = req.body;
    const booking = await Booking.findById(req.params.id)
      .populate('service')
      .populate('provider');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Check authorization: customer can cancel or reschedule, provider/admin can update status
    const isCustomer = booking.customer.toString() === req.user.id.toString();
    const provider = await Provider.findOne({ user: req.user.id });
    const isProvider = provider && booking.provider._id.toString() === provider._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isCustomer && !isProvider && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this booking' });
    }

    if (bookingDate) booking.bookingDate = bookingDate;
    if (timeSlot) booking.timeSlot = timeSlot;

    if (status) {
      booking.status = status;
      if (status === 'cancelled') {
        booking.cancellationReason = cancellationReason || 'Cancelled by user';
      }
    }

    await booking.save();

    // Notify appropriate counterparty
    const targetUserId = isCustomer ? booking.provider.user : booking.customer;
    await Notification.create({
      recipient: targetUserId,
      type: 'booking_status',
      title: `Booking Update: ${booking.bookingId}`,
      message: `Booking ${booking.bookingId} status changed to "${booking.status}".`,
      link: isCustomer ? '/dashboard/provider' : '/dashboard/customer'
    });

    const updated = await Booking.findById(booking._id)
      .populate('service')
      .populate({
        path: 'provider',
        populate: { path: 'user', select: 'name email avatar phone' }
      })
      .populate('customer', 'name email phone');

    res.json({ success: true, booking: updated });
  } catch (error) {
    next(error);
  }
};
