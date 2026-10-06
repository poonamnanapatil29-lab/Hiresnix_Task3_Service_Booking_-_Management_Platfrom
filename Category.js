import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, default: '' },
  icon: { type: String, default: 'Sparkles' },
  image: { type: String, default: '' },
  isPopular: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Category', categorySchema);
