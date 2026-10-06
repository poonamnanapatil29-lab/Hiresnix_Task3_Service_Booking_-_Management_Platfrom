import Category from '../models/Category.js';

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ isPopular: -1, name: 1 });
    res.json({ success: true, count: categories.length, categories });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name, slug, description, icon, image, isPopular } = req.body;
    const category = await Category.create({
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description,
      icon,
      image,
      isPopular: !!isPopular
    });
    res.status(201).json({ success: true, category });
  } catch (error) {
    next(error);
  }
};
