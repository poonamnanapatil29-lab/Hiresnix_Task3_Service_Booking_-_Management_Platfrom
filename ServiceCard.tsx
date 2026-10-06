import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, MapPin, CheckCircle, ChevronRight, Bookmark } from 'lucide-react';
import type { Service } from '../types';

interface ServiceCardProps {
  service: Service;
  onBookNow?: (service: Service) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onBookNow }) => {
  const providerName = service.provider?.businessName || 'Verified Professional';
  const providerImage = typeof service.provider?.user === 'object' 
    ? (service.provider.user as any)?.avatar 
    : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-indigo-100 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Thumbnail Header */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={service.images?.[0] || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80'}
          alt={service.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

        {/* Category tag */}
        <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-full shadow-xs">
          {service.category?.name || 'General Service'}
        </span>

        {/* Rating chip on image */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-xs text-white px-2.5 py-1 rounded-full text-xs font-medium">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{service.rating > 0 ? service.rating.toFixed(1) : '5.0'}</span>
          <span className="text-slate-300">({service.reviewCount || 0})</span>
        </div>

        {/* Duration badge */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-xs text-white px-2.5 py-1 rounded-full text-xs">
          <Clock className="w-3.5 h-3.5" />
          <span>{service.durationMins}m</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Provider snippet */}
          <div className="flex items-center gap-2 mb-2.5">
            <img
              src={providerImage}
              alt={providerName}
              className="w-6 h-6 rounded-full object-cover border border-slate-200"
            />
            <span className="text-xs font-medium text-slate-600 truncate">{providerName}</span>
            <CheckCircle className="w-3.5 h-3.5 text-indigo-500 fill-indigo-100 shrink-0" />
          </div>

          {/* Title */}
          <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 text-base">
            <Link to={`/services/${service._id}`}>
              {service.title}
            </Link>
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
            {service.description}
          </p>

          {/* Location */}
          <div className="flex items-center gap-1 mt-3 text-xs text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate">{service.location || 'New York Metro Area'}</span>
          </div>
        </div>

        {/* Footer info & Actions */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block leading-tight font-medium uppercase tracking-wider">Starting at</span>
            <span className="text-lg font-bold text-slate-900">
              ${service.price}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/services/${service._id}`}
              className="text-xs font-medium text-slate-700 hover:text-indigo-600 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Details
            </Link>

            <button
              onClick={() => onBookNow ? onBookNow(service) : window.location.assign(`/services/${service._id}?book=true`)}
              className="text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-xl shadow-xs hover:shadow transition-all active:scale-95 flex items-center gap-1"
            >
              <span>Book</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
