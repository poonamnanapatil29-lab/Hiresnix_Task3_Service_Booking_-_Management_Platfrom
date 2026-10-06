import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['customer', 'provider', 'admin'], 
    default: 'customer' 
  },
  phone: { type: String, default: '' },
  avatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
  address: {
    street: { type: String, default: '' },
    city: { type: String, default: 'New York' },
    state: { type: String, default: 'NY' },
    zipCode: { type: String, default: '10001' }
  },
  savedServices: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, { timestamps: true });

userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
