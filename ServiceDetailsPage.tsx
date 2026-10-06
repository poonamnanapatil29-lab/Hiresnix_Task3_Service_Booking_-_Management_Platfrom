import React, { useEffect, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { 
  Star, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Check, 
  Calendar, 
  Sparkles, 
  User, 
  ChevronRight,
  MessageSquare,
  Award,
  Send
} from 'lucide-react';
import type { Service, Review } from '../types';
import { apiRequest } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { BookingModal } from '../components/BookingModal';

export const ServiceDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const [service, setService] = useState<Service | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingModalOpen, setBookingModalOpen] = useState(searchParams.get('book') === 'true');

  // New review form
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMsg, setReviewMsg] = useState('');

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    apiRequest<{ success: boolean; service: Service }>(`/services/${id}`)
      .then(res => {
        if (res.success) setService(res.service);
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    apiRequest<{ success: boolean; reviews: Review[] }>(`/reviews/service/${id}`)
      .then(res => {
        if (res.success) setReviews(res.reviews);
      })
      .catch(() => {});
  }, [id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setReviewMsg('Please sign in or use one-click demo login to leave a review.');
      return;
    }
    if (!newComment.trim()) return;

    setSubmittingReview(true);
    setReviewMsg('');
    try {
      const res = await apiRequest<{ success: boolean; review: Review }>('/reviews', {
        method: 'POST',
        body: JSON.stringify({
          serviceId: id,
          rating: newRating,
          comment: newComment
        })
      });

      if (res.success && res.review) {
        setReviews([res.review, ...reviews]);
        setNewComment('');
        setReviewMsg('Review posted successfully!');
      }
    } catch (err: any) {
      setReviewMsg(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-slate-500 font-semibold">Loading service details...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Service Not Found</h2>
        <p className="text-xs text-slate-500">The requested service is not currently active or available.</p>
        <Link to="/services" className="inline-block px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold">
          Back to All Services
        </Link>
      </div>
    );
  }

  const providerUser = typeof service.provider?.user === 'object' ? (service.provider.user as any) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-indigo-600">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link to="/services" className="hover:text-indigo-600">Services</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-800 font-medium truncate">{service.title}</span>
      </nav>

      {/* Main Grid: Left Details & Right Booking Sticky Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Section (2 cols) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header Title & Badges */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2.5">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 font-semibold text-xs rounded-full">
                {service.category?.name}
              </span>
              <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full text-xs font-bold text-amber-800">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{service.rating > 0 ? service.rating.toFixed(1) : '5.0'}</span>
                <span className="font-normal text-amber-600">({reviews.length} reviews)</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-500 ml-auto">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{service.location}</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
              {service.title}
            </h1>
          </div>

          {/* Photo Gallery */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-3xl overflow-hidden shadow-xs">
            <div className="sm:col-span-2 h-72 sm:h-96">
              <img
                src={service.images?.[0] || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80'}
                alt={service.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden sm:flex flex-col gap-3 h-96">
              <img
                src={service.images?.[1] || service.images?.[0] || 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=800&q=80'}
                alt="Detail preview 1"
                className="w-full h-1/2 object-cover rounded-tr-2xl"
              />
              <img
                src={service.images?.[2] || 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80'}
                alt="Detail preview 2"
                className="w-full h-1/2 object-cover rounded-br-2xl"
              />
            </div>
          </div>

          {/* Provider Card */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={providerUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                alt={service.provider?.businessName}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-indigo-50"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-slate-900 text-sm">{service.provider?.businessName}</h3>
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{providerUser?.name || 'Verified Pro'} • {service.provider?.experienceYears || 5}+ years in business</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-600">
                  <span className="font-bold text-amber-600">★ {service.provider?.rating?.toFixed(1) || '5.0'}</span>
                  <span>•</span>
                  <span>{service.provider?.serviceAreas?.join(', ') || 'Metropolitan Area'}</span>
                </div>
              </div>
            </div>

            <Link
              to={`/providers/${service.provider?._id}`}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl text-center"
            >
              View Full Profile
            </Link>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-slate-900">Service Description</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {service.description}
            </p>
          </div>

          {/* What is included / Features */}
          {service.features && service.features.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900">What's Included in This Service</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {service.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Customer Reviews & Form */}
          <div className="space-y-6 pt-6 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Verified Customer Reviews</h2>
                <p className="text-xs text-slate-500 mt-0.5">{reviews.length} authentic feedback submissions</p>
              </div>
            </div>

            {/* Leave a review form */}
            <form onSubmit={handleReviewSubmit} className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Leave a Review</h4>
              {reviewMsg && (
                <div className="p-2.5 bg-indigo-50 text-indigo-700 text-xs rounded-xl border border-indigo-100">
                  {reviewMsg}
                </div>
              )}

              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-600">Your Rating:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star className={`w-4 h-4 ${star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                rows={2}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your experience with this service and professional..."
                className="w-full p-3 text-xs border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 outline-hidden"
              />

              <button
                type="submit"
                disabled={submittingReview}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submittingReview ? 'Posting...' : 'Submit Review'}</span>
              </button>
            </form>

            {/* Reviews List */}
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400 bg-white rounded-2xl border border-slate-100">
                  No reviews submitted yet. Be the first to book and review this service!
                </div>
              ) : (
                reviews.map((rev) => (
                  <div key={rev._id} className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={rev.customer?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                          alt={rev.customer?.name}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <span className="text-xs font-bold text-slate-800">{rev.customer?.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                    {rev.providerReply && (
                      <div className="ml-4 p-3 bg-indigo-50/60 border-l-2 border-indigo-500 rounded-r-xl text-xs">
                        <span className="font-bold text-indigo-900 block text-[11px]">Provider Response:</span>
                        <p className="text-slate-600 mt-0.5">{rev.providerReply}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Section: Sticky Booking Summary Widget */}
        <aside className="lg:col-span-1">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-100 sticky top-24 space-y-6">
            <div>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Total Fixed Price</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-slate-900">${service.price}</span>
                <span className="text-xs text-slate-500">all-inclusive</span>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600 border-y border-slate-100 py-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Duration</span>
                </span>
                <span className="font-bold text-slate-800">{service.durationMins} minutes</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Available</span>
                </span>
                <span className="font-bold text-slate-800">Mon - Sat</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Guarantee</span>
                </span>
                <span className="font-bold text-emerald-600">100% Satisfaction</span>
              </div>
            </div>

            <button
              onClick={() => setBookingModalOpen(true)}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Book Appointment Now</span>
            </button>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center text-[11px] text-slate-500 space-y-1">
              <p className="font-medium text-slate-700">Free Cancellation up to 24h before</p>
              <p>Direct live chat and support available after booking.</p>
            </div>
          </div>
        </aside>
      </div>

      {/* Booking Modal */}
      {service && (
        <BookingModal
          service={service}
          isOpen={bookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
        />
      )}
    </div>
  );
};
