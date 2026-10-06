import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['booking_created', 'booking_status', 'review_received', 'system'], 
    default: 'system' 
  },
  isRead: { type: Boolean, default: false },
  link: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('Notification', notificationSchema);
