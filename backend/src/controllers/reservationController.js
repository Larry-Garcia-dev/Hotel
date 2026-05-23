import * as reservationModel from '../models/reservationModel.js';
import * as guestModel from '../models/guestModel.js';

export async function getAll(req, res) {
  try {
    const filters = {
      status: req.query.status,
      from_date: req.query.from_date,
      to_date: req.query.to_date
    };
    const reservations = await reservationModel.findAll(filters);
    res.json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function getById(req, res) {
  try {
    const reservation = await reservationModel.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}

export async function create(req, res) {
  try {
    const { guest, ...reservationData } = req.body;
    
    let guestId = reservationData.guest_id;
    if (guest && !guestId) {
      const existingGuest = await guestModel.findByEmail(guest.email);
      if (existingGuest) {
        guestId = existingGuest.id;
      } else {
        const newGuest = await guestModel.create(guest);
        guestId = newGuest.id;
      }
    }
    
    const reservation = await reservationModel.create({
      ...reservationData,
      guest_id: guestId
    });
    res.status(201).json(reservation);
  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function update(req, res) {
  try {
    const reservation = await reservationModel.update(req.params.id, req.body);
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}

export async function updateStatus(req, res) {
  try {
    const { status } = req.body;
    const reservation = await reservationModel.updateStatus(req.params.id, status);
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}

export async function remove(req, res) {
  try {
    await reservationModel.remove(req.params.id);
    res.json({ message: 'Reservation deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}

export default { getAll, getById, create, update, updateStatus, remove };
