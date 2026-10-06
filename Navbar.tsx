import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  Calendar, 
  User as UserIcon, 
  LogOut, 
  Bell, 
  Menu, 
  X, 
  ShieldCheck, 
  Briefcase, 
  CheckCircle2,
  ChevronDown
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout, quickLogin, notifications, unreadCount, markAllNotificationsRead } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/dashboard/admin';
    if (user.role === 'provider') return '/dashboard/provider';
    return '/dashboard/customer';
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-tight text-slate-900 flex items-center gap-1">
                Servi<span className="text-indigo-600">Sync</span>
              </span>
              <span className="text-[10px] text-slate-600 font-medium -mt-1 tracking-wider uppercase">Pro Services</span>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
            <Link to="/services" className="hover:text-indigo-600 transition-colors">All Services</Link>
            <Link to="/providers" className="hover:text-indigo-600 transition-colors">Top Providers</Link>
            <a href="/#how-it-works" className="hover:text-indigo-600 transition-colors">How It Works</a>
            <a href="/#faq" className="hover:text-indigo-600 transition-colors">FAQ</a>
          </nav>

          {/* Right Area: Auth & Actions */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setNotifDropdownOpen(!notifDropdownOpen);
                      setUserDropdownOpen(false);
                      if (!notifDropdownOpen && unreadCount > 0) {
                        markAllNotificationsRead();
                      }
                    }}
                    className="p-2 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 relative transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white"></span>
                    )}
                  </button>

                  {notifDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 px-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="flex items-center justify-between px-3 pb-2 border-b border-slate-100">
                        <span className="font-semibold text-slate-800 text-sm">Notifications</span>
                        <span className="text-xs text-indigo-600 font-medium">Recent</span>
                      </div>
                      <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                        {notifications.length === 0 ? (
                          <div className="p-4 text-center text-xs text-slate-600">No new notifications</div>
                        ) : (
                          notifications.slice(0, 6).map((n) => (
                            <div key={n._id} className="p-2.5 hover:bg-slate-50 rounded-xl transition-colors text-left">
                              <p className="text-xs font-semibold text-slate-800">{n.title}</p>
                              <p className="text-xs text-slate-600 mt-0.5">{n.message}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setUserDropdownOpen(!userDropdownOpen);
                      setNotifDropdownOpen(false);
                    }}
                    className="flex items-center gap-2.5 p-1.5 pl-2 pr-3 rounded-full hover:bg-slate-100 border border-slate-200 transition-colors"
                  >
                    <img
                      src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                      alt={user.name}
                      className="w-7 h-7 rounded-full object-cover ring-2 ring-indigo-500/20"
                    />
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-semibold text-slate-800 leading-none">{user.name.split(' ')[0]}</span>
                      <span className="text-[10px] text-slate-600 capitalize leading-tight">{user.role}</span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-600" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs text-slate-600 font-medium">Signed in as</p>
                        <p className="text-sm font-semibold text-slate-900 truncate">{user.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md text-[10px] font-semibold uppercase tracking-wider">
                          {user.role} Account
                        </span>
                      </div>

                      <div className="py-1 text-sm text-slate-700">
                        <Link
                          to={getDashboardLink()}
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                        >
                          <Briefcase className="w-4 h-4 text-slate-600" />
                          <span>Dashboard</span>
                        </Link>
                        {user.role === 'customer' && (
                          <Link
                            to="/dashboard/customer"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                          >
                            <Calendar className="w-4 h-4 text-slate-600" />
                            <span>My Bookings</span>
                          </Link>
                        )}
                        <Link
                          to="/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                        >
                          <UserIcon className="w-4 h-4 text-slate-600" />
                          <span>Profile Settings</span>
                        </Link>
                      </div>

                      <div className="pt-1 border-t border-slate-100">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {/* One-click Demo Selector */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
                  <span className="text-[11px] text-slate-600 px-1.5 font-medium">Quick Demo:</span>
                  <button
                    onClick={() => quickLogin('customer')}
                    className="px-2 py-1 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-lg shadow-xs hover:text-indigo-600 transition-all text-xs"
                    title="Sign in as demo customer"
                  >
                    Customer
                  </button>
                  <button
                    onClick={() => quickLogin('provider')}
                    className="px-2 py-1 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-lg shadow-xs hover:text-indigo-600 transition-all text-xs"
                    title="Sign in as demo provider"
                  >
                    Provider
                  </button>
                  <button
                    onClick={() => quickLogin('admin')}
                    className="px-2 py-1 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-lg shadow-xs hover:text-indigo-600 transition-all text-xs"
                    title="Sign in as demo admin"
                  >
                    Admin
                  </button>
                </div>

                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-700 hover:text-indigo-600 px-3 py-2 transition-colors"
                >
                  Log in
                </Link>

                <Link
                  to="/register"
                  className="text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-2 text-base font-medium text-slate-700">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-slate-100">Home</Link>
            <Link to="/services" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-slate-100">Services</Link>
            <Link to="/providers" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-slate-100">Providers</Link>
            {user && (
              <Link to={getDashboardLink()} onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg bg-indigo-50 text-indigo-700 font-semibold">
                Dashboard ({user.role})
              </Link>
            )}
          </nav>

          <div className="pt-3 border-t border-slate-100">
            {user ? (
              <button
                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                className="w-full py-2.5 rounded-xl bg-rose-50 text-rose-600 font-semibold text-sm"
              >
                Sign Out
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl border border-slate-300 font-medium text-slate-700"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-indigo-600 text-white font-medium shadow"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
