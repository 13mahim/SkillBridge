import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Calendar as BookingsIcon, Tag, ShieldAlert, ShieldCheck, Trash2, GraduationCap, UserCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'students' | 'tutors' | 'bookings' | 'categories'>('all');
  const [newCategory, setNewCategory] = useState({ name: '', slug: '' });
  const [showAddCategory, setShowAddCategory] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [usersRes, bookingsRes, catsRes] = await Promise.all([
      fetch('/api/admin/users'),
      fetch('/api/bookings'),
      fetch('/api/categories')
    ]);
    setUsers(await usersRes.json());
    setBookings(await bookingsRes.json());
    setCategories(await catsRes.json());
    setLoading(false);
  };

  const handleUserStatus = async (id: number, status: string) => {
    const res = await fetch(`/api/admin/users/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (res.ok) fetchData();
  };

  const handleDeleteUser = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) return;
    
    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'DELETE'
    });
    
    if (res.ok) {
      alert('User deleted successfully');
      fetchData();
    } else {
      const error = await res.json();
      alert(error.error || 'Failed to delete user');
    }
  };

  const students = users.filter(u => u.role === 'student');
  const tutors = users.filter(u => u.role === 'tutor');

  if (loading) return <div className="flex items-center justify-center h-96">Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
          <LayoutDashboard className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-neutral-500">Platform moderation and analytics</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Students', value: students.length, icon: UserCircle, color: 'text-blue-600', bg: 'bg-blue-50', tab: 'students' as const },
          { label: 'Tutors', value: tutors.length, icon: GraduationCap, color: 'text-purple-600', bg: 'bg-purple-50', tab: 'tutors' as const },
          { label: 'Total Bookings', value: bookings.length, icon: BookingsIcon, color: 'text-emerald-600', bg: 'bg-emerald-50', tab: 'bookings' as const },
          { label: 'Categories', value: categories.length, icon: Tag, color: 'text-orange-600', bg: 'bg-orange-50', tab: 'categories' as const },
        ].map((stat, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(stat.tab)}
            className="bg-white p-6 rounded-3xl border border-neutral-200 space-y-2 hover:border-emerald-300 hover:shadow-lg transition-all text-left group cursor-pointer"
          >
            <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">{stat.label}</div>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-[2.5rem] border border-neutral-200 overflow-hidden shadow-sm">
        <div className="flex border-b border-neutral-100">
          {(['all', 'students', 'tutors', 'bookings', 'categories'] as const).map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-5 font-bold text-sm uppercase tracking-wider transition-all border-b-2 ${
                activeTab === tab ? 'border-emerald-600 text-emerald-600 bg-emerald-50/30' : 'border-transparent text-neutral-400 hover:text-neutral-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-8">
          {activeTab === 'all' && (
            <div className="space-y-8">
              {/* Students Section */}
              <div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <UserCircle className="w-5 h-5 text-blue-600" />
                  Students ({students.length})
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-xs font-bold text-neutral-400 uppercase tracking-wider border-b border-neutral-100">
                        <th className="pb-4">Student</th>
                        <th className="pb-4">Status</th>
                        <th className="pb-4">Joined</th>
                        <th className="pb-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-50">
                      {students.slice(0, 5).map(u => (
                        <tr key={u.id} className="group">
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                                {u.avatar_url ? (
                                  <img 
                                    src={u.avatar_url} 
                                    alt={u.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-blue-600 text-white flex items-center justify-center font-bold">
                                    {u.name?.charAt(0).toUpperCase()}
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="font-bold">{u.name}</div>
                                <div className="text-sm text-neutral-400">{u.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4">
                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                              u.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                            }`}>
                              {u.status}
                            </span>
                          </td>
                          <td className="py-4 text-sm text-neutral-500">
                            {new Date(u.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => handleUserStatus(u.id, u.status === 'active' ? 'banned' : 'active')}
                                className={`p-2 rounded-xl transition-colors ${
                                  u.status === 'active' ? 'text-red-500 hover:bg-red-50' : 'text-emerald-600 hover:bg-emerald-50'
                                }`}
                              >
                                {u.status === 'active' ? <ShieldAlert className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                              </button>
                              <button 
                                onClick={() => handleDeleteUser(u.id, u.name)}
                                className="p-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {students.length > 5 && (
                    <button 
                      onClick={() => setActiveTab('students')}
                      className="mt-4 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      View all {students.length} students →
                    </button>
                  )}
                </div>
              </div>

              {/* Tutors Section */}
              <div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-purple-600" />
                  Tutors ({tutors.length})
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-xs font-bold text-neutral-400 uppercase tracking-wider border-b border-neutral-100">
                        <th className="pb-4">Tutor</th>
                        <th className="pb-4">Status</th>
                        <th className="pb-4">Joined</th>
                        <th className="pb-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-50">
                      {tutors.slice(0, 5).map(u => (
                        <tr key={u.id} className="group">
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                                {u.avatar_url ? (
                                  <img 
                                    src={u.avatar_url} 
                                    alt={u.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-purple-600 text-white flex items-center justify-center font-bold">
                                    {u.name?.charAt(0).toUpperCase()}
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="font-bold">{u.name}</div>
                                <div className="text-sm text-neutral-400">{u.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4">
                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                              u.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                            }`}>
                              {u.status}
                            </span>
                          </td>
                          <td className="py-4 text-sm text-neutral-500">
                            {new Date(u.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => handleUserStatus(u.id, u.status === 'active' ? 'banned' : 'active')}
                                className={`p-2 rounded-xl transition-colors ${
                                  u.status === 'active' ? 'text-red-500 hover:bg-red-50' : 'text-emerald-600 hover:bg-emerald-50'
                                }`}
                              >
                                {u.status === 'active' ? <ShieldAlert className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                              </button>
                              <button 
                                onClick={() => handleDeleteUser(u.id, u.name)}
                                className="p-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {tutors.length > 5 && (
                    <button 
                      onClick={() => setActiveTab('tutors')}
                      className="mt-4 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      View all {tutors.length} tutors →
                    </button>
                  )}
                </div>
              </div>

              {/* Bookings Section */}
              <div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <BookingsIcon className="w-5 h-5 text-emerald-600" />
                  Recent Bookings ({bookings.length})
                </h3>
                <div className="space-y-4">
                  {bookings.slice(0, 5).map(b => (
                    <div key={b.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl">
                      <div>
                        <div className="font-bold">{b.student_name} → {b.tutor_name}</div>
                        <div className="text-xs text-neutral-400">
                          {new Date(b.start_time).toLocaleString()}
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                        b.status === 'confirmed' ? 'bg-blue-50 text-blue-600' :
                        b.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                        'bg-red-50 text-red-600'
                      }`}>
                        {b.status}
                      </span>
                    </div>
                  ))}
                  {bookings.length > 5 && (
                    <button 
                      onClick={() => setActiveTab('bookings')}
                      className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      View all {bookings.length} bookings →
                    </button>
                  )}
                </div>
              </div>

              {/* Categories Section */}
              <div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-orange-600" />
                  Categories ({categories.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map(cat => (
                    <div key={cat.id} className="p-4 bg-neutral-50 rounded-2xl font-bold text-neutral-700 border border-neutral-100">
                      <div className="font-bold">{cat.name}</div>
                      <div className="text-xs text-neutral-400 font-normal">{cat.slug}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'students' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs font-bold text-neutral-400 uppercase tracking-wider border-b border-neutral-100">
                    <th className="pb-4">Student</th>
                    <th className="pb-4">Status</th>
                    <th className="pb-4">Joined</th>
                    <th className="pb-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50">
                  {students.map(u => (
                    <tr key={u.id} className="group">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                            {u.avatar_url ? (
                              <img 
                                src={u.avatar_url} 
                                alt={u.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-blue-600 text-white flex items-center justify-center font-bold">
                                {u.name?.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-bold">{u.name}</div>
                            <div className="text-sm text-neutral-400">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                          u.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                        }`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="py-4 text-sm text-neutral-500">
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleUserStatus(u.id, u.status === 'active' ? 'banned' : 'active')}
                            className={`p-2 rounded-xl transition-colors ${
                              u.status === 'active' ? 'text-red-500 hover:bg-red-50' : 'text-emerald-600 hover:bg-emerald-50'
                            }`}
                            title={u.status === 'active' ? 'Ban User' : 'Activate User'}
                          >
                            {u.status === 'active' ? <ShieldAlert className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(u.id, u.name)}
                            className="p-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'tutors' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs font-bold text-neutral-400 uppercase tracking-wider border-b border-neutral-100">
                    <th className="pb-4">Tutor</th>
                    <th className="pb-4">Status</th>
                    <th className="pb-4">Joined</th>
                    <th className="pb-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50">
                  {tutors.map(u => (
                    <tr key={u.id} className="group">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                            {u.avatar_url ? (
                              <img 
                                src={u.avatar_url} 
                                alt={u.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-purple-600 text-white flex items-center justify-center font-bold">
                                {u.name?.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-bold">{u.name}</div>
                            <div className="text-sm text-neutral-400">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                          u.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                        }`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="py-4 text-sm text-neutral-500">
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleUserStatus(u.id, u.status === 'active' ? 'banned' : 'active')}
                            className={`p-2 rounded-xl transition-colors ${
                              u.status === 'active' ? 'text-red-500 hover:bg-red-50' : 'text-emerald-600 hover:bg-emerald-50'
                            }`}
                            title={u.status === 'active' ? 'Ban User' : 'Activate User'}
                          >
                            {u.status === 'active' ? <ShieldAlert className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(u.id, u.name)}
                            className="p-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="space-y-4">
              {bookings.map(b => (
                <div key={b.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl hover:bg-neutral-100 transition-colors group">
                  <div className="flex-1">
                    <div className="font-bold">{b.student_name} → {b.tutor_name}</div>
                    <div className="text-xs text-neutral-400">
                      {new Date(b.start_time).toLocaleString()} • ${b.total_price}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase ${
                      b.status === 'confirmed' ? 'bg-blue-50 text-blue-600' :
                      b.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                      'bg-red-50 text-red-600'
                    }`}>
                      {b.status}
                    </span>
                    {b.status !== 'cancelled' && (
                      <button 
                        onClick={async () => {
                          if (confirm(`Cancel booking from ${b.student_name} to ${b.tutor_name}?`)) {
                            const res = await fetch(`/api/bookings/${b.id}/status`, {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ status: 'cancelled' })
                            });
                            if (res.ok) fetchData();
                          }
                        }}
                        className="p-2 rounded-xl text-orange-600 hover:bg-orange-50 transition-colors opacity-0 group-hover:opacity-100"
                        title="Cancel Booking"
                      >
                        <ShieldAlert className="w-5 h-5" />
                      </button>
                    )}
                    <button 
                      onClick={async () => {
                        if (confirm(`Delete this booking permanently? This cannot be undone.`)) {
                          const res = await fetch(`/api/admin/bookings/${b.id}`, {
                            method: 'DELETE'
                          });
                          if (res.ok) {
                            alert('Booking deleted successfully');
                            fetchData();
                          } else {
                            alert('Failed to delete booking');
                          }
                        }
                      }}
                      className="p-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete Booking"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold">Manage Categories</h3>
                <button 
                  onClick={() => setShowAddCategory(!showAddCategory)}
                  className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-sm"
                >
                  {showAddCategory ? 'Cancel' : '+ Add Category'}
                </button>
              </div>

              {showAddCategory && (
                <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    const res = await fetch('/api/admin/categories', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(newCategory)
                    });
                    if (res.ok) {
                      setNewCategory({ name: '', slug: '' });
                      setShowAddCategory(false);
                      fetchData();
                    }
                  }} className="grid md:grid-cols-3 gap-4">
                    <input 
                      type="text"
                      placeholder="Category Name"
                      required
                      className="p-3 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({...newCategory, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                    />
                    <input 
                      type="text"
                      placeholder="Slug (auto-generated)"
                      required
                      className="p-3 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                      value={newCategory.slug}
                      onChange={(e) => setNewCategory({...newCategory, slug: e.target.value})}
                    />
                    <button 
                      type="submit"
                      className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors"
                    >
                      Add Category
                    </button>
                  </form>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map(cat => (
                  <div key={cat.id} className="p-4 bg-neutral-50 rounded-2xl font-bold text-neutral-700 border border-neutral-100 flex items-center justify-between group hover:bg-neutral-100 transition-colors">
                    <div>
                      <div className="font-bold">{cat.name}</div>
                      <div className="text-xs text-neutral-400 font-normal">{cat.slug}</div>
                    </div>
                    <button 
                      onClick={async () => {
                        if (confirm(`Delete category "${cat.name}"?`)) {
                          const res = await fetch(`/api/admin/categories/${cat.id}`, { method: 'DELETE' });
                          if (res.ok) fetchData();
                        }
                      }}
                      className="opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
                    >
                      <ShieldAlert className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
