import Service from '../models/Service.js';
import Provider from '../models/Provider.js';
import Category from '../models/Category.js';

export const getServices = async (req, res, next) => {
  try {
    const { category, search, minPrice, maxPrice, rating, location, sort, isPopular } = req.query;
    let query = { isActive: true };

    if (category) {
      const cat = await Category.findOne({ slug: category.toLowerCase() });
      if (cat) {
        query.category = cat._id;
      }
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    if (isPopular === 'true') {
      query.isPopular = true;
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };
    if (sort === 'popularity') sortOption = { reviewCount: -1 };

    const services = await Service.find(query)
      .populate('category', 'name slug icon image')
      .populate({
        path: 'provider',
        populate: { path: 'user', select: 'name email avatar phone' }
      })
      .sort(sortOption);

    res.json({ success: true, count: services.length, services });
  } catch (error) {
    next(error);
  }
};

export const getServiceById = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('category', 'name slug icon image')
      .populate({
        path: 'provider',
        populate: { path: 'user', select: 'name email avatar phone address' }
      });

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    res.json({ success: true, service });
  } catch (error) {
    next(error);
  }
};

export const createService = async (req, res, next) => {
  try {
    let provider = await Provider.findOne({ user: req.user.id });
    if (!provider) {
      provider = await Provider.create({
        user: req.user.id,
        businessName: `${req.user.name}'s Services`
      });
    }

    const { title, description, category, price, durationMins, features, images, location } = req.body;

    const service = await Service.create({
      title,
      description,
      category,
      provider: provider._id,
      price,
      durationMins: durationMins || 60,
      features: Array.isArray(features) ? features : (features ? features.split(',').map(f => f.trim()) : []),
      images: Array.isArray(images) && images.length ? images : ['https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80'],
      location: location || 'New York, NY'
    });

    const populated = await Service.findById(service._id).populate('category').populate('provider');
    res.status(201).json({ success: true, service: populated });
  } catch (error) {
    next(error);
  }
};

export const updateService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });

    if (req.user.role !== 'admin') {
      const provider = await Provider.findOne({ user: req.user.id });
      if (!provider || service.provider.toString() !== provider._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to update this service' });
      }
    }

    const updated = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('category')
      .populate('provider');

    res.json({ success: true, service: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });

    if (req.user.role !== 'admin') {
      const provider = await Provider.findOne({ user: req.user.id });
      if (!provider || service.provider.toString() !== provider._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to delete this service' });
      }
    }

    await Service.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    next(error);
  }
};
