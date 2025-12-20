import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sanityClient, urlFor } from '../lib/sanity';
import ProjectModal from './ProjectModal';

export default function ProjectsSection() {
  const [projects, setProjects] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Fetch projects from Sanity
    sanityClient
      .fetch(
        `*[_type == "project"] | order(order asc) {
          _id,
          title,
          slug,
          featured,
          coverImage,
          status,
          description,
          tech,
          mission,
          scope,
          whatILearned,
          wins,
          challenges,
          nextSteps,
          media,
          live,
          repo
        }`
      )
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const handleCardClick = (project, isCenter) => {
    if (isCenter && !isDragging) {
      setSelectedProject(project);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (selectedProject) return; // Don't navigate if modal is open
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [projects.length, selectedProject]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="text-white text-2xl">Loading projects...</div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="text-white text-2xl">No projects found</div>
      </div>
    );
  }

  return (
    <>
        <section className="min-h-screen flex flex-col items-center justify-start px-6 pt-24 pb-20 relative">
        {/* Section Header - Now with more top padding */}
            <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-20 z-50 relative"
  >
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Featured Projects
          </h2>
        </motion.div>

        {/* Carousel Container */}
        <div className="w-full max-w-7xl mx-auto relative">
          {/* Projects Slider */}
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
            {projects.map((project, index) => {
              const offset = index - currentIndex;
              const isCenter = offset === 0;
              const isVisible = Math.abs(offset) <= 1;

              if (!isVisible) return null;

              return (
                <motion.div
                  key={project._id}
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
                  onClick={() => handleCardClick(project, isCenter)}
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
                    {/* Project Image */}
                    <div
                      style={{
                        position: 'relative',
                        height: '300px',
                        overflow: 'hidden',
                        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))',
                      }}
                    >
                      {project.coverImage ? (
                        <img
                          src={urlFor(project.coverImage).width(600).url()}
                          alt={project.title}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <span style={{ fontSize: '80px' }}>🚀</span>
                        </div>
                      )}

                      {/* Featured Badge */}
                      {project.featured && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '16px',
                            right: '16px',
                            padding: '8px 16px',
                            background: 'rgba(59, 130, 246, 0.9)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '20px',
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: '600',
                          }}
                        >
                          ⭐ Featured
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

                    {/* Project Info */}
                    <div style={{ padding: '24px' }}>
                      <h3
                        style={{
                          fontSize: '28px',
                          fontWeight: 'bold',
                          color: 'white',
                          marginBottom: '12px',
                        }}
                      >
                        {project.title}
                      </h3>

                      {project.status && (
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '6px 14px',
                            background: 'rgba(34, 197, 94, 0.2)',
                            border: '1px solid rgba(34, 197, 94, 0.5)',
                            borderRadius: '12px',
                            color: '#4ade80',
                            fontSize: '12px',
                            fontWeight: '600',
                            marginBottom: '12px',
                          }}
                        >
                          {project.status}
                        </span>
                      )}

                      <p
                        style={{
                          color: '#9ca3af',
                          fontSize: '16px',
                          lineHeight: '1.6',
                          marginBottom: '16px',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {project.description}
                      </p>

                      {/* Tech Stack */}
                      {project.tech && project.tech.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {project.tech.slice(0, 4).map((tech, i) => (
                            <span
                              key={i}
                              style={{
                                padding: '6px 14px',
                                background: 'rgba(59, 130, 246, 0.1)',
                                border: '1px solid rgba(59, 130, 246, 0.3)',
                                borderRadius: '12px',
                                color: '#60a5fa',
                                fontSize: '12px',
                                fontWeight: '500',
                              }}
                            >
                              {tech}
                            </span>
                          ))}
                          {project.tech.length > 4 && (
                            <span
                              style={{
                                padding: '6px 14px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                borderRadius: '12px',
                                color: '#9ca3af',
                                fontSize: '12px',
                              }}
                            >
                              +{project.tech.length - 4}
                            </span>
                          )}
                        </div>
                      )}
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
            {projects.map((_, index) => (
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

        {/* Project Counter */}
        <div
          style={{
            marginTop: '40px',
            color: '#9ca3af',
            fontSize: '16px',
            fontWeight: '500',
          }}
        >
          {currentIndex + 1} / {projects.length}
        </div>
      </section>

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </>
  );
}