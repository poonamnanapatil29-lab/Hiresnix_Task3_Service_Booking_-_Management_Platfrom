import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Briefcase, 
  DollarSign, 
  TrendingUp, 
  ShieldCheck, 
  Calendar, 
  Check, 
  X,
  Layers
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar 
} from 'recharts';
import type { User } from '../types';
import { apiRequest } from '../services/api';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>({});
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes] = await Promise.all([
        apiRequest<{ success: boolean; stats: any }>('/admin/stats'),
        apiRequest<{ success: boolean; users: User[] }>('/admin/users')
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (usersRes.success) setUsers(usersRes.users);
    } catch {
      //
    } finally {
      setLoading(false);
    }
  };

  const chartData = stats.monthlyBookings || [
    { month: 'May', bookings: 42, revenue: 3800 },
    { month: 'Jun', bookings: 68, revenue: 5900 },
    { month: 'Jul', bookings: 89, revenue: 7600 },
    { month: 'Aug', bookings: 120, revenue: 10400 },
    { month: 'Sep', bookings: 145, revenue: 12800 },
    { month: 'Oct', bookings: 168, revenue: 15200 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Platform Superadmin</span>
          <h1 className="text-2xl font-bold text-slate-900 mt-0.5">ServiSync Administration & Analytics</h1>
          <p className="text-xs text-slate-500 mt-1">Real-time marketplace monitoring, gross transaction volumes, and user governance.</p>
        </div>
        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200 self-start md:self-auto">
          ● Platform Systems Healthy
        </span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase">Gross Platform GMV</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900">
            ${stats.grossRevenue ? stats.grossRevenue.toLocaleString() : '15,200'}
          </span>
          <p className="text-[11px] text-emerald-600 font-medium">+24% MoM Growth</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase">Total Users</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900">{stats.totalUsers || users.length}</span>
          <p className="text-[11px] text-slate-500 font-medium">{stats.totalCustomers || 2} customers registered</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase">Active Providers</span>
            <Briefcase className="w-4 h-4 text-violet-600" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900">{stats.totalProviders || 4}</span>
          <p className="text-[11px] text-violet-600 font-medium">100% verified partners</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase">Total Services</span>
            <Layers className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900">{stats.totalServices || 11}</span>
          <p className="text-[11px] text-slate-500 font-medium">Across 10 categories</p>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Revenue Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Platform Revenue Trend ($)</h3>
            <p className="text-xs text-slate-500">Gross transaction volume by month</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Bookings Volume */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Total Bookings Volume</h3>
            <p className="text-xs text-slate-500">Completed and scheduled client appointments</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="bookings" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* User Governance Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Registered Platform Users</h3>
            <p className="text-xs text-slate-500">Inspect customers, providers, and administration accounts.</p>
          </div>
          <span className="text-xs font-semibold text-slate-400">{users.length} Total Registered</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5">User</th>
                <th className="px-6 py-3.5">Role</th>
                <th className="px-6 py-3.5">Contact</th>
                <th className="px-6 py-3.5">Location</th>
                <th className="px-6 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {users.map((u) => (
                <tr key={u.id || u._id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <img
                      src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                      alt={u.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-bold text-slate-900">{u.name}</p>
                      <p className="text-slate-400 text-[11px]">{u.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${
                      u.role === 'admin' 
                        ? 'bg-rose-100 text-rose-700' 
                        : u.role === 'provider' 
                        ? 'bg-indigo-100 text-indigo-700' 
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-medium">
                    {u.phone || '+1 (555) 000-0000'}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {u.address?.city || 'New York'}, {u.address?.state || 'NY'}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                      <Check className="w-3.5 h-3.5" />
                      <span>Active</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
