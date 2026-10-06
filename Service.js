import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true },
  price: { type: Number, required: true },
  durationMins: { type: Number, required: true, default: 60 },
  images: [{ type: String }],
  features: [{ type: String }],
  location: { type: String, default: 'New York, NY' },
  rating: { type: Number, default: 5.0 },
  reviewCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  isPopular: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Service', serviceSchema);
