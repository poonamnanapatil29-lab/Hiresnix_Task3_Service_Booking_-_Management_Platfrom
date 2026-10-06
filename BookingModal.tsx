import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Check, 
  CreditCard, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  ArrowLeft,
  DollarSign
} from 'lucide-react';
import type { Service, Booking } from '../types';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../services/api';

interface BookingModalProps {
  service: Service;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (booking: Booking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ service, isOpen, onClose, onSuccess }) => {
  const { user, quickLogin } = useAuth();
  const navigate = useNavigate();

  // Steps: 1: Service confirm, 2: Date, 3: Time Slot, 4: Customer Details, 5: Review & Pay, 6: Success
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [selectedSlot, setSelectedSlot] = useState('11:00 AM');
  const [address, setAddress] = useState({
    street: user?.address?.street || '124 Park Avenue, Apt 4B',
    city: user?.address?.city || 'New York',
    state: user?.address?.state || 'NY',
    zipCode: user?.address?.zipCode || '10001'
  });
  const [phone, setPhone] = useState(user?.phone || '+1 (555) 019-8234');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const availableSlots = service.provider?.availability?.timeSlots || [
    '09:00 AM', '11:00 AM', '01:30 PM', '03:30 PM', '05:30 PM'
  ];

  const handleNext = () => {
    setErrorMsg('');
    if (currentStep === 4 && (!address.street || !address.city || !phone)) {
      setErrorMsg('Please complete your contact and address information.');
      return;
    }
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setErrorMsg('');
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleConfirmBooking = async () => {
    if (!user) {
      setErrorMsg('Please sign in or use one-click demo login to book.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await apiRequest<{ success: boolean; booking: Booking }>('/bookings', {
        method: 'POST',
        body: JSON.stringify({
          serviceId: service._id,
          bookingDate: selectedDate,
          timeSlot: selectedSlot,
          customerAddress: address,
          notes,
          paymentMethod: 'card'
        })
      });

      if (res.success && res.booking) {
        setConfirmedBooking(res.booking);
        setCurrentStep(6);
        if (onSuccess) onSuccess(res.booking);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to complete booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              {currentStep < 6 ? `Step ${currentStep} of 5` : 'Confirmation'}
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              {currentStep === 1 && 'Confirm Service'}
              {currentStep === 2 && 'Select Date'}
              {currentStep === 3 && 'Choose Time Slot'}
              {currentStep === 4 && 'Service Location & Notes'}
              {currentStep === 5 && 'Review & Payment'}
              {currentStep === 6 && 'Booking Confirmed!'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        {currentStep <= 5 && (
          <div className="w-full bg-slate-100 h-1">
            <div 
              className="bg-indigo-600 h-1 transition-all duration-300"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>
        )}

        {/* Body content based on step */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
              {errorMsg}
            </div>
          )}

          {/* STEP 1: SERVICE OVERVIEW */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="flex gap-4 items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <img
                  src={service.images?.[0] || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80'}
                  alt={service.title}
                  className="w-20 h-20 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <span className="text-xs text-indigo-600 font-semibold">{service.category?.name}</span>
                  <h4 className="font-bold text-slate-900 text-base">{service.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">By {service.provider?.businessName}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs font-semibold text-slate-700">
                    <span>${service.price}</span>
                    <span>•</span>
                    <span>{service.durationMins} minutes</span>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-2">What is included:</h5>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {service.features?.slice(0, 4).map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-indigo-50/70 p-3 rounded-xl border border-indigo-100 text-xs text-indigo-900 flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Backed by ServiSync Happiness Guarantee with free cancellation up to 24h prior.</span>
              </div>
            </div>
          )}

          {/* STEP 2: DATE SELECTION */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <label className="block text-xs font-semibold uppercase text-slate-500 tracking-wider">
                Select an appointment date:
              </label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-2xl text-slate-800 font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden"
              />

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-600 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Selected Date: <strong className="text-slate-800">{new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}</strong></span>
              </div>
            </div>
          )}

          {/* STEP 3: TIME SLOT */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <label className="block text-xs font-semibold uppercase text-slate-500 tracking-wider">
                Choose an available slot for {selectedDate}:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {availableSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-3 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-2 transition-all ${
                      selectedSlot === slot
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-400 hover:bg-slate-50'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>{slot}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: CUSTOMER DETAILS & ADDRESS */}
          {currentStep === 4 && (
            <div className="space-y-3.5">
              {!user && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center justify-between">
                  <span>Sign in required to link booking.</span>
                  <button
                    onClick={() => quickLogin('customer')}
                    className="font-bold text-amber-900 underline hover:text-amber-700"
                  >
                    Demo Login (Customer)
                  </button>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Street Address</label>
                <input
                  type="text"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  placeholder="e.g. 124 Park Avenue, Apt 4B"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">State</label>
                  <input
                    type="text"
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Zip Code</label>
                  <input
                    type="text"
                    value={address.zipCode}
                    onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Special Instructions (Optional)</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Gate code, parking instructions, pets, etc."
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-hidden"
                />
              </div>
            </div>
          )}

          {/* STEP 5: REVIEW & PAYMENT */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70 space-y-2.5 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Service</span>
                  <span className="font-bold text-slate-800">{service.title}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Provider</span>
                  <span className="font-semibold text-slate-800">{service.provider?.businessName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Schedule</span>
                  <span className="font-semibold text-slate-800">{selectedDate} at {selectedSlot}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Destination</span>
                  <span className="font-semibold text-slate-800">{address.street}, {address.city}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-sm">
                  <span className="font-bold text-slate-900">Total Price</span>
                  <span className="font-extrabold text-indigo-600 text-base">${service.price}.00</span>
                </div>
              </div>

              {/* Mock payment selector */}
              <div className="border border-indigo-200 bg-indigo-50/50 p-3.5 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Simulated Instant Checkout</p>
                    <p className="text-[11px] text-slate-500">No real card charged (Sandbox Mode)</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 font-bold text-[10px] rounded-md">
                  Active
                </span>
              </div>
            </div>
          )}

          {/* STEP 6: CONFIRMATION */}
          {currentStep === 6 && confirmedBooking && (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md shadow-emerald-100">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div>
                <h4 className="text-xl font-bold text-slate-900">Appointment Scheduled!</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Your appointment has been confirmed with {service.provider?.businessName}.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left text-xs space-y-2 max-w-sm mx-auto">
                <div className="flex justify-between">
                  <span className="text-slate-500">Booking Reference:</span>
                  <span className="font-mono font-bold text-indigo-600">{confirmedBooking.bookingId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Service:</span>
                  <span className="font-semibold text-slate-800">{service.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Time:</span>
                  <span className="font-semibold text-slate-800">{confirmedBooking.bookingDate} • {confirmedBooking.timeSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status:</span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 font-bold rounded-md uppercase text-[10px]">
                    {confirmedBooking.status}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 justify-center pt-2">
                <button
                  onClick={() => {
                    onClose();
                    navigate('/dashboard/customer');
                  }}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow transition-all"
                >
                  View in My Bookings
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        {currentStep < 6 && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                disabled={loading}
                className="flex items-center gap-1.5 px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-white transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : <div />}

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs hover:shadow transition-all"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleConfirmBooking}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-200 transition-all disabled:opacity-50"
              >
                {loading ? 'Processing...' : `Confirm & Pay $${service.price}`}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
