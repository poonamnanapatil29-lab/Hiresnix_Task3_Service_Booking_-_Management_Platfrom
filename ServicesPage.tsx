import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  SlidersHorizontal, 
  MapPin, 
  Star, 
  Sparkles, 
  X,
  Filter,
  ArrowUpDown
} from 'lucide-react';
import type { Service, Category } from '../types';
import { apiRequest } from '../services/api';
import { ServiceCard } from '../components/ServiceCard';
import { BookingModal } from '../components/BookingModal';

export const ServicesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters State
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [locationTerm, setLocationTerm] = useState(searchParams.get('location') || '');
  const [maxPrice, setMaxPrice] = useState<number>(300);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState('popularity');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [activeBookingService, setActiveBookingService] = useState<Service | null>(null);

  useEffect(() => {
    apiRequest<{ success: boolean; categories: Category[] }>('/categories')
      .then(res => res.success && setCategories(res.categories))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchFilteredServices();
  }, [searchParams, sortBy, maxPrice, minRating]);

  const fetchFilteredServices = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      const s = searchParams.get('search');
      const c = searchParams.get('category');
      const loc = searchParams.get('location');

      if (s) params.append('search', s);
      if (c) params.append('category', c);
      if (loc) params.append('location', loc);
      if (maxPrice < 300) params.append('maxPrice', maxPrice.toString());
      if (minRating > 0) params.append('rating', minRating.toString());
      if (sortBy) params.append('sort', sortBy);

      const res = await apiRequest<{ success: boolean; services: Service[] }>(`/services?${params.toString()}`);
      if (res.success) {
        setServices(res.services);
      }
    } catch {
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    const nextParams = new URLSearchParams();
    if (searchTerm.trim()) nextParams.set('search', searchTerm.trim());
    if (selectedCategory) nextParams.set('category', selectedCategory);
    if (locationTerm.trim()) nextParams.set('location', locationTerm.trim());
    setSearchParams(nextParams);
    setMobileFilterOpen(false);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setLocationTerm('');
    setMaxPrice(300);
    setMinRating(0);
    setSortBy('popularity');
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Banner & Header */}
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Marketplace Directory</span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Discover & Book Services</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Explore vetted professionals across home maintenance, personal grooming, tuition, and tech assistance.
        </p>
      </div>

      {/* Main Layout: Filters Sidebar + Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* DESKTOP FILTER SIDEBAR */}
        <aside className="hidden lg:block space-y-6 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs h-fit sticky top-24">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
              <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
              <span>Filters</span>
            </div>
            <button
              onClick={resetFilters}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              Reset All
            </button>
          </div>

          {/* Search Query */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Keyword</label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                placeholder="e.g. Deep clean, leak"
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                const nextParams = new URLSearchParams(searchParams);
                if (e.target.value) nextParams.set('category', e.target.value);
                else nextParams.delete('category');
                setSearchParams(nextParams);
              }}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden bg-white"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Location / City</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={locationTerm}
                onChange={(e) => setLocationTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                placeholder="e.g. New York, Brooklyn"
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden"
              />
            </div>
          </div>

          {/* Max Price Range Slider */}
          <div>
            <div className="flex justify-between items-center mb-1.5 text-xs">
              <span className="font-semibold text-slate-700">Max Price</span>
              <span className="font-bold text-indigo-600">${maxPrice}</span>
            </div>
            <input
              type="range"
              min={30}
              max={300}
              step={10}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
          </div>

          {/* Rating filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Minimum Rating</label>
            <div className="grid grid-cols-4 gap-1.5">
              {[0, 4.0, 4.5, 4.8].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setMinRating(r)}
                  className={`py-1.5 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1 transition-colors ${
                    minRating === r
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{r === 0 ? 'All' : `${r}+`}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={applyFilters}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            Apply Filters
          </button>
        </aside>

        {/* RESULTS GRID & CONTROLS */}
        <main className="lg:col-span-3 space-y-6">
          {/* Top Sort & Count Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Mobile filter toggle */}
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Filters</span>
              </button>

              <span className="text-xs sm:text-sm font-semibold text-slate-700">
                Found <strong className="text-slate-900">{services.length}</strong> available services
              </span>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <ArrowUpDown className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-500 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl outline-hidden cursor-pointer"
              >
                <option value="popularity">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Service Cards Grid or Empty State */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border border-slate-100 p-4 space-y-3">
                  <div className="bg-slate-200 h-40 rounded-xl w-full" />
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-full" />
                  <div className="h-3 bg-slate-100 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : services.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No Services Found</h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
                We couldn't find any services matching your criteria. Try adjusting keywords, removing filters, or searching another location.
              </p>
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold shadow hover:bg-indigo-700 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <ServiceCard
                  key={service._id}
                  service={service}
                  onBookNow={(s) => setActiveBookingService(s)}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Global Booking Modal */}
      {activeBookingService && (
        <BookingModal
          service={activeBookingService}
          isOpen={!!activeBookingService}
          onClose={() => setActiveBookingService(null)}
        />
      )}
    </div>
  );
};
