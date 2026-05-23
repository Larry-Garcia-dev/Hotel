import * as roomModel from '../models/roomModel.js';

export async function getAll(req, res) {
  try {
    const filters = {
      status: req.query.status,
      room_type_id: req.query.room_type_id
    };
    const rooms = await roomModel.findAll(filters);
    res.json(rooms);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function getById(req, res) {
  try {
    const room = await roomModel.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}

export async function create(req, res) {
  try {
    const room = await roomModel.create(req.body);
    res.status(201).json(room);
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function update(req, res) {
  try {
    const room = await roomModel.update(req.params.id, req.body);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}

export async function remove(req, res) {
  try {
    await roomModel.remove(req.params.id);
    res.json({ message: 'Room deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}

export async function checkAvailability(req, res) {
  try {
    const { check_in, check_out, room_type_id } = req.query;
    if (!check_in || !check_out) {
      return res.status(400).json({ error: 'Check-in and check-out dates required' });
    }
    const rooms = await roomModel.checkAvailability(check_in, check_out, room_type_id);
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}

export async function getAvailable(req, res) {
  try {
    const { check_in, check_out, room_type } = req.query;
    if (!check_in || !check_out) {
      return res.status(400).json({ error: 'Check-in and check-out dates required' });
    }
    const rooms = await roomModel.findAvailable(check_in, check_out, room_type);
    res.json(rooms);
  } catch (error) {
    console.error('Error finding available rooms:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

export default { getAll, getById, create, update, remove, checkAvailability, getAvailable };
