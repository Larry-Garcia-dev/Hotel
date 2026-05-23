import * as guestModel from '../models/guestModel.js';

export async function getAll(req, res) {
  try {
    const guests = await guestModel.findAll();
    res.json(guests);
  } catch (error) {
    console.error('Error fetching guests:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function getById(req, res) {
  try {
    const guest = await guestModel.findById(req.params.id);
    if (!guest) {
      return res.status(404).json({ error: 'Guest not found' });
    }
    res.json(guest);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}

export async function create(req, res) {
  try {
    const guest = await guestModel.create(req.body);
    res.status(201).json(guest);
  } catch (error) {
    console.error('Error creating guest:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function update(req, res) {
  try {
    const guest = await guestModel.update(req.params.id, req.body);
    if (!guest) {
      return res.status(404).json({ error: 'Guest not found' });
    }
    res.json(guest);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}

export async function remove(req, res) {
  try {
    await guestModel.remove(req.params.id);
    res.json({ message: 'Guest deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}

export default { getAll, getById, create, update, remove };
