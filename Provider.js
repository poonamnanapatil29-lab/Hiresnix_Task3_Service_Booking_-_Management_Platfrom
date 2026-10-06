import mongoose from 'mongoose';

const providerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  businessName: { type: String, required: true },
  bio: { type: String, default: '' },
  rating: { type: Number, default: 5.0 },
  reviewCount: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: true },
  serviceAreas: [{ type: String }],
  experienceYears: { type: Number, default: 5 },
  availability: {
    workingDays: { 
      type: [String], 
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] 
    },
    timeSlots: { 
      type: [String], 
      default: ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM', '06:00 PM'] 
    }
  }
}, { timestamps: true });

export default mongoose.model('Provider', providerSchema);
