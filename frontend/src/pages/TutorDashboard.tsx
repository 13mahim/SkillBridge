import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, Clock, CheckCircle, XCircle, Star, LayoutDashboard, Settings, UserCircle, Camera, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function TutorDashboard() {
  const { user, setUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [editData, setEditData] = useState({
    bio: '',
    hourly_rate: 0,
    subjects: '',
    availability: '',
    avatar_url: ''
  });

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
    setPreviewUrl(user?.avatar_url || '');
    setEditData({
      bio: tutorData.bio || '',
      hourly_rate: tutorData.hourly_rate || 0,
      subjects: tutorData.subjects || '',
      availability: tutorData.availability || '',
      avatar_url: user?.avatar_url || ''
    });
    setLoading(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Image size should be less than 2MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 400;
          const MAX_HEIGHT = 400;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          const base64String = canvas.toDataURL('image/jpeg', 0.7);
          setPreviewUrl(base64String);
          setEditData({ ...editData, avatar_url: base64String });
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteAvatar = () => {
    setPreviewUrl('');
    setEditData({ ...editData, avatar_url: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleStatusUpdate = async (id: number, status: string) => {
    const res = await fetch(`/api/bookings/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (res.ok) fetchData();
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Update user avatar first
      if (editData.avatar_url !== user?.avatar_url) {
        const avatarRes = await fetch('/api/admin/profile', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: user?.name,
            email: user?.email,
            avatar_url: editData.avatar_url
          })
        });
        if (avatarRes.ok) {
          const updatedUser = await avatarRes.json();
          setUser(updatedUser);
        } else {
          alert('Failed to update avatar');
          return;
        }
      }

      // Update tutor profile
      const res = await fetch('/api/tutors/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bio: editData.bio,
          hourly_rate: editData.hourly_rate,
          subjects: editData.subjects,
          availability: editData.availability
        })
      });
      
      if (res.ok) {
        setIsEditing(false);
        fetchData();
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  if (loading) return <div className="flex items-center justify-center h-96">Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Tutor Dashboard</h1>
            <p className="text-neutral-500">Manage your profile and teaching schedule</p>
          </div>
        </div>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 bg-white border border-neutral-200 px-6 py-3 rounded-2xl font-bold hover:bg-neutral-50 transition-all shadow-sm"
        >
          <Settings className="w-5 h-5" />
          {isEditing ? 'View Dashboard' : 'Edit Profile'}
        </button>
      </div>

      {isEditing ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-[2.5rem] border border-neutral-200 shadow-sm max-w-2xl mx-auto"
        >
          <h2 className="text-2xl font-bold mb-8">Update Your Profile</h2>
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center gap-4 pb-6 border-b border-neutral-100">
              <div className="relative">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-emerald-100"
                  />
                ) : (
                  <div className="w-24 h-24 bg-emerald-600 text-white rounded-full flex items-center justify-center text-3xl font-bold border-4 border-emerald-100">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center hover:bg-emerald-700 transition-colors shadow-lg"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Upload Photo
                </button>
                {previewUrl && (
                  <>
                    <span className="text-neutral-300">|</span>
                    <button
                      type="button"
                      onClick={handleDeleteAvatar}
                      className="text-sm text-red-500 hover:text-red-600 font-medium flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      Remove
                    </button>
                  </>
                )}
              </div>
              <p className="text-xs text-neutral-400">JPG, PNG or GIF. Max size 2MB</p>
            </div>

            {/* Bio Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Bio / Description</label>
              <textarea 
                className="w-full p-4 rounded-2xl border border-neutral-200 focus:ring-2 focus:ring-emerald-500 outline-none h-40 resize-none"
                value={editData.bio}
                onChange={(e) => setEditData({...editData, bio: e.target.value})}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Hourly Rate ($)</label>
                <input 
                  type="number"
                  className="w-full p-4 rounded-2xl border border-neutral-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={editData.hourly_rate}
                  onChange={(e) => setEditData({...editData, hourly_rate: parseFloat(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Subjects (comma separated)</label>
                <input 
                  type="text"
                  className="w-full p-4 rounded-2xl border border-neutral-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="Math, Physics, Chemistry"
                  value={editData.subjects}
                  onChange={(e) => setEditData({...editData, subjects: e.target.value})}
                />
              </div>
            </div>
            <button 
              type="submit"
              className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
            >
              Save Changes
            </button>
          </form>
        </motion.div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              Upcoming Sessions
            </h2>
            
            {bookings.length > 0 ? (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <motion.div 
                    key={booking.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white p-6 rounded-3xl border border-neutral-200 flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0">
                        {booking.student_avatar ? (
                          <img 
                            src={booking.student_avatar} 
                            alt={booking.student_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold">
                            {booking.student_name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="font-bold text-lg">{booking.student_name}</div>
                        <div className="flex items-center gap-4 text-sm text-neutral-500">
                          <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(booking.start_time).toLocaleDateString()}</span>
                          <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {new Date(booking.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        booking.status === 'confirmed' ? 'bg-blue-50 text-blue-600' :
                        booking.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                        'bg-red-50 text-red-600'
                      }`}>
                        {booking.status}
                      </span>

                      {booking.status === 'confirmed' && (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleStatusUpdate(booking.id, 'completed')}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
                            title="Mark as Completed"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                            title="Cancel Session"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-neutral-200 text-neutral-400">
                No sessions booked yet.
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white p-8 rounded-4xl border border-neutral-200 space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden">
                  {user?.avatar_url ? (
                    <img 
                      src={user.avatar_url} 
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-emerald-600 text-white flex items-center justify-center text-2xl font-bold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{user?.name}</h3>
                  <div className="flex items-center gap-1 text-yellow-500 font-bold">
                    <Star className="w-4 h-4 fill-current" />
                    {Number(profile?.rating || 0).toFixed(1)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-neutral-50 p-4 rounded-2xl text-center">
                  <div className="text-2xl font-bold text-emerald-600">${profile?.hourly_rate}</div>
                  <div className="text-[10px] uppercase font-bold text-neutral-400">Hourly Rate</div>
                </div>
                <div className="bg-neutral-50 p-4 rounded-2xl text-center">
                  <div className="text-2xl font-bold text-blue-600">{profile?.review_count}</div>
                  <div className="text-[10px] uppercase font-bold text-neutral-400">Reviews</div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-400">Subjects</h4>
                <div className="flex flex-wrap gap-2">
                  {profile?.subjects?.split(',').map((sub: string) => (
                    <span key={sub} className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">
                      {sub.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white p-8 rounded-4xl border border-neutral-200 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Student Reviews ({reviews.length})
                </h3>
                <div className="text-sm text-neutral-500">
                  Average: {Number(profile?.rating || 0).toFixed(1)} ⭐
                </div>
              </div>

              {reviews.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
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
                <div className="text-center py-8 text-neutral-400">
                  No reviews yet
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
