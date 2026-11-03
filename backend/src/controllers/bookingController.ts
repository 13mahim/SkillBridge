import { Response } from 'express';
import db from '../config/database';
import { AuthRequest } from '../middlewares/auth';

export const createBooking = async (req: AuthRequest, res: Response) => {
  const { tutorId, startTime, endTime } = req.body;
  
  try {
    const result = await db.prepare('INSERT INTO bookings (student_id, tutor_id, start_time, end_time) VALUES ($1, $2, $3, $4)').run(
      req.user!.id, tutorId, startTime, endTime
    );
    res.json({ id: result.lastInsertRowid });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getBookings = async (req: AuthRequest, res: Response) => {
  let query = '';
  let params: any[] = [];
  
  if (req.user!.role === 'student') {
    query = `
      SELECT b.*, u.name as tutor_name, u.avatar_url as tutor_avatar
      FROM bookings b
      JOIN users u ON b.tutor_id = u.id
      WHERE b.student_id = $1
      ORDER BY b.start_time DESC
    `;
    params = [req.user!.id];
  } else if (req.user!.role === 'tutor') {
    query = `
      SELECT b.*, u.name as student_name, u.avatar_url as student_avatar
      FROM bookings b
      JOIN users u ON b.student_id = u.id
      WHERE b.tutor_id = $1
      ORDER BY b.start_time DESC
    `;
    params = [req.user!.id];
  } else {
    query = `
      SELECT b.*, s.name as student_name, s.avatar_url as student_avatar, t.name as tutor_name, t.avatar_url as tutor_avatar
      FROM bookings b
      JOIN users s ON b.student_id = s.id
      JOIN users t ON b.tutor_id = t.id
      ORDER BY b.start_time DESC
    `;
  }
  
  const bookings = await db.prepare(query).all(...params);
  res.json(bookings);
};

export const updateBookingStatus = async (req: AuthRequest, res: Response) => {
  const { status } = req.body;
  const booking: any = await db.prepare('SELECT * FROM bookings WHERE id = $1').get(req.params.id);
  
  if (!booking) return res.status(404).json({ error: 'Booking not found' });
  
  // Authorization check
  if (req.user!.role !== 'admin' && booking.student_id !== req.user!.id && booking.tutor_id !== req.user!.id) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  await db.prepare('UPDATE bookings SET status = $1 WHERE id = $2').run(status, req.params.id);
  res.json({ success: true });
};
