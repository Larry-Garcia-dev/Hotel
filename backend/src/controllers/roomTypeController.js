import * as roomTypeModel from '../models/roomTypeModel.js';

export async function getAll(req, res) {
  try {
    const roomTypes = await roomTypeModel.findAll();
    res.json(roomTypes);
  } catch (error) {
    console.error('Error fetching room types:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function getById(req, res) {
  try {
    const roomType = await roomTypeModel.findById(req.params.id);
    if (!roomType) {
      return res.status(404).json({ error: 'Room type not found' });
    }
    res.json(roomType);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}

export async function create(req, res) {
  try {
    const roomType = await roomTypeModel.create(req.body);
    res.status(201).json(roomType);
  } catch (error) {
    console.error('Error creating room type:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function update(req, res) {
  try {
    const roomType = await roomTypeModel.update(req.params.id, req.body);
    if (!roomType) {
      return res.status(404).json({ error: 'Room type not found' });
    }
    res.json(roomType);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}

export async function remove(req, res) {
  try {
    await roomTypeModel.remove(req.params.id);
    res.json({ message: 'Room type deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}

export default { getAll, getById, create, update, remove };
