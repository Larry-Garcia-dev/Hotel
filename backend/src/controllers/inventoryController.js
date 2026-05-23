import * as inventoryModel from '../models/inventoryModel.js';

export async function getCategories(req, res) {
  try {
    const categories = await inventoryModel.findAllCategories();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function createCategory(req, res) {
  try {
    const category = await inventoryModel.createCategory(req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}

export async function getItems(req, res) {
  try {
    const filters = {
      category_id: req.query.category_id,
      low_stock: req.query.low_stock === 'true'
    };
    const items = await inventoryModel.findAllItems(filters);
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function getItemById(req, res) {
  try {
    const item = await inventoryModel.findItemById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}

export async function createItem(req, res) {
  try {
    const item = await inventoryModel.createItem(req.body);
    res.status(201).json(item);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function updateItem(req, res) {
  try {
    const item = await inventoryModel.updateItem(req.params.id, req.body);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}

export async function removeItem(req, res) {
  try {
    await inventoryModel.removeItem(req.params.id);
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}

export async function addMovement(req, res) {
  try {
    const item = await inventoryModel.addMovement({
      ...req.body,
      item_id: req.params.id,
      user_id: req.user?.id
    });
    res.json(item);
  } catch (error) {
    console.error('Error adding movement:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function getMovements(req, res) {
  try {
    const movements = await inventoryModel.getMovements(req.params.id);
    res.json(movements);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}

export default {
  getCategories, createCategory,
  getItems, getItemById, createItem, updateItem, removeItem,
  addMovement, getMovements
};
