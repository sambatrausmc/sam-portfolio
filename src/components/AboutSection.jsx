import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { client, urlFor } from '../lib/sanity';
import AboutModal from './AboutModal';

export default function AboutSection() {
  const [aboutData, setAboutData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedTab, setSelectedTab] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    client
      .fetch(
        `*[_type == "about"][0] {
  heroBio,
  profileImage,
  fullStory,
  experience,
  stats,
  skills,
  interests,
  currentFocus,
  languages,
  resumeFile {
    asset-> {
      url
    }
  },
  storyImage,
  experienceImage,
  skillsImage,
  interestsImage
}`
      )
      .then((data) => {
        setAboutData(data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const tabs = [
    { id: 'story', label: 'Story', icon: '📖', emoji: '✨' },
    { id: 'experience', label: 'Experience', icon: '💼', emoji: '🎖️' },
    { id: 'skills', label: 'Skills', icon: '⚡', emoji: '🚀' },
    { id: 'interests', label: 'Interests', icon: '🎯', emoji: '🌟' },
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % tabs.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + tabs.length) % tabs.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const handleCardClick = (tab, isCenter) => {
    if (isCenter && !isDragging) {
      setSelectedTab(tab.id);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (selectedTab) return;
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedTab]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white text-2xl">Loading...</p>
      </div>
    );
  }

  if (!aboutData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white text-2xl">No about content found</p>
      </div>
    );
  }

  return (
    <>
      <section className="min-h-screen flex flex-col items-center justify-start px-6 pt-20 pb-20 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16 z-50 relative"
        >
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6">About Me</h2>
        </motion.div>

        {/* Carousel Container */}
        <div className="w-full max-w-7xl mx-auto relative">
          {/* Tabs Slider */}
          <motion.div
            ref={containerRef}
            className="relative h-[600px] flex items-center justify-center"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={(e, { offset, velocity }) => {
              setIsDragging(false);
              if (offset.x > 100 || velocity.x > 500) {
                prevSlide();
              } else if (offset.x < -100 || velocity.x < -500) {
                nextSlide();
              }
            }}
          >
            {tabs.map((tab, index) => {
              const offset = index - currentIndex;
              const isCenter = offset === 0;
              const isVisible = Math.abs(offset) <= 1;

              if (!isVisible) return null;

              return (
                <motion.div
                  key={tab.id}
                  initial={false}
                  animate={{
                    x: `${offset * 110}%`,
                    scale: isCenter ? 1 : 0.8,
                    opacity: isCenter ? 1 : 0.4,
                    filter: isCenter ? 'blur(0px)' : 'blur(4px)',
                    zIndex: isCenter ? 10 : 5,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: 'easeInOut',
                  }}
                  style={{
                    position: 'absolute',
                    width: '450px',
                    pointerEvents: isCenter ? 'auto' : 'none',
                  }}
                  onClick={() => handleCardClick(tab, isCenter)}
                >
                  {/* Floating Card with Bounce Animation */}
                  <motion.div
                    animate={
                      isCenter
                        ? {
                            y: [0, -15, 0],
                          }
                        : { y: 0 }
                    }
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    style={{
                      background: 'rgba(15, 15, 15, 0.6)',
                      backdropFilter: 'blur(20px)',
                      border: isCenter
                        ? '2px solid rgba(59, 130, 246, 0.5)'
                        : '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '24px',
                      overflow: 'hidden',
                      boxShadow: isCenter
                        ? '0 25px 50px rgba(59, 130, 246, 0.3)'
                        : '0 10px 30px rgba(0, 0, 0, 0.3)',
                      cursor: isCenter ? (isDragging ? 'grabbing' : 'pointer') : 'grab',
                      transition: 'all 0.3s ease',
                    }}
                    whileHover={
                      isCenter
                        ? {
                            scale: 1.02,
                            boxShadow: '0 30px 60px rgba(59, 130, 246, 0.4)',
                          }
                        : {}
                    }
                  >
                    {/* Card Icon/Visual */}
<div
  style={{
    position: 'relative',
    height: '300px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))',
    overflow: 'hidden',
  }}
>
  {aboutData[`${tab.id}Image`] ? (
    <img
      src={urlFor(aboutData[`${tab.id}Image`]).width(450).height(300).url()}
      alt={tab.label}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      }}
    />
  ) : (
    <div
      style={{
        fontSize: '120px',
      }}
    >
      {tab.icon}
    </div>
  )}

                      {/* Click to View Overlay */}
                      {isCenter && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          style={{
                            position: 'absolute',
                            bottom: '16px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            padding: '8px 16px',
                            background: 'rgba(59, 130, 246, 0.9)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '20px',
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: '600',
                          }}
                        >
                          Click to view details
                        </motion.div>
                      )}

                      {/* Gradient Overlay */}
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: '100px',
                          background: 'linear-gradient(to top, rgba(15, 15, 15, 0.9), transparent)',
                        }}
                      />
                    </div>

                    {/* Card Info */}
                    <div style={{ padding: '24px' }}>
                      <h3
                        style={{
                          fontSize: '28px',
                          fontWeight: 'bold',
                          color: 'white',
                          marginBottom: '12px',
                          textAlign: 'center',
                        }}
                      >
                        {tab.emoji} {tab.label}
                      </h3>

                      <p
                        style={{
                          color: '#9ca3af',
                          fontSize: '16px',
                          lineHeight: '1.6',
                          textAlign: 'center',
                        }}
                      >
                        {tab.id === 'story' && 'My journey from Marine Corps to Developer'}
                        {tab.id === 'experience' && 'Military service & professional background'}
                        {tab.id === 'skills' && 'Technical expertise & capabilities'}
                        {tab.id === 'interests' && 'Beyond code & personal passions'}
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            style={{
              position: 'absolute',
              left: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '60px',
              height: '60px',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              color: 'white',
              fontSize: '24px',
              cursor: 'pointer',
              zIndex: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(59, 130, 246, 0.3)';
              e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            }}
          >
            ←
          </button>

          <button
            onClick={nextSlide}
            style={{
              position: 'absolute',
              right: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '60px',
              height: '60px',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              color: 'white',
              fontSize: '24px',
              cursor: 'pointer',
              zIndex: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(59, 130, 246, 0.3)';
              e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            }}
          >
            →
          </button>

          {/* Dot Indicators */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '12px',
              marginTop: '40px',
            }}
          >
            {tabs.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                style={{
                  width: currentIndex === index ? '40px' : '12px',
                  height: '12px',
                  background:
                    currentIndex === index
                      ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(147, 51, 234, 0.8))'
                      : 'rgba(255, 255, 255, 0.3)',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  padding: 0,
                }}
                onMouseEnter={(e) => {
                  if (currentIndex !== index) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentIndex !== index) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                  }
                }}
              />
            ))}
          </div>
        </div>

        {/* Tab Counter */}
        <div
          style={{
            marginTop: '40px',
            color: '#9ca3af',
            fontSize: '16px',
            fontWeight: '500',
          }}
        >
          {currentIndex + 1} / {tabs.length}
        </div>
      </section>

      {/* About Detail Modal */}
      {selectedTab && (
        <AboutModal
          tabId={selectedTab}
          aboutData={aboutData}
          onClose={() => setSelectedTab(null)}
        />
      )}
    </>
  );
}