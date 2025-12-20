import { useEffect, useRef } from 'react';
import { urlFor } from '../lib/sanity';

export default function ProjectModal({ project, onClose }) {
  const modalRef = useRef(null);

  // Prevent background scrolling
useEffect(() => {
  if (project) {
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    
    return () => {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    };
  }
}, [project]);

  // Force focus on modal for scroll
  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.focus();
    }
  }, [project]);

  if (!project) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleWheel = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.95)',
        backdropFilter: 'blur(10px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      {/* Scrollable Modal */}
      <div
        ref={modalRef}
        tabIndex={-1}
        onWheel={handleWheel}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '1200px',
          maxHeight: '90vh',
          background: 'rgba(15, 15, 15, 0.98)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '24px',
          overflowY: 'scroll',
          overflowX: 'hidden',
          outline: 'none',
        }}
      >
        {/* Close Button */}
        <div style={{ position: 'sticky', top: 0, zIndex: 100, display: 'flex', justifyContent: 'flex-end', padding: '20px 20px 0 0' }}>
          <button
            onClick={onClose}
            style={{
              width: '50px',
              height: '50px',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              color: 'white',
              fontSize: '28px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)';
              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.6)';
              e.currentTarget.style.transform = 'rotate(90deg) scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'rotate(0deg) scale(1)';
            }}
          >
            ×
          </button>
        </div>

        {/* Cover Image */}
        <div style={{ position: 'relative', height: '400px', overflow: 'hidden', marginTop: '-70px' }}>
          {project.coverImage ? (
            <img
              src={urlFor(project.coverImage).width(1200).url()}
              alt={project.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: '120px' }}>🚀</span>
            </div>
          )}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '150px',
              background: 'linear-gradient(to top, rgba(15, 15, 15, 1), transparent)',
            }}
          />
        </div>

        {/* Content */}
        <div style={{ padding: '40px' }}>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '48px', fontWeight: 'bold', color: 'white', marginBottom: '12px' }}>
              {project.title}
            </h2>
            {project.status && (
              <span
                style={{
                  display: 'inline-block',
                  padding: '8px 16px',
                  background: 'rgba(34, 197, 94, 0.2)',
                  border: '1px solid rgba(34, 197, 94, 0.5)',
                  borderRadius: '20px',
                  color: '#4ade80',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                {project.status}
              </span>
            )}
          </div>

          <p style={{ fontSize: '18px', color: '#d1d5db', lineHeight: '1.8', marginBottom: '32px' }}>
            {project.description}
          </p>

          {project.tech && project.tech.length > 0 && (
            <div style={{ marginBottom: '40px' }}>
              <h3 style={{ fontSize: '24px', fontWeight: '600', color: 'white', marginBottom: '16px' }}>
                Technologies Used
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {project.tech.map((tech, i) => (
                  <span
                    key={i}
                    style={{
                      padding: '10px 20px',
                      background: 'rgba(59, 130, 246, 0.15)',
                      border: '1px solid rgba(59, 130, 246, 0.4)',
                      borderRadius: '16px',
                      color: '#60a5fa',
                      fontSize: '15px',
                      fontWeight: '500',
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {project.mission && (
            <div style={{ marginBottom: '40px' }}>
              <h3 style={{ fontSize: '24px', fontWeight: '600', color: 'white', marginBottom: '16px' }}>Mission</h3>
              <p style={{ fontSize: '16px', color: '#9ca3af', lineHeight: '1.8' }}>{project.mission}</p>
            </div>
          )}

          {project.scope && project.scope.length > 0 && (
            <div style={{ marginBottom: '40px' }}>
              <h3 style={{ fontSize: '24px', fontWeight: '600', color: 'white', marginBottom: '16px' }}>Project Scope</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {project.scope.map((item, i) => (
                  <li key={i} style={{ fontSize: '16px', color: '#9ca3af', lineHeight: '1.8', marginBottom: '12px', paddingLeft: '28px', position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 0, color: '#60a5fa', fontWeight: 'bold' }}>•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {project.whatILearned && project.whatILearned.length > 0 && (
            <div style={{ marginBottom: '40px' }}>
              <h3 style={{ fontSize: '24px', fontWeight: '600', color: 'white', marginBottom: '16px' }}>What I Learned</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {project.whatILearned.map((item, i) => (
                  <li key={i} style={{ fontSize: '16px', color: '#9ca3af', lineHeight: '1.8', marginBottom: '12px', paddingLeft: '28px', position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 0, color: '#10b981', fontWeight: 'bold' }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {project.wins && project.wins.length > 0 && (
            <div style={{ marginBottom: '40px' }}>
              <h3 style={{ fontSize: '24px', fontWeight: '600', color: 'white', marginBottom: '16px' }}>Success & Wins 🎉</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {project.wins.map((item, i) => (
                  <li key={i} style={{ fontSize: '16px', color: '#9ca3af', lineHeight: '1.8', marginBottom: '12px', paddingLeft: '28px', position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 0, color: '#fbbf24', fontWeight: 'bold' }}>★</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {project.challenges && project.challenges.length > 0 && (
            <div style={{ marginBottom: '40px' }}>
              <h3 style={{ fontSize: '24px', fontWeight: '600', color: 'white', marginBottom: '16px' }}>Challenges Overcome</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {project.challenges.map((item, i) => (
                  <li key={i} style={{ fontSize: '16px', color: '#9ca3af', lineHeight: '1.8', marginBottom: '12px', paddingLeft: '28px', position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 0, color: '#ef4444', fontWeight: 'bold' }}>⚠</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {project.nextSteps && project.nextSteps.length > 0 && (
            <div style={{ marginBottom: '40px' }}>
              <h3 style={{ fontSize: '24px', fontWeight: '600', color: 'white', marginBottom: '16px' }}>Next Steps</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {project.nextSteps.map((item, i) => (
                  <li key={i} style={{ fontSize: '16px', color: '#9ca3af', lineHeight: '1.8', marginBottom: '12px', paddingLeft: '28px', position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 0, color: '#8b5cf6', fontWeight: 'bold' }}>→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {project.media && project.media.length > 0 && (
            <div style={{ marginBottom: '40px' }}>
              <h3 style={{ fontSize: '24px', fontWeight: '600', color: 'white', marginBottom: '16px' }}>Screenshots & Media</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                {project.media.map((image, i) => (
                  <img
                    key={i}
                    src={urlFor(image).width(400).url()}
                    alt={`Screenshot ${i + 1}`}
                    style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)' }}
                  />
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', paddingTop: '20px', paddingBottom: '40px' }}>
            {project.live && (
              <a href={project.live} target="_blank" rel="noopener noreferrer" style={{ padding: '16px 32px', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.9), rgba(147, 51, 234, 0.9))', border: 'none', borderRadius: '16px', color: 'white', fontSize: '16px', fontWeight: '600', textDecoration: 'none', display: 'inline-block', transition: 'all 0.3s ease' }}>
                🚀 View Live Demo
              </a>
            )}
            {project.repo && (
              <a href={project.repo} target="_blank" rel="noopener noreferrer" style={{ padding: '16px 32px', background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '16px', color: 'white', fontSize: '16px', fontWeight: '600', textDecoration: 'none', display: 'inline-block', transition: 'all 0.3s ease' }}>
                💻 View on GitHub
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}