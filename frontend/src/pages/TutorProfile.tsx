import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Star, MapPin, DollarSign, Calendar, Clock, Award, BookOpen, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

export default function TutorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tutor, setTutor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: ''
  });

  useEffect(() => {
    fetch(`/api/tutors/${id}`)
      .then(res => res.json())
      .then(data => {
        setTutor(data);
        setLoading(false);
      });
  }, [id]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    const startTime = new Date(`${bookingData.date}T${bookingData.time}`);
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour session

    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tutorId: id,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString()
      })
    });

    if (res.ok) {
      alert('Booking successful!');
      setShowBooking(false);
      navigate('/dashboard');
    } else {
      alert('Booking failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="h-96 bg-neutral-100 rounded-[3rem] animate-pulse" />
        <div className="h-64 bg-neutral-100 rounded-[3rem] animate-pulse" />
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="text-center py-24">
        <h2 className="text-2xl font-bold text-neutral-600">Tutor not found</h2>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <button 
        onClick={() => navigate('/tutors')}
        className="flex items-center gap-2 text-neutral-500 hover:text-neutral-700 font-medium transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to tutors
      </button>

      <div className="bg-white rounded-[3rem] border border-neutral-200 overflow-hidden shadow-lg">
        <div className="h-64 bg-gradient-to-br from-emerald-400 to-emerald-600 relative">
          {tutor.avatar_url ? (
            <img 
              src={tutor.avatar_url} 
              alt={tutor.name}
              className="w-full h-full object-cover mix-blend-overlay opacity-50"
            />
          ) : (
            <div className="w-full h-full" />
          )}
          <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/60 to-transparent">
            <div className="flex items-end justify-between">
              <div className="flex items-center gap-6">
                <div className="w-32 h-32 rounded-3xl bg-white overflow-hidden border-4 border-white shadow-xl">
                  {tutor.avatar_url ? (
                    <img 
                      src={tutor.avatar_url} 
                      alt={tutor.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-emerald-600 text-white flex items-center justify-center text-5xl font-bold">
                      {tutor.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="text-white">
                  <h1 className="text-4xl font-bold mb-2">{tutor.name}</h1>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 bg-white/20 backdrop-blur px-3 py-1 rounded-full">
                      <Star className="w-5 h-5 fill-current text-yellow-400" />
                      <span className="font-bold">{Number(tutor.rating || 0).toFixed(1)}</span>
                      <span className="text-white/70">({tutor.review_count} reviews)</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur px-6 py-4 rounded-2xl text-white">
                <div className="text-3xl font-bold">${tutor.hourly_rate}</div>
                <div className="text-sm text-white/80">per hour</div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-12 space-y-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-emerald-600" />
                  About Me
                </h2>
                <p className="text-neutral-600 leading-relaxed text-lg">
                  {tutor.bio || "This tutor hasn't added a bio yet."}
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Award className="w-6 h-6 text-emerald-600" />
                  Subjects I Teach
                </h2>
                <div className="flex flex-wrap gap-3">
                  {tutor.subjects?.split(',').map((subject: string) => (
                    <span 
                      key={subject}
                      className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl font-bold text-sm border border-emerald-100"
                    >
                      {subject.trim()}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Star className="w-6 h-6 text-emerald-600" />
                  Student Reviews
                </h2>
                {tutor.reviews && tutor.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {tutor.reviews.map((review: any) => (
                      <motion.div 
                        key={review.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-neutral-50 p-6 rounded-2xl space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-bold">{review.student_name}</div>
                          <div className="flex items-center gap-1 text-yellow-500">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-current" />
                            ))}
                          </div>
                        </div>
                        <p className="text-neutral-600">{review.comment}</p>
                        <div className="text-xs text-neutral-400">
                          {new Date(review.created_at).toLocaleDateString()}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-neutral-50 rounded-2xl text-neutral-400">
                    No reviews yet. Be the first to review!
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-neutral-50 p-8 rounded-[2rem] border border-neutral-100 sticky top-8 space-y-6">
                <h3 className="text-xl font-bold">Book a Session</h3>
                
                {user && user.role === 'student' ? (
                  <button 
                    onClick={() => setShowBooking(true)}
                    className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                  >
                    Book Now
                  </button>
                ) : user && user.role === 'tutor' ? (
                  <div className="text-center text-neutral-500 py-4">
                    You cannot book as a tutor
                  </div>
                ) : (
                  <button 
                    onClick={() => navigate('/login')}
                    className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                  >
                    Login to Book
                  </button>
                )}

                <div className="space-y-4 pt-6 border-t border-neutral-200">
                  <div className="flex items-center gap-3 text-neutral-600">
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                    <div>
                      <div className="text-xs text-neutral-400 uppercase font-bold">Hourly Rate</div>
                      <div className="font-bold">${tutor.hourly_rate}/hour</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-neutral-600">
                    <Star className="w-5 h-5 text-emerald-600" />
                    <div>
                      <div className="text-xs text-neutral-400 uppercase font-bold">Rating</div>
                      <div className="font-bold">{Number(tutor.rating || 0).toFixed(1)} ({tutor.review_count} reviews)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-[2.5rem] p-8 max-w-md w-full space-y-6 shadow-2xl"
          >
            <h3 className="text-2xl font-bold">Book a Session</h3>
            <p className="text-neutral-500">Schedule your learning session with {tutor.name}</p>
            
            <form onSubmit={handleBooking} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Date
                </label>
                <input 
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-4 rounded-2xl border border-neutral-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  value={bookingData.date}
                  onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Time
                </label>
                <input 
                  type="time"
                  required
                  className="w-full p-4 rounded-2xl border border-neutral-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  value={bookingData.time}
                  onChange={(e) => setBookingData({...bookingData, time: e.target.value})}
                />
              </div>
              <div className="bg-emerald-50 p-4 rounded-2xl text-sm text-emerald-700">
                <div className="font-bold mb-1">Session Duration: 1 hour</div>
                <div>Total Cost: ${tutor.hourly_rate}</div>
              </div>
              <div className="flex gap-4">
                <button 
                  type="button"
                  onClick={() => setShowBooking(false)}
                  className="flex-1 py-4 rounded-2xl font-bold text-neutral-500 hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
