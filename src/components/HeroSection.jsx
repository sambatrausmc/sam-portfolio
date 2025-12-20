import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { sanityClient } from '../lib/sanity';

export default function HeroSection() {
  const [mainText, setMainText] = useState('Welcome to Sam Batra\'s Portfolio!');

  // Fetch main text from Sanity
  useEffect(() => {
    sanityClient
      .fetch(`*[_type == "hero"][0] { scrollText }`)
      .then((data) => {
        if (data?.scrollText) {
          setMainText(data.scrollText);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0a0a0a]">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

      {/* Main text - CMS editable */}
      <div className="max-w-7xl mx-auto px-8 z-10 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-light italic text-gray-300">
          {mainText}
        </h1>
        
        {/* Scroll indicator arrow */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="mt-8"
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 20 20" 
            fill="none" 
            className="opacity-50 mx-auto"
            style={{ color: '#9ca3af' }}
          >
            <path 
              d="M10 4L10 16M10 16L6 12M10 16L14 12" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}