import React, { useEffect, useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  ChevronRight,
  User,
  Star,
  RefreshCw
} from 'lucide-react';
import type { Booking } from '../types';
import { apiRequest } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');
  const [rescheduleBooking, setRescheduleBooking] = useState<Booking | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newSlot, setNewSlot] = useState('11:00 AM');
  const [actionMsg, setActionMsg] = useState('');

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await apiRequest<{ success: boolean; bookings: Booking[] }>('/bookings/customer');
      if (res.success) {
        setBookings(res.bookings || []);
      }
    } catch {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId: string) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      const res = await apiRequest(`/bookings/${bookingId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'cancelled', cancellationReason: 'Customer requested cancellation' })
      });
      if (res.success) {
        setActionMsg('Booking cancelled successfully.');
        fetchBookings();
      }
    } catch (err: any) {
      setActionMsg(err.message || 'Error cancelling booking');
    }
  };

  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleBooking || !newDate) return;

    try {
      const res = await apiRequest(`/bookings/${rescheduleBooking._id}/status`, {
        method: 'PUT',
        body: JSON.stringify({
          bookingDate: newDate,
          timeSlot: newSlot
        })
      });

      if (res.success) {
        setActionMsg(`Booking ${rescheduleBooking.bookingId} rescheduled successfully!`);
        setRescheduleBooking(null);
        fetchBookings();
      }
    } catch (err: any) {
      setActionMsg(err.message || 'Error rescheduling');
    }
  };

  // Filter bookings according to active tab
  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'upcoming') return b.status === 'confirmed' || b.status === 'pending' || b.status === 'in_progress';
    if (activeTab === 'completed') return b.status === 'completed';
    if (activeTab === 'cancelled') return b.status === 'cancelled' || b.status === 'rejected';
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 font-bold rounded-lg text-[10px] uppercase">Confirmed</span>;
      case 'pending':
        return <span className="px-2.5 py-1 bg-amber-100 text-amber-700 font-bold rounded-lg text-[10px] uppercase">Pending</span>;
      case 'in_progress':
        return <span className="px-2.5 py-1 bg-blue-100 text-blue-700 font-bold rounded-lg text-[10px] uppercase">In Progress</span>;
      case 'completed':
        return <span className="px-2.5 py-1 bg-purple-100 text-purple-700 font-bold rounded-lg text-[10px] uppercase">Completed</span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 bg-rose-100 text-rose-700 font-bold rounded-lg text-[10px] uppercase">Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 bg-slate-100 text-slate-700 font-bold rounded-lg text-[10px] uppercase">{status}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Customer Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
            alt={user?.name}
            className="w-16 h-16 rounded-full object-cover ring-4 ring-indigo-50"
          />
          <div>
            <h1 className="text-xl font-bold text-slate-900">Welcome, {user?.name}!</h1>
            <p className="text-xs text-slate-500 mt-0.5">{user?.email} • Customer Portal</p>
            <span className="inline-block mt-1 px-2.5 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-md uppercase">
              Verified Account
            </span>
          </div>
        </div>

        {/* Dashboard quick counts */}
        <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-8">
          <div>
            <span className="text-2xl font-extrabold text-indigo-600">{bookings.length}</span>
            <p className="text-xs text-slate-500 font-medium">Total Bookings</p>
          </div>
          <div>
            <span className="text-2xl font-extrabold text-emerald-600">
              {bookings.filter(b => b.status === 'confirmed' || b.status === 'pending').length}
            </span>
            <p className="text-xs text-slate-500 font-medium">Active / Upcoming</p>
          </div>
          <div>
            <span className="text-2xl font-extrabold text-purple-600">
              {bookings.filter(b => b.status === 'completed').length}
            </span>
            <p className="text-xs text-slate-500 font-medium">Completed</p>
          </div>
        </div>
      </div>

      {actionMsg && (
        <div className="p-3 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold rounded-2xl flex items-center justify-between">
          <span>{actionMsg}</span>
          <button onClick={() => setActionMsg('')} className="text-indigo-400 hover:text-indigo-700">✕</button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'upcoming'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Upcoming Bookings
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'completed'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Completed
        </button>
        <button
          onClick={() => setActiveTab('cancelled')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'cancelled'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Cancelled / Rejected
        </button>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-28 bg-white rounded-2xl animate-pulse border border-slate-100" />
          ))}
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-3">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No {activeTab} bookings</h3>
          <p className="text-xs text-slate-500">You don't have any appointments in this status category.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => (
            <div
              key={b._id}
              className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-indigo-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="flex items-start gap-4">
                <img
                  src={b.service?.images?.[0] || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=400&q=80'}
                  alt={b.service?.title}
                  className="w-16 h-16 rounded-xl object-cover shrink-0"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-indigo-600">{b.bookingId}</span>
                    {getStatusBadge(b.status)}
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">{b.service?.title}</h3>
                  <p className="text-xs text-slate-500">Provider: <strong className="text-slate-700">{b.provider?.businessName}</strong></p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                    <div className="flex items-center gap-1 text-slate-700 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{b.bookingDate}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-700 font-medium">
                      <Clock className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{b.timeSlot}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{b.customerAddress?.city}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price & Actions */}
              <div className="flex flex-row md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-4 md:pt-0 gap-3">
                <div className="text-left md:text-right">
                  <span className="text-[11px] text-slate-400 font-semibold uppercase block">Amount Paid</span>
                  <span className="text-lg font-extrabold text-slate-900">${b.totalPrice}</span>
                </div>

                <div className="flex items-center gap-2">
                  {b.status !== 'cancelled' && b.status !== 'completed' && (
                    <>
                      <button
                        onClick={() => {
                          setRescheduleBooking(b);
                          setNewDate(b.bookingDate);
                          setNewSlot(b.timeSlot);
                        }}
                        className="px-3 py-1.5 border border-slate-200 hover:border-indigo-400 hover:text-indigo-600 text-xs font-semibold rounded-xl text-slate-700 transition-colors"
                      >
                        Reschedule
                      </button>
                      <button
                        onClick={() => handleCancelBooking(b._id)}
                        className="px-3 py-1.5 border border-rose-200 hover:bg-rose-50 text-xs font-semibold rounded-xl text-rose-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {b.status === 'completed' && (
                    <a
                      href={`/services/${b.service?._id}`}
                      className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-xl transition-colors"
                    >
                      Rate & Review
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleRescheduleSubmit} className="bg-white rounded-3xl p-6 max-w-md w-full shadow-xl space-y-4">
            <h3 className="font-bold text-base text-slate-900">Reschedule {rescheduleBooking.bookingId}</h3>
            <p className="text-xs text-slate-500">Pick a new date and time for {rescheduleBooking.service?.title}.</p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">New Date</label>
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full p-2.5 text-xs border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">New Time Slot</label>
              <select
                value={newSlot}
                onChange={(e) => setNewSlot(e.target.value)}
                className="w-full p-2.5 text-xs border border-slate-300 rounded-xl bg-white"
              >
                {['09:00 AM', '11:00 AM', '01:30 PM', '03:30 PM', '05:30 PM'].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setRescheduleBooking(null)}
                className="px-4 py-2 border border-slate-200 text-xs font-semibold rounded-xl hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Save New Appointment
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
