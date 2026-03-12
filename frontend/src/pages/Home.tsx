import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Search, Star, Shield, Zap, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Home() {
  const [featuredTutors, setFeaturedTutors] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/tutors?limit=3')
      .then(res => res.json())
      .then(data => setFeaturedTutors(data.slice(0, 3)));
  }, []);

  return (
    <div className="space-y-24 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <h1 className="text-6xl font-bold tracking-tight leading-tight text-neutral-900">
              Unlock Your Potential with <span className="text-emerald-600">Expert Tutors</span>
            </h1>
            <p className="text-xl text-neutral-500 max-w-lg leading-relaxed">
              Connect with verified experts across 50+ subjects. Personalized learning that fits your schedule and budget.
            </p>
            <div className="flex gap-4">
              <Link to="/tutors" className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center gap-2">
                Find a Tutor <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/register" className="bg-white border border-neutral-200 text-neutral-700 px-8 py-4 rounded-2xl font-semibold hover:bg-neutral-50 transition-all">
                Become a Tutor
              </Link>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="aspect-square rounded-3xl bg-emerald-100 overflow-hidden relative">
              <img 
                src="https://picsum.photos/seed/learning/800/800" 
                alt="Learning" 
                className="object-cover w-full h-full mix-blend-multiply opacity-80"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-linear-to-t from-emerald-900/40 to-transparent" />
            </div>
            {/* Floating Stats */}
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-neutral-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                  <Star className="fill-current" />
                </div>
                <div>
                  <div className="text-2xl font-bold">4.9/5</div>
                  <div className="text-sm text-neutral-500">Average Rating</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8">
        {[
          { icon: Shield, title: 'Verified Experts', desc: 'Every tutor on SkillBridge undergoes a rigorous background and skill verification process.' },
          { icon: Zap, title: 'Instant Booking', desc: 'Find a tutor and book your session in seconds. No back-and-forth emails required.' },
          { icon: Search, title: 'Tailored Learning', desc: 'Filter by subject, price, and availability to find the perfect match for your needs.' }
        ].map((feature, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="p-8 bg-white rounded-3xl border border-neutral-100 hover:shadow-xl transition-all group"
          >
            <div className="w-14 h-14 bg-neutral-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <feature.icon className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
            <p className="text-neutral-500 leading-relaxed">{feature.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Featured Tutors */}
      <section className="space-y-12">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured Tutors</h2>
            <p className="text-neutral-500">Learn from the best in the industry</p>
          </div>
          <Link to="/tutors" className="text-emerald-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
            View all tutors <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {featuredTutors.length > 0 ? featuredTutors.map((tutor, i) => (
            <Link key={tutor.id} to={`/tutors/${tutor.id}`} className="group">
              <div className="bg-white rounded-3xl border border-neutral-100 overflow-hidden hover:shadow-2xl transition-all">
                <div className="h-48 bg-neutral-100 relative">
                  <img 
                    src={`https://picsum.photos/seed/tutor-${tutor.id}/400/300`} 
                    alt={tutor.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    {Number(tutor.rating || 0).toFixed(1)}
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold group-hover:text-emerald-600 transition-colors">{tutor.name}</h3>
                    <p className="text-sm text-neutral-500 line-clamp-1">{tutor.subjects}</p>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-neutral-50">
                    <div className="text-lg font-bold text-emerald-600">${tutor.hourly_rate}/hr</div>
                    <div className="text-sm text-neutral-400">{tutor.review_count} reviews</div>
                  </div>
                </div>
              </div>
            </Link>
          )) : (
            <div className="col-span-3 text-center py-12 text-neutral-400 italic">
              No tutors featured yet.
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-emerald-600 rounded-[3rem] p-12 md:p-24 text-center text-white space-y-8 relative overflow-hidden">
        <div className="relative z-10 space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold max-w-2xl mx-auto leading-tight">
            Ready to start your learning journey?
          </h2>
          <p className="text-emerald-100 text-lg max-w-xl mx-auto">
            Join thousands of students who are already learning from expert tutors on SkillBridge.
          </p>
          <div className="pt-4">
            <Link to="/register" className="bg-white text-emerald-600 px-10 py-4 rounded-2xl font-bold hover:bg-emerald-50 transition-all inline-block shadow-xl">
              Get Started for Free
            </Link>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-400/20 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />
      </section>
    </div>
  );
}
