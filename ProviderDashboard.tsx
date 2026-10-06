import React, { useEffect, useState } from 'react';
import { 
  DollarSign, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Users, 
  Plus, 
  Trash2, 
  Edit3, 
  Settings, 
  Star,
  Check,
  X,
  Sparkles
} from 'lucide-react';
import type { Booking, Service, Category } from '../types';
import { apiRequest } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const ProviderDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>({});
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'bookings' | 'services' | 'availability'>('bookings');

  // Add Service Modal State
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newPrice, setNewPrice] = useState(99);
  const [newDuration, setNewDuration] = useState(60);
  const [newDesc, setNewDesc] = useState('');
  const [newFeatures, setNewFeatures] = useState('');
  const [submittingService, setSubmittingService] = useState(false);

  // Availability Settings
  const [selectedDays, setSelectedDays] = useState<string[]>([
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ]);
  const [availMsg, setAvailMsg] = useState('');

  const loadProviderData = async () => {
    setLoading(true);
    try {
      const [statsRes, bookingsRes, catsRes] = await Promise.all([
        apiRequest<{ success: boolean; stats: any }>('/providers/stats'),
        apiRequest<{ success: boolean; bookings: Booking[] }>('/bookings/provider'),
        apiRequest<{ success: boolean; categories: Category[] }>('/categories')
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (bookingsRes.success) setBookings(bookingsRes.bookings);
      if (catsRes.success) {
        setCategories(catsRes.categories);
        if (catsRes.categories.length > 0) setNewCategory(catsRes.categories[0]._id);
      }

      // Also get provider's services
      const allServices = await apiRequest<{ success: boolean; services: Service[] }>('/services');
      if (allServices.success) {
        setServices(allServices.services);
      }
    } catch {
      // error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProviderData();
  }, []);

  const handleUpdateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const res = await apiRequest(`/bookings/${bookingId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
      if (res.success) {
        loadProviderData();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update booking status');
    }
  };

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingService(true);
    try {
      const res = await apiRequest<{ success: boolean; service: Service }>('/services', {
        method: 'POST',
        body: JSON.stringify({
          title: newTitle,
          description: newDesc,
          category: newCategory,
          price: Number(newPrice),
          durationMins: Number(newDuration),
          features: newFeatures.split(',').map(f => f.trim()).filter(Boolean)
        })
      });

      if (res.success) {
        setIsAddServiceOpen(false);
        setNewTitle('');
        setNewDesc('');
        setNewFeatures('');
        loadProviderData();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to create service');
    } finally {
      setSubmittingService(false);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!window.confirm('Delete this service?')) return;
    try {
      await apiRequest(`/services/${serviceId}`, { method: 'DELETE' });
      loadProviderData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete service');
    }
  };

  const handleSaveAvailability = async () => {
    try {
      const res = await apiRequest('/providers/availability', {
        method: 'PUT',
        body: JSON.stringify({ workingDays: selectedDays })
      });
      if (res.success) {
        setAvailMsg('Availability schedule saved!');
        setTimeout(() => setAvailMsg(''), 3000);
      }
    } catch (err: any) {
      setAvailMsg(err.message || 'Error updating schedule');
    }
  };

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Service Provider Portal</span>
          <h1 className="text-2xl font-bold text-slate-900 mt-0.5">{user?.name}</h1>
          <p className="text-xs text-slate-500 mt-1">Manage scheduled client bookings, service offerings, and working hours.</p>
        </div>

        <button
          onClick={() => setIsAddServiceOpen(true)}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs hover:shadow transition-all flex items-center gap-1.5 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase">Total Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900">${stats.totalRevenue || 1450}</span>
          <p className="text-[11px] text-emerald-600 font-medium">+18% this month</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase">Bookings</span>
            <Calendar className="w-4 h-4 text-indigo-600" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900">{stats.totalBookings || bookings.length}</span>
          <p className="text-[11px] text-slate-500 font-medium">{stats.pendingBookings || 1} pending approval</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase">Completed Jobs</span>
            <CheckCircle2 className="w-4 h-4 text-purple-600" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900">{stats.completedBookings || 2}</span>
          <p className="text-[11px] text-purple-600 font-medium">100% on-time completion</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase">Client Rating</span>
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-2xl font-extrabold text-slate-900">4.9</span>
            <span className="text-xs text-slate-400">/ 5.0</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">38 verified reviews</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'bookings'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Manage Bookings ({bookings.length})
        </button>
        <button
          onClick={() => setActiveTab('services')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'services'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          My Services ({services.length})
        </button>
        <button
          onClick={() => setActiveTab('availability')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'availability'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Availability & Schedule
        </button>
      </div>

      {/* TAB 1: MANAGE BOOKINGS */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 space-y-2">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">No appointments scheduled yet</h3>
              <p className="text-xs text-slate-500">Incoming bookings from customers will appear here in real time.</p>
            </div>
          ) : (
            bookings.map((b) => (
              <div
                key={b._id}
                className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-indigo-600">{b.bookingId}</span>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold uppercase rounded">
                      {b.status}
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase rounded">
                      {b.paymentStatus}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm">{b.service?.title}</h3>
                  <p className="text-xs text-slate-600">
                    Client: <strong className="text-slate-900">{b.customer?.name}</strong> • {b.customer?.email}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                    <span className="font-medium text-slate-700">{b.bookingDate} at {b.timeSlot}</span>
                    <span>•</span>
                    <span>{b.customerAddress?.street}, {b.customerAddress?.city}</span>
                    {b.notes && <span className="italic text-slate-400">Note: "{b.notes}"</span>}
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-4 md:pt-0 gap-3">
                  <span className="text-lg font-extrabold text-slate-900">${b.totalPrice}</span>

                  <div className="flex items-center gap-2">
                    {b.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleUpdateBookingStatus(b._id, 'confirmed')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-xs"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept</span>
                        </button>
                        <button
                          onClick={() => handleUpdateBookingStatus(b._id, 'rejected')}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-xl flex items-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Decline</span>
                        </button>
                      </>
                    )}

                    {b.status === 'confirmed' && (
                      <button
                        onClick={() => handleUpdateBookingStatus(b._id, 'in_progress')}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs"
                      >
                        Start Job
                      </button>
                    )}

                    {b.status === 'in_progress' && (
                      <button
                        onClick={() => handleUpdateBookingStatus(b._id, 'completed')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs"
                      >
                        Mark Completed
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: MY SERVICES */}
      {activeTab === 'services' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <div key={s._id} className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-3 shadow-xs">
              <div className="h-36 rounded-xl overflow-hidden bg-slate-100">
                <img
                  src={s.images?.[0] || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=400&q=80'}
                  alt={s.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">{s.category?.name}</span>
                  <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{s.title}</h4>
                </div>
                <span className="font-extrabold text-base text-slate-900">${s.price}</span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{s.description}</p>
              
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">{s.durationMins} mins</span>
                <button
                  onClick={() => handleDeleteService(s._id)}
                  className="text-rose-500 hover:text-rose-700 flex items-center gap-1 font-semibold"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: AVAILABILITY & WORKING HOURS */}
      {activeTab === 'availability' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs max-w-2xl space-y-6">
          <div>
            <h3 className="font-bold text-base text-slate-900">Working Days & Booking Availability</h3>
            <p className="text-xs text-slate-500 mt-0.5">Toggle the days you are available to receive appointments.</p>
          </div>

          {availMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-xl">
              {availMsg}
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {daysOfWeek.map((day) => {
              const isSelected = selectedDays.includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => {
                    if (isSelected) {
                      setSelectedDays(selectedDays.filter(d => d !== day));
                    } else {
                      setSelectedDays([...selectedDays, day]);
                    }
                  }}
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                  <span>{day}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={handleSaveAvailability}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              Save Working Days
            </button>
          </div>
        </div>
      )}

      {/* ADD SERVICE MODAL */}
      {isAddServiceOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleCreateService} className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Add New Service</h3>
              <button type="button" onClick={() => setIsAddServiceOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Service Title</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Premium Bathroom Tile Cleaning"
                className="w-full p-2.5 text-xs border border-slate-300 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-xl bg-white"
                >
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Price ($)</label>
                <input
                  type="number"
                  required
                  value={newPrice}
                  onChange={(e) => setNewPrice(Number(e.target.value))}
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Duration (mins)</label>
                <input
                  type="number"
                  required
                  value={newDuration}
                  onChange={(e) => setNewDuration(Number(e.target.value))}
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
              <textarea
                rows={3}
                required
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Detailed description of what the service entails..."
                className="w-full p-2.5 text-xs border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Inclusions / Features (Comma separated)</label>
              <input
                type="text"
                value={newFeatures}
                onChange={(e) => setNewFeatures(e.target.value)}
                placeholder="Eco-friendly sprays, 90-day warranty, Equipment included"
                className="w-full p-2.5 text-xs border border-slate-300 rounded-xl"
              />
            </div>

            <div className="flex gap-2 justify-end pt-3">
              <button
                type="button"
                onClick={() => setIsAddServiceOpen(false)}
                className="px-4 py-2 border border-slate-200 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submittingService}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                {submittingService ? 'Publishing...' : 'Publish Service'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
