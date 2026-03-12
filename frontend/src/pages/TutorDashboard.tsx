import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, Clock, Star, DollarSign, Users, BookOpen, Settings } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function TutorDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'earnings' | 'reviews'>('upcoming');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [bookingsRes, tutorRes, reviewsRes] = await Promise.all([
      fetch('/api/bookings'),
      fetch(`/api/tutors/${user?.id}`),
      fetch('/api/reviews/my-reviews')
    ]);
    const bookingsData = await bookingsRes.json();
    const tutorData = await tutorRes.json();
    const reviewsData = await reviewsRes.json();
    setBookings(bookingsData);
    setProfile(tutorData);
    setReviews(reviewsData);
    setLoading(false);
  };

  const handleStatusUpdate = async (id: number, status: string) => {
    const res = await fetch(`/api/bookings/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (res.ok) fetchData();
  };

  const completedSessions = bookings.filter(b => b.status === 'completed').length;
  const upcomingSessions = bookings.filter(b => b.status === 'confirmed').length;
  const totalEarnings = bookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + parseFloat(b.total_price || 0), 0);
  const averageRating = Number(profile?.rating || 0);

  const upcomingBookings = bookings.filter(b => b.status === 'confirmed');
  const pastBookings = bookings.filter(b => b.status === 'completed' || b.status === 'cancelled');

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
            <p className="text-neutral-500 mt-1">Manage your profile and teaching schedule</p>
          </div>
          <Link to="/profile" className="cursor-pointer hover:opacity-80 transition-opacity">
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-emerald-600"
              />
            ) : (
              <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => setActiveTab('past')}
            className="bg-white p-6 rounded-2xl border border-neutral-200 hover:border-emerald-300 hover:shadow-lg transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{completedSessions}</div>
            <div className="text-xs text-neutral-500 uppercase tracking-wider">Total Sessions</div>
            <div className="text-xs text-neutral-400 mt-1">Completed sessions</div>
          </button>

          <button
            onClick={() => setActiveTab('upcoming')}
            className="bg-white p-6 rounded-2xl border border-neutral-200 hover:border-emerald-300 hover:shadow-lg transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{upcomingSessions}</div>
            <div className="text-xs text-neutral-500 uppercase tracking-wider">Upcoming</div>
            <div className="text-xs text-neutral-400 mt-1">Scheduled sessions</div>
          </button>

          <button
            onClick={() => setActiveTab('earnings')}
            className="bg-white p-6 rounded-2xl border border-neutral-200 hover:border-emerald-300 hover:shadow-lg transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">${totalEarnings.toFixed(0)}</div>
            <div className="text-xs text-neutral-500 uppercase tracking-wider">Total Earnings</div>
            <div className="text-xs text-neutral-400 mt-1">From completed sessions</div>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className="bg-white p-6 rounded-2xl border border-neutral-200 hover:border-emerald-300 hover:shadow-lg transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{averageRating.toFixed(1)}</div>
            <div className="text-xs text-neutral-500 uppercase tracking-wider">Rating</div>
            <div className="text-xs text-neutral-400 mt-1">{profile?.review_count || 0} reviews</div>
          </button>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* My Sessions */}
          <div className="md:col-span-2 bg-white rounded-3xl border border-neutral-200 overflow-hidden">
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">My Sessions</h2>
                <p className="text-sm text-neutral-500">Manage your teaching schedule</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-neutral-100 overflow-x-auto">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'upcoming'
                    ? 'text-emerald-600 border-b-2 border-emerald-600'
                    : 'text-neutral-400'
                }`}
              >
                Upcoming ({upcomingBookings.length})
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'past'
                    ? 'text-emerald-600 border-b-2 border-emerald-600'
                    : 'text-neutral-400'
                }`}
              >
                Completed ({pastBookings.length})
              </button>
              <button
                onClick={() => setActiveTab('earnings')}
                className={`px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'earnings'
                    ? 'text-emerald-600 border-b-2 border-emerald-600'
                    : 'text-neutral-400'
                }`}
              >
                Earnings
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'reviews'
                    ? 'text-emerald-600 border-b-2 border-emerald-600'
                    : 'text-neutral-400'
                }`}
              >
                Reviews ({reviews.length})
              </button>
            </div>

            {/* Sessions List */}
            <div className="p-6">
              {loading ? (
                <div className="text-center py-12 text-neutral-400">Loading...</div>
              ) : activeTab === 'upcoming' ? (
                upcomingBookings.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingBookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl overflow-hidden">
                            {booking.student_avatar ? (
                              <img 
                                src={booking.student_avatar} 
                                alt={booking.student_name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-blue-600 text-white flex items-center justify-center font-bold">
                                {booking.student_name?.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-bold">{booking.student_name}</div>
                            <div className="text-xs text-neutral-500">
                              {new Date(booking.start_time).toLocaleDateString()} • {new Date(booking.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleStatusUpdate(booking.id, 'completed')}
                            className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors"
                          >
                            Complete
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                            className="text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl transition-colors text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-neutral-400">
                    No upcoming sessions
                  </div>
                )
              ) : (
                pastBookings.length > 0 ? (
                  <div className="space-y-4">
                    {pastBookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl overflow-hidden">
                            {booking.student_avatar ? (
                              <img 
                                src={booking.student_avatar} 
                                alt={booking.student_name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-blue-600 text-white flex items-center justify-center font-bold">
                                {booking.student_name?.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-bold">{booking.student_name}</div>
                            <div className="text-xs text-neutral-500">
                              {new Date(booking.start_time).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                          booking.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-neutral-400">No past sessions</div>
                )
              )}

              {activeTab === 'earnings' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-emerald-50 p-4 rounded-2xl text-center">
                      <div className="text-2xl font-bold text-emerald-600">${totalEarnings.toFixed(2)}</div>
                      <div className="text-xs text-neutral-500 mt-1">Total Earnings</div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-2xl text-center">
                      <div className="text-2xl font-bold text-blue-600">{completedSessions}</div>
                      <div className="text-xs text-neutral-500 mt-1">Sessions</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-2xl text-center">
                      <div className="text-2xl font-bold text-purple-600">${profile?.hourly_rate}</div>
                      <div className="text-xs text-neutral-500 mt-1">Per Hour</div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold mb-4">Earnings Breakdown</h3>
                    {bookings.filter(b => b.status === 'completed').length > 0 ? (
                      <div className="space-y-2">
                        {bookings.filter(b => b.status === 'completed').map((booking) => (
                          <div key={booking.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                            <div>
                              <div className="font-medium">{booking.student_name}</div>
                              <div className="text-xs text-neutral-400">
                                {new Date(booking.start_time).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="text-emerald-600 font-bold">
                              +${parseFloat(booking.total_price || 0).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-neutral-400">No earnings yet</div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  <div className="bg-linear-to-r from-yellow-50 to-orange-50 p-6 rounded-2xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-4xl font-bold text-yellow-600">{averageRating.toFixed(1)}</div>
                        <div className="text-sm text-neutral-600 mt-1">Average Rating</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{reviews.length}</div>
                        <div className="text-sm text-neutral-600">Total Reviews</div>
                      </div>
                    </div>
                  </div>

                  {reviews.length > 0 ? (
                    <div className="space-y-4">
                      {reviews.map((review: any) => (
                        <div key={review.id} className="bg-neutral-50 p-4 rounded-2xl space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="font-bold">{review.student_name}</div>
                            <div className="flex items-center gap-1 text-yellow-500">
                              {[...Array(review.rating)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-current" />
                              ))}
                            </div>
                          </div>
                          <p className="text-neutral-600 text-sm">{review.comment}</p>
                          <div className="text-xs text-neutral-400">
                            {new Date(review.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-neutral-400">No reviews yet</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-3xl border border-neutral-200 p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden">
                  {user?.avatar_url ? (
                    <img 
                      src={user.avatar_url} 
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-purple-600 text-white flex items-center justify-center font-bold text-2xl">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{user?.name}</h3>
                  <div className="flex items-center gap-1 text-yellow-500 font-bold">
                    <Star className="w-4 h-4 fill-current" />
                    {averageRating.toFixed(1)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-neutral-50 p-4 rounded-2xl text-center">
                  <div className="text-2xl font-bold text-emerald-600">${profile?.hourly_rate}</div>
                  <div className="text-[10px] uppercase font-bold text-neutral-400">Hourly Rate</div>
                </div>
                <div className="bg-neutral-50 p-4 rounded-2xl text-center">
                  <div className="text-2xl font-bold text-blue-600">{profile?.review_count || 0}</div>
                  <div className="text-[10px] uppercase font-bold text-neutral-400">Reviews</div>
                </div>
              </div>

              <Link
                to="/profile"
                className="block w-full bg-emerald-600 text-white text-center py-3 rounded-xl font-medium hover:bg-emerald-700 transition-colors"
              >
                <Settings className="w-4 h-4 inline mr-2" />
                Edit Profile
              </Link>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-3xl border border-neutral-200 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Recent Reviews
                </h3>
              </div>

              {reviews.length > 0 ? (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {reviews.slice(0, 3).map((review: any) => (
                    <div key={review.id} className="bg-neutral-50 p-3 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-sm">{review.student_name}</div>
                        <div className="flex items-center gap-1 text-yellow-500">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-neutral-600 text-xs">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-neutral-400 text-sm">
                  No reviews yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
