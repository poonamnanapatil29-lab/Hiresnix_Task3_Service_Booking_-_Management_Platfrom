import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  bookingId: { type: String, required: true, unique: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  bookingDate: { type: String, required: true }, // Format: YYYY-MM-DD
  timeSlot: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'rejected'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'paid'
  },
  totalPrice: { type: Number, required: true },
  customerAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, default: 'NY' },
    zipCode: { type: String, default: '10001' }
  },
  notes: { type: String, default: '' },
  cancellationReason: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);
