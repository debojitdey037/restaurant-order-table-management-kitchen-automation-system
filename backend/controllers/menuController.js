
const MenuItem = require('../models/MenuItem');

const getMenuItems = async (req, res) => {
  try {
    const { category, search, veg } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (veg === 'true') {
      query.isVeg = true;
    }

    const items = await MenuItem.find(query).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to fetch menu items' });
  }
};

const getMenuItemById = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.json(item);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to fetch menu item' });
  }
};

const createMenuItem = async (req, res) => {
  try {
    const { name, category, price, isVeg, isAvailable, imageUrl } = req.body;

    if (!name || !category || price === undefined) {
      return res.status(400).json({ message: 'Please enter name, category and price' });
    }

    const newItem = await MenuItem.create({
      name,
      category,
      price: Number(price),
      isVeg: isVeg !== undefined ? isVeg : true,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'
    });

    res.status(201).json(newItem);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to create menu item' });
  }
};

const updateMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    item.name = req.body.name || item.name;
    item.category = req.body.category || item.category;

    if (req.body.price !== undefined) {
      item.price = Number(req.body.price);
    }

    if (req.body.isVeg !== undefined) {
      item.isVeg = req.body.isVeg;
    }

    if (req.body.isAvailable !== undefined) {
      item.isAvailable = req.body.isAvailable;
    }

    if (req.body.imageUrl) {
      item.imageUrl = req.body.imageUrl;
    }

    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to update menu item' });
  }
};

const deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to delete menu item' });
  }
};

module.exports = {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
};
