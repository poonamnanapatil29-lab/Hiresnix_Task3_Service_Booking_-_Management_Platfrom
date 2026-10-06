import Review from '../models/Review.js';
import Service from '../models/Service.js';
import Provider from '../models/Provider.js';

export const getServiceReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ service: req.params.serviceId })
      .populate('customer', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    next(error);
  }
};

export const createReview = async (req, res, next) => {
  try {
    const { serviceId, rating, comment } = req.body;
    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });

    const review = await Review.create({
      service: service._id,
      provider: service.provider,
      customer: req.user.id,
      rating: Number(rating),
      comment
    });

    // Update service & provider rating
    const serviceReviews = await Review.find({ service: service._id });
    const avgServiceRating = serviceReviews.reduce((sum, r) => sum + r.rating, 0) / serviceReviews.length;
    service.rating = Number(avgServiceRating.toFixed(1));
    service.reviewCount = serviceReviews.length;
    await service.save();

    const providerReviews = await Review.find({ provider: service.provider });
    const avgProviderRating = providerReviews.reduce((sum, r) => sum + r.rating, 0) / providerReviews.length;
    await Provider.findByIdAndUpdate(service.provider, {
      rating: Number(avgProviderRating.toFixed(1)),
      reviewCount: providerReviews.length
    });

    const populated = await Review.findById(review._id).populate('customer', 'name avatar');
    res.status(201).json({ success: true, review: populated });
  } catch (error) {
    next(error);
  }
};

export const replyToReview = async (req, res, next) => {
  try {
    const { reply } = req.body;
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

    review.providerReply = reply;
    await review.save();

    res.json({ success: true, review });
  } catch (error) {
    next(error);
  }
};
