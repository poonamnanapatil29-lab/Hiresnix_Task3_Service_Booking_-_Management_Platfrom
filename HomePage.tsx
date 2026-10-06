import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  Star, 
  ArrowRight, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Users, 
  Award, 
  ThumbsUp, 
  ChevronDown,
  Wrench,
  Zap,
  Scissors,
  Cpu,
  Car,
  Activity,
  GraduationCap,
  Camera,
  Laptop
} from 'lucide-react';
import type { Category, Service, ProviderProfile } from '../types';
import { apiRequest } from '../services/api';
import { ServiceCard } from '../components/ServiceCard';
import { BookingModal } from '../components/BookingModal';

const iconMap: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="w-6 h-6" />,
  Wrench: <Wrench className="w-6 h-6" />,
  Zap: <Zap className="w-6 h-6" />,
  Scissors: <Scissors className="w-6 h-6" />,
  Cpu: <Cpu className="w-6 h-6" />,
  Car: <Car className="w-6 h-6" />,
  Activity: <Activity className="w-6 h-6" />,
  GraduationCap: <GraduationCap className="w-6 h-6" />,
  Camera: <Camera className="w-6 h-6" />,
  Laptop: <Laptop className="w-6 h-6" />
};

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [popularServices, setPopularServices] = useState<Service[]>([]);
  const [featuredProviders, setFeaturedProviders] = useState<ProviderProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategorySlug, setSelectedCategorySlug] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [activeBookingService, setActiveBookingService] = useState<Service | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    // Load categories
    apiRequest<{ success: boolean; categories: Category[] }>('/categories')
      .then(res => res.success && setCategories(res.categories))
      .catch(() => {});

    // Load popular services
    apiRequest<{ success: boolean; services: Service[] }>('/services?isPopular=true')
      .then(res => res.success && setPopularServices(res.services))
      .catch(() => {});

    // Load top providers
    apiRequest<{ success: boolean; providers: ProviderProfile[] }>('/providers')
      .then(res => res.success && setFeaturedProviders(res.providers.slice(0, 4)))
      .catch(() => {});
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append('search', searchQuery.trim());
    if (selectedCategorySlug) params.append('category', selectedCategorySlug);
    if (selectedCity) params.append('location', selectedCity);
    navigate(`/services?${params.toString()}`);
  };

  const faqs = [
    {
      q: 'How are service providers verified on ServiSync?',
      a: 'All service providers undergo rigorous background checks, credential validation, license verification, and must maintain at least a 4.5-star customer review rating to remain active on the platform.'
    },
    {
      q: 'Can I reschedule or cancel my booking?',
      a: 'Yes, easily! You can reschedule or cancel directly from your customer dashboard with zero penalty up to 24 hours before your scheduled appointment slot.'
    },
    {
      q: 'How does payment and pricing work?',
      a: 'All service prices are upfront with no hidden fees. Payment is securely pre-authorized at booking and only finalized after service completion according to our 100% satisfaction guarantee.'
    },
    {
      q: 'What if I am unhappy with the service?',
      a: 'We offer the ServiSync Happiness Guarantee. If a job is not completed to your satisfaction, we will send another qualified professional to make it right or issue a full refund.'
    }
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/70 via-white to-white pt-12 pb-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100/70 text-indigo-700 text-xs font-semibold tracking-wide">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Over 10,000+ Verified Appointments Completed</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Book Trusted Services, <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                Anytime, Anywhere.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Find, compare, and instantly schedule background-checked local professionals for cleaning, plumbing, electrical, personal grooming, and home repairs.
            </p>

            {/* Smart Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="mt-8 bg-white p-2.5 sm:p-3 rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/80 flex flex-col md:flex-row items-center gap-2 max-w-4xl mx-auto"
            >
              {/* Keyword Search */}
              <div className="flex items-center gap-2 px-3 py-2 w-full md:flex-1 border-b md:border-b-0 md:border-r border-slate-100">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="What service do you need? (e.g. Deep Clean, Leak)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-hidden bg-transparent"
                />
              </div>

              {/* Category Selector */}
              <div className="flex items-center gap-2 px-3 py-2 w-full md:w-56 border-b md:border-b-0 md:border-r border-slate-100">
                <select
                  value={selectedCategorySlug}
                  onChange={(e) => setSelectedCategorySlug(e.target.value)}
                  className="w-full text-xs sm:text-sm text-slate-700 bg-transparent outline-hidden cursor-pointer"
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2 px-3 py-2 w-full md:w-48">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="City (e.g. New York)"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-hidden bg-transparent"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full md:w-auto px-7 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 shrink-0 active:scale-95"
              >
                <span>Search</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Suggestions */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Popular:</span>
              <Link to="/services?category=home-cleaning" className="px-2.5 py-1 bg-white border border-slate-200 rounded-full hover:border-indigo-400 hover:text-indigo-600 transition-colors">House Cleaning</Link>
              <Link to="/services?category=plumbing" className="px-2.5 py-1 bg-white border border-slate-200 rounded-full hover:border-indigo-400 hover:text-indigo-600 transition-colors">Emergency Plumbing</Link>
              <Link to="/services?category=electrical-services" className="px-2.5 py-1 bg-white border border-slate-200 rounded-full hover:border-indigo-400 hover:text-indigo-600 transition-colors">Smart Lighting</Link>
              <Link to="/services?category=beauty-salon" className="px-2.5 py-1 bg-white border border-slate-200 rounded-full hover:border-indigo-400 hover:text-indigo-600 transition-colors">Hair & Styling</Link>
            </div>
          </div>
        </div>
      </section>

      {/* STATISTICS METRICS BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 border border-slate-200/70 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-indigo-600">10,000+</span>
            <p className="text-xs sm:text-sm font-medium text-slate-500">Successful Bookings</p>
          </div>
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-indigo-600">500+</span>
            <p className="text-xs sm:text-sm font-medium text-slate-500">Verified Providers</p>
          </div>
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-indigo-600">50+</span>
            <p className="text-xs sm:text-sm font-medium text-slate-500">Service Categories</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-indigo-600">4.9</span>
              <Star className="w-6 h-6 fill-amber-400 text-amber-400 inline" />
            </div>
            <p className="text-xs sm:text-sm font-medium text-slate-500">Customer Rating</p>
          </div>
        </div>
      </section>

      {/* SERVICE CATEGORIES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Browse by Need</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">Explore Popular Categories</h2>
          </div>
          <Link
            to="/services"
            className="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.slice(0, 10).map((cat) => (
            <Link
              key={cat._id}
              to={`/services?category=${cat.slug}`}
              className="group p-5 bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-lg transition-all duration-200 flex flex-col items-center text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 group-hover:bg-indigo-600 group-hover:text-white text-indigo-600 flex items-center justify-center transition-all duration-200 shadow-xs mb-3">
                {iconMap[cat.icon] || <Sparkles className="w-6 h-6" />}
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-indigo-600 transition-colors">
                {cat.name}
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">View Services</p>
            </Link>
          ))}
        </div>
      </section>

      {/* POPULAR SERVICES CAROUSEL / GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Top Rated</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">Most Booked Services</h2>
          </div>
          <Link
            to="/services"
            className="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group"
          >
            <span>Explore All 15+ Services</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularServices.map((service) => (
            <ServiceCard
              key={service._id}
              service={service}
              onBookNow={(s) => setActiveBookingService(s)}
            />
          ))}
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Simple & Seamless</span>
            <h2 className="text-3xl font-extrabold tracking-tight">How ServiSync Works</h2>
            <p className="text-sm text-slate-400">
              Schedule dependable service in under 60 seconds with clear pricing and guaranteed quality.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 relative flex flex-col justify-between">
              <span className="text-4xl font-extrabold text-indigo-500/30">01</span>
              <div className="mt-4">
                <h3 className="text-base font-bold text-white mb-2">Find a Service</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Browse through dozens of categories or use our smart search to locate the exact trade job you need.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 relative flex flex-col justify-between">
              <span className="text-4xl font-extrabold text-indigo-500/30">02</span>
              <div className="mt-4">
                <h3 className="text-base font-bold text-white mb-2">Choose a Provider</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Check verified customer reviews, transparent pricing, experience portfolios, and credentials.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 relative flex flex-col justify-between">
              <span className="text-4xl font-extrabold text-indigo-500/30">03</span>
              <div className="mt-4">
                <h3 className="text-base font-bold text-white mb-2">Select Date & Time</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Pick an open appointment slot in the provider's live calendar that best matches your day.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 relative flex flex-col justify-between">
              <span className="text-4xl font-extrabold text-indigo-500/30">04</span>
              <div className="mt-4">
                <h3 className="text-base font-bold text-white mb-2">Confirm & Relax</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Receive an instant booking ID, track appointment progress, and review your pro when finished.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED SERVICE PROVIDERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Industry Leaders</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Featured Service Professionals</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Meet our highest-rated and fully verified independent partners in your area.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProviders.map((provider) => {
            const userObj = typeof provider.user === 'object' ? (provider.user as any) : null;
            return (
              <div key={provider._id} className="bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col items-center text-center shadow-xs hover:shadow-lg transition-all">
                <div className="relative mb-4">
                  <img
                    src={userObj?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                    alt={provider.businessName}
                    className="w-20 h-20 rounded-full object-cover ring-4 ring-indigo-50"
                  />
                  {provider.isVerified && (
                    <div className="absolute -bottom-1 -right-1 bg-indigo-600 text-white p-1 rounded-full shadow" title="Verified Provider">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                <h3 className="font-bold text-slate-900 text-sm">{provider.businessName}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{userObj?.name}</p>

                <div className="flex items-center gap-1.5 my-3 bg-amber-50 px-2.5 py-1 rounded-full text-xs font-bold text-amber-800">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{provider.rating.toFixed(1)}</span>
                  <span className="font-normal text-amber-600">({provider.reviewCount} reviews)</span>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                  {provider.bio}
                </p>

                <div className="w-full pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>{provider.experienceYears || 5}+ Yrs Exp</span>
                  <Link
                    to={`/providers/${provider._id}`}
                    className="font-bold text-indigo-600 hover:text-indigo-800"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="bg-indigo-50/60 py-16 border-y border-indigo-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">The ServiSync Standard</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Why Customers Rely on ServiSync</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Vetted & Insured Pros</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every service professional passes identity checks, criminal history verification, and skill evaluations before receiving customer bookings.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Upfront Fixed Pricing</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                No awkward negotiations or surprise charges at your door. You see the transparent total before you tap confirm.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <ThumbsUp className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900">100% Happiness Guarantee</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                If the work performed is not up to our standard, we will send another specialist free of charge or refund your fee.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Client Reviews</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Loved by Thousands of Homeowners</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "ServiSync made booking a deep clean so effortless. Elena was on time, super respectful of our space, and the house has never looked this spotless!"
              </p>
            </div>
            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"
                alt="Sarah Jenkins"
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-bold text-slate-900">Sarah Jenkins</p>
                <p className="text-[11px] text-slate-400">Manhattan, NY</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "Had a sudden kitchen pipe leak on a Saturday morning. Marcus confirmed within 15 minutes and fixed the seal before water caused any floor damage."
              </p>
            </div>
            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
                alt="Liam Anderson"
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-bold text-slate-900">Liam Anderson</p>
                <p className="text-[11px] text-slate-400">Brooklyn, NY</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "We upgraded all our home switches to smart dimmers. David Chen was very knowledgeable, tested every room, and helped us configure Google Home."
              </p>
            </div>
            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                alt="Chloe Bennett"
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-bold text-slate-900">Chloe Bennett</p>
                <p className="text-[11px] text-slate-400">Queens, NY</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Got Questions?</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full p-5 text-left flex items-center justify-between font-bold text-sm text-slate-800 hover:text-indigo-600 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === index ? 'rotate-180 text-indigo-600' : ''}`} />
              </button>
              {openFaq === index && (
                <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-50 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* BOTTOM CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-600 to-violet-700 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Are You a Trade Specialist or Service Provider?</h2>
            <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed">
              Expand your client base, automate appointments, manage revenue, and build your digital reputation on ServiSync.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              to="/register?role=provider"
              className="px-6 py-3 bg-white hover:bg-slate-50 text-indigo-700 font-bold text-xs sm:text-sm rounded-2xl shadow transition-all active:scale-95 text-center"
            >
              Join as Service Provider
            </Link>
            <Link
              to="/services"
              className="px-6 py-3 bg-indigo-800/80 hover:bg-indigo-800 text-white font-semibold text-xs sm:text-sm rounded-2xl transition-all text-center"
            >
              Book a Service
            </Link>
          </div>
        </div>
      </section>

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
