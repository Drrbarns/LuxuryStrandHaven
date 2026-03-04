'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const COURSES = [
  {
    icon: '👑',
    title: 'Wig Making Masterclass',
    desc: 'Learn to construct flawless wigs from scratch — cap construction, wefting, styling and finishing.',
  },
  {
    icon: '✂️',
    title: 'HD Lace Techniques',
    desc: 'Master HD and transparent lace application, bleaching knots, baby hair and seamless installs.',
  },
  {
    icon: '💼',
    title: 'Hair Business Bootcamp',
    desc: 'Build a profitable hair brand — sourcing, pricing, branding, social media and sales strategy.',
  },
  {
    icon: '🎨',
    title: 'Color & Styling',
    desc: 'Advanced coloring, highlights, toning and creative styling techniques for human hair.',
  },
];

export default function AcademiaPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleNotify(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail('');
    }
  }

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background gradient orbs */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-amber-900/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-amber-900/15 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-20 pb-24 flex flex-col items-center text-center">

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <Image
            src="/haven%20logo%20white.png"
            alt="Luxury Strand Haven"
            width={120}
            height={60}
            className="object-contain"
          />
        </motion.div>

        {/* Coming Soon badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 20 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-amber-500/50 bg-amber-500/10 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-amber-400 text-xs font-bold tracking-[0.2em] uppercase">Coming Soon</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6"
        >
          Hair{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">
            Academia
          </span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7 }}
          className="text-white/60 text-lg sm:text-xl max-w-xl leading-relaxed mb-14"
        >
          Ghana&apos;s premier online hair education platform is launching soon. 
          Learn wig making, HD lace, hair business and more — from industry experts.
        </motion.p>

        {/* Courses grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.7 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-14"
        >
          {COURSES.map((course) => (
            <div
              key={course.title}
              className="text-left p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-amber-500/40 hover:bg-white/8 transition-all group"
            >
              <span className="text-3xl mb-3 block">{course.icon}</span>
              <h3 className="font-semibold text-white mb-2 group-hover:text-amber-400 transition-colors">
                {course.title}
              </h3>
              <p className="text-white/50 text-sm leading-relaxed">{course.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* Notify form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="w-full max-w-md mb-10"
        >
          <p className="text-white/50 text-sm mb-4 uppercase tracking-widest font-semibold">
            Get notified when we launch
          </p>
          {submitted ? (
            <div className="flex items-center justify-center gap-2 py-4 px-6 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 font-semibold">
              <i className="ri-check-line text-lg" />
              You&apos;re on the list — we&apos;ll let you know!
            </div>
          ) : (
            <form onSubmit={handleNotify} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-full px-5 py-3 text-sm focus:outline-none focus:border-amber-500/60 focus:bg-white/15 transition-all"
              />
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-6 py-3 rounded-full text-sm transition-all hover:scale-105 whitespace-nowrap"
              >
                Notify Me
              </button>
            </form>
          )}
        </motion.div>

        {/* Divider */}
        <div className="w-px h-10 bg-white/20 mb-10" />

        {/* Back to shop CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-white text-black hover:bg-gray-100 px-7 py-3.5 rounded-full font-bold text-sm transition-all hover:scale-105 shadow-xl"
          >
            <i className="ri-shopping-bag-line" />
            Shop Our Collection
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 border border-white/20 text-white/70 hover:text-white hover:border-white/40 px-7 py-3.5 rounded-full font-semibold text-sm transition-all"
          >
            <i className="ri-arrow-left-line" />
            Back to Home
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
