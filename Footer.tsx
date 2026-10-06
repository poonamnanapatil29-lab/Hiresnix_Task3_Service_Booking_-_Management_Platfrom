import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shield, Mail, Phone, MapPin, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-lg">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-bold text-2xl tracking-tight text-white">
                Servi<span className="text-indigo-400">Sync</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              The premier on-demand services marketplace connecting homeowners and businesses with background-checked, insured, and verified trade professionals.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-slate-400">
              <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>100% Satisfaction Guarantee</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/services" className="hover:text-indigo-400 transition-colors">Explore All Services</Link></li>
              <li><Link to="/providers" className="hover:text-indigo-400 transition-colors">Verified Providers</Link></li>
              <li><a href="/#how-it-works" className="hover:text-indigo-400 transition-colors">How Booking Works</a></li>
              <li><a href="/#testimonials" className="hover:text-indigo-400 transition-colors">Customer Stories</a></li>
              <li><a href="/#faq" className="hover:text-indigo-400 transition-colors">Frequently Asked Questions</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Top Categories</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/services?category=home-cleaning" className="hover:text-indigo-400 transition-colors">Home Cleaning</Link></li>
              <li><Link to="/services?category=plumbing" className="hover:text-indigo-400 transition-colors">Plumbing & Drains</Link></li>
              <li><Link to="/services?category=electrical-services" className="hover:text-indigo-400 transition-colors">Electrical Repairs</Link></li>
              <li><Link to="/services?category=beauty-salon" className="hover:text-indigo-400 transition-colors">Beauty & Styling</Link></li>
              <li><Link to="/services?category=appliance-repair" className="hover:text-indigo-400 transition-colors">Appliance Care</Link></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Get In Touch</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Manhattan, New York, NY</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>support@servisync.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>+1 (800) 555-SYNC</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} ServiSync Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-400">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400">Terms of Service</a>
            <a href="#" className="hover:text-slate-400">Provider Agreement</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
