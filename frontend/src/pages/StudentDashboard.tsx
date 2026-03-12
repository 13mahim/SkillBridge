import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, Clock, Star, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewingBooking, setReviewingBooking] = useState<any>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'completed' | 'upcoming' | 'hours' | 'subjects'>('overview');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const res = await fetch('/api/bookings');
    const data = await res.json();
    setBookings(data);
    setLoading(false);
  };

  const handleCancel = async (id: number) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    const res = await fetch(`/api/bookings/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'cancelled' })
    });
    if (res.ok) fetchBookings();
  };

  const handleReview = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookingId: reviewingBooking.id,
        tutorId: reviewingBooking.tutor_id,
        rating,
        comment
      })
    });
    if (res.ok) {
      setReviewingBooking(null);
      setRating(5);
      setComment('');
      fetchBookings();
    }
  };

  const completedSessions = bookings.filter(b => b.status === 'completed').length;
  const upcomingSessions = bookings.filter(b => b.status === 'confirmed').length;
  const totalHours = completedSessions * 1; // Assuming 1 hour per session
  const uniqueSubjects = new Set(bookings.map(b => b.tutor_name)).size;

  const upcomingBookings = bookings.filter(b => b.status === 'confirmed');
  const pastBookings = bookings.filter(b => b.status === 'completed' || b.status === 'cancelled');

  return (
    <div>
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
          <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
            <p className="text-neutral-500 mt-1">Track your learning progress and manage your sessions</p>
          </div>
          <Link to="/profile" className="cursor-pointer hover:opacity-80 transition-opacity">
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-emerald-600"
              />
            ) : (
              <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => setActiveTab('completed')}
            className="bg-white p-6 rounded-2xl border border-neutral-200 hover:border-emerald-600 hover:shadow-lg transition-all cursor-pointer text-left"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{completedSessions}</div>
            <div className="text-xs text-neutral-500 uppercase tracking-wider">Total Sessions</div>
            <div className="text-xs text-neutral-400 mt-1">Completed sessions</div>
          </button>

          <button 
            onClick={() => setActiveTab('upcoming')}
            className="bg-white p-6 rounded-2xl border border-neutral-200 hover:border-emerald-600 hover:shadow-lg transition-all cursor-pointer text-left"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{upcomingSessions}</div>
            <div className="text-xs text-neutral-500 uppercase tracking-wider">Upcoming</div>
            <div className="text-xs text-neutral-400 mt-1">Scheduled sessions</div>
          </button>

          <button 
            onClick={() => setActiveTab('hours')}
            className="bg-white p-6 rounded-2xl border border-neutral-200 hover:border-emerald-600 hover:shadow-lg transition-all cursor-pointer text-left"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{totalHours}</div>
            <div className="text-xs text-neutral-500 uppercase tracking-wider">Hours Learned</div>
            <div className="text-xs text-neutral-400 mt-1">Total learning hours</div>
          </button>

          <button 
            onClick={() => setActiveTab('subjects')}
            className="bg-white p-6 rounded-2xl border border-neutral-200 hover:border-emerald-600 hover:shadow-lg transition-all cursor-pointer text-left"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{uniqueSubjects}</div>
            <div className="text-xs text-neutral-500 uppercase tracking-wider">Subjects</div>
            <div className="text-xs text-neutral-400 mt-1">Different subjects</div>
          </button>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* My Bookings */}
          <div className="md:col-span-2 bg-white rounded-3xl border border-neutral-200 overflow-hidden">
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">My Learning Journey</h2>
                <p className="text-sm text-neutral-500">Track your progress and manage sessions</p>
              </div>
              <Link to="/tutors" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                Find Tutors →
              </Link>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-neutral-100 overflow-x-auto">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'overview'
                    ? 'text-emerald-600 border-b-2 border-emerald-600'
                    : 'text-neutral-400'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'completed'
                    ? 'text-emerald-600 border-b-2 border-emerald-600'
                    : 'text-neutral-400'
                }`}
              >
                Completed ({completedSessions})
              </button>
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'upcoming'
                    ? 'text-emerald-600 border-b-2 border-emerald-600'
                    : 'text-neutral-400'
                }`}
              >
                Upcoming ({upcomingSessions})
              </button>
              <button
                onClick={() => setActiveTab('hours')}
                className={`px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'hours'
                    ? 'text-emerald-600 border-b-2 border-emerald-600'
                    : 'text-neutral-400'
                }`}
              >
                Hours
              </button>
              <button
                onClick={() => setActiveTab('subjects')}
                className={`px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'subjects'
                    ? 'text-emerald-600 border-b-2 border-emerald-600'
                    : 'text-neutral-400'
                }`}
              >
                Subjects
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {loading ? (
                <div className="text-center py-12 text-neutral-400">Loading...</div>
              ) : activeTab === 'overview' ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold mb-4">Upcoming Sessions</h3>
                    {upcomingBookings.length > 0 ? (
                      <div className="space-y-4">
                        {upcomingBookings.slice(0, 3).map((booking) => (
                          <div key={booking.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl overflow-hidden">
                                {booking.tutor_avatar ? (
                                  <img 
                                    src={booking.tutor_avatar} 
                                    alt={booking.tutor_name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                                    {booking.tutor_name?.charAt(0).toUpperCase()}
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="font-bold">{booking.tutor_name}</div>
                                <div className="text-xs text-neutral-500">
                                  {new Date(booking.start_time).toLocaleDateString()} • {new Date(booking.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                              </div>
                            </div>
                            <button 
                              onClick={() => handleCancel(booking.id)}
                              className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-neutral-400">No upcoming sessions</div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold mb-4">Recent Completed</h3>
                    {bookings.filter(b => b.status === 'completed').length > 0 ? (
                      <div className="space-y-4">
                        {bookings.filter(b => b.status === 'completed').slice(0, 3).map((booking) => (
                          <div key={booking.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl overflow-hidden">
                                {booking.tutor_avatar ? (
                                  <img 
                                    src={booking.tutor_avatar} 
                                    alt={booking.tutor_name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                                    {booking.tutor_name?.charAt(0).toUpperCase()}
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="font-bold">{booking.tutor_name}</div>
                                <div className="text-xs text-neutral-500">
                                  {new Date(booking.start_time).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                            {!booking.reviewed && (
                              <button 
                                onClick={() => setReviewingBooking(booking)}
                                className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors"
                              >
                                Review
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-neutral-400">No completed sessions yet</div>
                    )}
                  </div>
                </div>
              ) : activeTab === 'completed' ? (
                bookings.filter(b => b.status === 'completed').length > 0 ? (
                  <div className="space-y-4">
                    {bookings.filter(b => b.status === 'completed').map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl overflow-hidden">
                            {booking.tutor_avatar ? (
                              <img 
                                src={booking.tutor_avatar} 
                                alt={booking.tutor_name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                                {booking.tutor_name?.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-bold">{booking.tutor_name}</div>
                            <div className="text-xs text-neutral-500">
                              {new Date(booking.start_time).toLocaleDateString()} • {new Date(booking.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                        {!booking.reviewed && (
                          <button 
                            onClick={() => setReviewingBooking(booking)}
                            className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors"
                          >
                            Review
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-neutral-400 mb-4">No completed sessions yet</div>
                    <Link 
                      to="/tutors"
                      className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-emerald-700 transition-colors"
                    >
                      Find a Tutor
                    </Link>
                  </div>
                )
              ) : activeTab === 'upcoming' ? (
                upcomingBookings.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingBookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl overflow-hidden">
                            {booking.tutor_avatar ? (
                              <img 
                                src={booking.tutor_avatar} 
                                alt={booking.tutor_name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                                {booking.tutor_name?.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-bold">{booking.tutor_name}</div>
                            <div className="text-xs text-neutral-500">
                              {new Date(booking.start_time).toLocaleDateString()} • {new Date(booking.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleCancel(booking.id)}
                          className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-neutral-400 mb-4">No upcoming sessions</div>
                    <Link 
                      to="/tutors"
                      className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-emerald-700 transition-colors"
                    >
                      Find a Tutor
                    </Link>
                  </div>
                )
              ) : activeTab === 'hours' ? (
                <div className="space-y-6">
                  <div className="text-center py-8">
                    <div className="text-6xl font-bold text-emerald-600 mb-2">{totalHours}</div>
                    <div className="text-neutral-500">Total Hours Learned</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-emerald-50 p-6 rounded-2xl text-center">
                      <div className="text-3xl font-bold text-emerald-600 mb-1">{completedSessions}</div>
                      <div className="text-sm text-neutral-600">Sessions Completed</div>
                    </div>
                    <div className="bg-emerald-50 p-6 rounded-2xl text-center">
                      <div className="text-3xl font-bold text-emerald-600 mb-1">{completedSessions > 0 ? (totalHours / completedSessions).toFixed(1) : 0}</div>
                      <div className="text-sm text-neutral-600">Avg Hours/Session</div>
                    </div>
                  </div>
                  {bookings.filter(b => b.status === 'completed').length > 0 && (
                    <div>
                      <h3 className="font-bold mb-4">Learning History</h3>
                      <div className="space-y-3">
                        {bookings.filter(b => b.status === 'completed').map((booking) => (
                          <div key={booking.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl">
                            <div className="flex items-center gap-3">
                              <Clock className="w-5 h-5 text-emerald-600" />
                              <div>
                                <div className="font-medium">{booking.tutor_name}</div>
                                <div className="text-xs text-neutral-500">
                                  {new Date(booking.start_time).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                            <div className="text-sm font-medium text-emerald-600">1 hour</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : activeTab === 'subjects' ? (
                <div className="space-y-6">
                  <div className="text-center py-8">
                    <div className="text-6xl font-bold text-emerald-600 mb-2">{uniqueSubjects}</div>
                    <div className="text-neutral-500">Different Tutors</div>
                  </div>
                  {bookings.length > 0 && (
                    <div>
                      <h3 className="font-bold mb-4">Your Tutors</h3>
                      <div className="grid grid-cols-1 gap-4">
                        {Array.from(new Set(bookings.map(b => b.tutor_id))).map((tutorId) => {
                          const tutorBookings = bookings.filter(b => b.tutor_id === tutorId);
                          const firstBooking = tutorBookings[0];
                          const completedCount = tutorBookings.filter(b => b.status === 'completed').length;
                          
                          return (
                            <div key={tutorId} className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl overflow-hidden">
                                  {firstBooking.tutor_avatar ? (
                                    <img 
                                      src={firstBooking.tutor_avatar} 
                                      alt={firstBooking.tutor_name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                                      {firstBooking.tutor_name?.charAt(0).toUpperCase()}
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <div className="font-bold">{firstBooking.tutor_name}</div>
                                  <div className="text-xs text-neutral-500">
                                    {completedCount} session{completedCount !== 1 ? 's' : ''} completed
                                  </div>
                                </div>
                              </div>
                              <Link 
                                to={`/tutors/${tutorId}`}
                                className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                              >
                                View Profile →
                              </Link>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-neutral-200 p-6">
              <h3 className="font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link 
                  to="/tutors"
                  className="block w-full bg-emerald-600 text-white text-center py-3 rounded-xl font-medium hover:bg-emerald-700 transition-colors"
                >
                  Find a Tutor
                </Link>
                <button 
                  onClick={() => {
                    // Scroll to bookings section
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="block w-full border border-neutral-200 text-center py-3 rounded-xl font-medium hover:bg-neutral-50 transition-colors"
                >
                  View All Bookings
                </button>
                <Link
                  to="/profile"
                  className="block w-full border border-neutral-200 text-center py-3 rounded-xl font-medium hover:bg-neutral-50 transition-colors"
                >
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {reviewingBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full space-y-6 shadow-2xl"
          >
            <h3 className="text-2xl font-bold">Review your session</h3>
            <p className="text-neutral-500">How was your session with {reviewingBooking.tutor_name}?</p>
            
            <form onSubmit={handleReview} className="space-y-6">
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map(i => (
                  <button 
                    key={i}
                    type="button"
                    onClick={() => setRating(i)}
                    className={`p-2 transition-colors ${i <= rating ? 'text-yellow-500' : 'text-neutral-200'}`}
                  >
                    <Star className={`w-8 h-8 ${i <= rating ? 'fill-current' : ''}`} />
                  </button>
                ))}
              </div>
              <textarea 
                required
                placeholder="Write your feedback here..."
                className="w-full p-4 rounded-2xl border border-neutral-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none h-32 resize-none"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <div className="flex gap-4">
                <button 
                  type="button"
                  onClick={() => setReviewingBooking(null)}
                  className="flex-1 py-4 rounded-2xl font-bold text-neutral-500 hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
