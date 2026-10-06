import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Star, MapPin, Award, CheckCircle2 } from 'lucide-react';
import type { ProviderProfile } from '../types';
import { apiRequest } from '../services/api';

export const ProvidersPage: React.FC = () => {
  const [providers, setProviders] = useState<ProviderProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest<{ success: boolean; providers: ProviderProfile[] }>('/providers')
      .then(res => {
        if (res.success) setProviders(res.providers);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Verified Pros</span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Our Service Providers</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Every provider is background checked, insured, and verified with customer ratings.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-white rounded-3xl border border-slate-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.map((p) => {
            const userObj = typeof p.user === 'object' ? (p.user as any) : null;
            return (
              <div
                key={p._id}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start gap-4">
                    <img
                      src={userObj?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                      alt={p.businessName}
                      className="w-16 h-16 rounded-full object-cover ring-2 ring-indigo-50"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-base text-slate-900">{p.businessName}</h3>
                        <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                      </div>
                      <p className="text-xs text-slate-500">{userObj?.name}</p>
                      <div className="flex items-center gap-1 mt-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md w-fit">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{p.rating?.toFixed(1) || '5.0'}</span>
                        <span className="font-normal text-amber-600">({p.reviewCount} reviews)</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mt-4 leading-relaxed line-clamp-3">
                    {p.bio}
                  </p>

                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{p.serviceAreas?.join(', ') || 'New York, Brooklyn, Queens'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-3.5 h-3.5 text-slate-400" />
                      <span>{p.experienceYears || 5}+ Years of Trade Experience</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                    Available for Booking
                  </span>
                  <Link
                    to={`/services?search=${encodeURIComponent(p.businessName)}`}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                  >
                    View Services →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
