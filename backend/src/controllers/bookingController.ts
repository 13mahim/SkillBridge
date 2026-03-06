import { Response } from 'express';
import db from '../config/database.ts';
import { AuthRequest } from '../middlewares/auth.ts';

export const createBooking = (req: AuthRequest, res: Response) => {
  const { tutorId, startTime, endTime } = req.body;
  
  try {
    const result = db.prepare('INSERT INTO bookings (student_id, tutor_id, start_time, end_time) VALUES (?, ?, ?, ?)').run(
      req.user!.id, tutorId, startTime, endTime
    );
    res.json({ id: result.lastInsertRowid });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getBookings = (req: AuthRequest, res: Response) => {
  let query = '';
  
  if (req.user!.role === 'student') {
    query = `
      SELECT b.*, u.name as tutor_name, u.avatar_url as tutor_avatar
      FROM bookings b
      JOIN users u ON b.tutor_id = u.id
      WHERE b.student_id = ?
      ORDER BY b.start_time DESC
    `;
  } else if (req.user!.role === 'tutor') {
    query = `
      SELECT b.*, u.name as student_name, u.avatar_url as student_avatar
      FROM bookings b
      JOIN users u ON b.student_id = u.id
      WHERE b.tutor_id = ?
      ORDER BY b.start_time DESC
    `;
  } else {
    query = `
      SELECT b.*, s.name as student_name, s.avatar_url as student_avatar, t.name as tutor_name, t.avatar_url as tutor_avatar
      FROM bookings b
      JOIN users s ON b.student_id = s.id
      JOIN users t ON b.tutor_id = t.id
      ORDER BY b.start_time DESC
    `;
  }
  
  const bookings = db.prepare(query).all(req.user!.role === 'admin' ? [] : [req.user!.id]);
  res.json(bookings);
};

export const updateBookingStatus = (req: AuthRequest, res: Response) => {
  const { status } = req.body;
  const booking: any = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
  
  if (!booking) return res.status(404).json({ error: 'Booking not found' });
  
  // Authorization check
  if (req.user!.role !== 'admin' && booking.student_id !== req.user!.id && booking.tutor_id !== req.user!.id) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  db.prepare('UPDATE bookings SET status = ? WHERE id = ?').run(status, req.params.id);
  res.json({ success: true });
};
