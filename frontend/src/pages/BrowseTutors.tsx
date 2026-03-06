import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Star, MapPin, DollarSign } from 'lucide-react';
import { motion } from 'motion/react';

export default function BrowseTutors() {
  const [tutors, setTutors] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(setCategories);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (selectedCategory) params.append('category', selectedCategory);

    fetch(`/api/tutors?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setTutors(data);
        setLoading(false);
      });
  }, [search, selectedCategory]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Find Your Perfect Tutor</h1>
          <p className="text-neutral-500">Browse our community of expert educators</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by name or bio..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-neutral-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="relative sm:w-48">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
            <select 
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-neutral-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none appearance-none bg-white transition-all"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-96 bg-neutral-100 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : tutors.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tutors.map((tutor, i) => (
            <motion.div 
              key={tutor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link to={`/tutors/${tutor.id}`} className="group block h-full">
                <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all flex flex-col h-full">
                  <div className="h-48 bg-neutral-100 relative overflow-hidden">
                    {tutor.avatar_url ? (
                      <img 
                        src={tutor.avatar_url} 
                        alt={tutor.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-emerald-600 text-white flex items-center justify-center text-6xl font-bold">
                        {tutor.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-sm">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      {tutor.rating.toFixed(1)}
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold group-hover:text-emerald-600 transition-colors">{tutor.name}</h3>
                      <div className="flex flex-wrap gap-2">
                        {tutor.subjects?.split(',').map((sub: string) => (
                          <span key={sub} className="text-[10px] uppercase tracking-wider font-bold bg-neutral-100 text-neutral-500 px-2 py-1 rounded-md">
                            {sub.trim()}
                          </span>
                        ))}
                      </div>
                      <p className="text-neutral-500 text-sm line-clamp-2 leading-relaxed">
                        {tutor.bio || "No bio provided yet."}
                      </p>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-neutral-50">
                      <div className="flex flex-col">
                        <span className="text-xs text-neutral-400 uppercase font-bold tracking-tight">Hourly Rate</span>
                        <span className="text-xl font-bold text-emerald-600">${tutor.hourly_rate || 0}/hr</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-neutral-400 uppercase font-bold tracking-tight">Reviews</span>
                        <div className="text-sm font-medium text-neutral-600">{tutor.review_count} reviews</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-neutral-300">
          <div className="text-neutral-400 mb-4">
            <Search className="w-12 h-12 mx-auto opacity-20" />
          </div>
          <h3 className="text-xl font-bold text-neutral-600">No tutors found</h3>
          <p className="text-neutral-400">Try adjusting your search or filters</p>
          <button 
            onClick={() => { setSearch(''); setSelectedCategory(''); }}
            className="mt-6 text-emerald-600 font-bold hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
