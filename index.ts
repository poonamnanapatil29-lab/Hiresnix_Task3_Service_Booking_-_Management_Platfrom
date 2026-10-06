export type UserRole = 'customer' | 'provider' | 'admin';

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  savedServices?: string[];
  providerProfile?: string | ProviderProfile;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image: string;
  isPopular?: boolean;
}

export interface ProviderProfile {
  _id: string;
  user: User | string;
  businessName: string;
  bio: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  serviceAreas: string[];
  experienceYears?: number;
  availability: {
    workingDays: string[];
    timeSlots: string[];
  };
}

export interface Service {
  _id: string;
  title: string;
  description: string;
  category: Category;
  provider: ProviderProfile;
  price: number;
  durationMins: number;
  images: string[];
  features: string[];
  location: string;
  rating: number;
  reviewCount: number;
  isActive: boolean;
  isPopular?: boolean;
}

export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'rejected';
export type PaymentStatus = 'pending' | 'paid' | 'refunded';

export interface Booking {
  _id: string;
  bookingId: string;
  customer: User;
  provider: ProviderProfile;
  service: Service;
  bookingDate: string;
  timeSlot: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  totalPrice: number;
  customerAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  notes?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  service: string | Service;
  provider: string;
  customer: {
    _id: string;
    name: string;
    avatar?: string;
  };
  rating: number;
  comment: string;
  providerReply?: string;
  createdAt: string;
}

export interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  type: 'booking_created' | 'booking_status' | 'review_received' | 'system';
  isRead: boolean;
  link?: string;
  createdAt: string;
}
