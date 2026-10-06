import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../services/api';
import { User, Phone, MapPin, CheckCircle, Save } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [street, setStreet] = useState(user?.address?.street || '');
  const [city, setCity] = useState(user?.address?.city || '');
  const [state, setState] = useState(user?.address?.state || '');
  const [zipCode, setZipCode] = useState(user?.address?.zipCode || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const res = await apiRequest('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify({
          name,
          phone,
          address: { street, city, state, zipCode }
        })
      });

      if (res.success) {
        updateUser(res.user);
        setMessage('Profile updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err: any) {
      setMessage(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Account & Profile Settings</h1>
          <p className="text-xs text-slate-500 mt-1">Manage your personal information, address, and default contact details.</p>
        </div>

        {message && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-xl flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
              alt={user?.name}
              className="w-16 h-16 rounded-full object-cover ring-2 ring-indigo-100"
            />
            <div>
              <p className="font-bold text-slate-900 text-sm">{user?.name}</p>
              <p className="text-xs text-slate-500">{user?.email}</p>
              <span className="inline-block mt-1 px-2.5 py-0.5 bg-indigo-50 text-indigo-700 font-bold uppercase text-[10px] rounded">
                {user?.role}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 text-xs border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full p-2.5 text-xs border border-slate-300 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Default Street Address</label>
            <input
              type="text"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="124 Park Ave"
              className="w-full p-2.5 text-xs border border-slate-300 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-2.5 text-xs border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">State</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full p-2.5 text-xs border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Zip Code</label>
              <input
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                className="w-full p-2.5 text-xs border border-slate-300 rounded-xl"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
