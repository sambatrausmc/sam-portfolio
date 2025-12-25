import { useEffect, useRef } from 'react';
import { urlFor } from '../lib/sanity';

export default function AboutModal({ tabId, aboutData, onClose }) {
  const modalRef = useRef(null);

  // Prevent background scrolling
  useEffect(() => {
    if (tabId) {
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
  }, [tabId]);

  // Force focus on modal
  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.focus();
    }
  }, [tabId]);

  if (!tabId || !aboutData) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
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
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '1200px',
          maxHeight: '90vh',
          background: 'rgba(15, 15, 15, 0.98)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '24px',
          overflowY: 'auto',
          overflowX: 'hidden',
          outline: 'none',
          scrollBehavior: 'smooth',
        }}
      >
        {/* Close Button */}
        <div style={{ position: 'sticky', top: 0, zIndex: 100, display: 'flex', justifyContent: 'flex-end', padding: '20px 20px 0 0', background: 'rgba(15, 15, 15, 0.98)' }}>
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

        {/* Content */}
        <div style={{ padding: '20px 40px 40px 40px' }}>
          {/* Story Tab */}
          {tabId === 'story' && (
            <>
              {aboutData.profileImage && (
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
                  <img
                    src={urlFor(aboutData.profileImage).width(200).height(200).url()}
                    alt="Profile"
                    style={{
                      width: '200px',
                      height: '200px',
                      borderRadius: '50%',
                      border: '4px solid rgba(59, 130, 246, 0.5)',
                      objectFit: 'cover',
                    }}
                  />
                </div>
              )}

              <h2 style={{ fontSize: '48px', fontWeight: 'bold', color: 'white', marginBottom: '16px', textAlign: 'center' }}>
                My Journey
              </h2>

              {aboutData.heroBio && (
                <p style={{ fontSize: '20px', color: '#d1d5db', lineHeight: '1.8', marginBottom: '32px', textAlign: 'center', maxWidth: '800px', margin: '0 auto 32px' }}>
                  {aboutData.heroBio}
                </p>
              )}

              {aboutData.fullStory && aboutData.fullStory.length > 0 && (
                <div style={{ marginBottom: '40px' }}>
                  {aboutData.fullStory.map((block, index) => {
                    if (block._type === 'block') {
                      return (
                        <p key={index} style={{ fontSize: '18px', color: '#d1d5db', lineHeight: '1.8', marginBottom: '24px' }}>
                          {block.children?.map((child) => child.text).join('')}
                        </p>
                      );
                    }
                    return null;
                  })}
                </div>
              )}

              {aboutData.currentFocus && (
                <div style={{ marginTop: '40px', padding: '24px', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '16px' }}>
                  <h3 style={{ fontSize: '24px', fontWeight: '600', color: '#60a5fa', marginBottom: '12px' }}>Currently Learning</h3>
                  <p style={{ fontSize: '16px', color: '#d1d5db', lineHeight: '1.6' }}>{aboutData.currentFocus}</p>
                </div>
              )}

              {aboutData.resumeFile && (
                <div style={{ marginTop: '40px', textAlign: 'center' }}>
                  <a
                    href={aboutData.resumeFile.asset.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-block',
                      padding: '16px 32px',
                      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.9), rgba(147, 51, 234, 0.9))',
                      borderRadius: '50px',
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: '600',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow = '0 10px 30px rgba(59, 130, 246, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    📄 Download Resume
                  </a>
                </div>
              )}
            </>
          )}

          {/* Experience Tab */}
          {tabId === 'experience' && (
            <>
              <h2 style={{ fontSize: '48px', fontWeight: 'bold', color: 'white', marginBottom: '32px', textAlign: 'center' }}>
                Experience Timeline
              </h2>

              {aboutData.stats && aboutData.stats.length > 0 && (
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                  gap: '16px', 
                  marginBottom: '48px' 
                }}>
                  {aboutData.stats.map((stat, index) => (
                    <div
                      key={index}
                      style={{
                        background: 'rgba(59, 130, 246, 0.1)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        borderRadius: '16px',
                        padding: '20px',
                        textAlign: 'center',
                        minHeight: '140px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <div style={{ fontSize: '32px', marginBottom: '8px' }}>{stat.icon}</div>
                      <div style={{ 
                        fontSize: '28px', 
                        fontWeight: 'bold', 
                        color: '#60a5fa', 
                        marginBottom: '8px',
                        wordBreak: 'break-word',
                        hyphens: 'auto',
                      }}>
                        {stat.number}
                      </div>
                      <div style={{ 
                        fontSize: '13px', 
                        color: '#9ca3af',
                        lineHeight: '1.4',
                        wordBreak: 'break-word',
                        hyphens: 'auto',
                        textAlign: 'center',
                      }}>
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {aboutData.experience && aboutData.experience.length > 0 && (
                <div style={{ position: 'relative' }}>
                  {aboutData.experience.map((exp, index) => (
                    <div
                      key={index}
                      style={{
                        position: 'relative',
                        paddingLeft: '40px',
                        paddingBottom: '40px',
                        borderLeft: index < aboutData.experience.length - 1 ? '2px solid rgba(59, 130, 246, 0.3)' : 'none',
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          left: '-9px',
                          top: '0',
                          width: '16px',
                          height: '16px',
                          background: 'linear-gradient(135deg, #3b82f6, #9333ea)',
                          borderRadius: '50%',
                          border: '3px solid #0f0f0f',
                        }}
                      />
                      <h3 style={{ 
                        fontSize: '28px', 
                        fontWeight: 'bold', 
                        color: 'white', 
                        marginBottom: '8px',
                        wordBreak: 'break-word',
                      }}>
                        {exp.role}
                      </h3>
                      <p style={{ 
                        fontSize: '20px', 
                        color: '#60a5fa', 
                        marginBottom: '4px',
                        wordBreak: 'break-word',
                      }}>
                        {exp.company}
                      </p>
                      <p style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '16px' }}>
                        {exp.dateRange} • {exp.location}
                      </p>
                      <p style={{ 
                        fontSize: '16px', 
                        color: '#d1d5db', 
                        lineHeight: '1.6', 
                        marginBottom: '16px',
                        wordBreak: 'break-word',
                      }}>
                        {exp.description}
                      </p>
                      {exp.achievements && exp.achievements.length > 0 && (
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                          {exp.achievements.map((achievement, i) => (
                            <li 
                              key={i} 
                              style={{ 
                                fontSize: '15px', 
                                color: '#9ca3af', 
                                lineHeight: '1.6', 
                                marginBottom: '8px', 
                                paddingLeft: '24px', 
                                position: 'relative',
                                wordBreak: 'break-word',
                                hyphens: 'auto',
                              }}
                            >
                              <span style={{ position: 'absolute', left: 0, color: '#10b981', fontWeight: 'bold' }}>✓</span>
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Skills Tab */}
          {tabId === 'skills' && (
            <>
              <h2 style={{ fontSize: '48px', fontWeight: 'bold', color: 'white', marginBottom: '32px', textAlign: 'center' }}>
                Technical Skills
              </h2>

              {aboutData.skills && aboutData.skills.length > 0 && (
                <div style={{ marginBottom: '48px' }}>
                  {['Frontend', 'Backend', 'Database', 'Security', 'Leadership', 'Tools'].map((category) => {
                    const categorySkills = aboutData.skills.filter((s) => s.category === category);
                    if (categorySkills.length === 0) return null;

                    return (
                      <div key={category} style={{ marginBottom: '40px' }}>
                        <h3 style={{ fontSize: '24px', fontWeight: '600', color: '#60a5fa', marginBottom: '20px' }}>{category}</h3>
                        <div style={{ display: 'grid', gap: '16px' }}>
                          {categorySkills.map((skill, index) => (
                            <div key={index}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ fontSize: '16px', color: '#d1d5db', fontWeight: '500' }}>{skill.name}</span>
                                <span style={{ fontSize: '14px', color: '#9ca3af' }}>{skill.proficiency}/5</span>
                              </div>
                              <div
                                style={{
                                  width: '100%',
                                  height: '10px',
                                  background: 'rgba(255, 255, 255, 0.1)',
                                  borderRadius: '5px',
                                  overflow: 'hidden',
                                }}
                              >
                                <div
                                  style={{
                                    width: `${(skill.proficiency / 5) * 100}%`,
                                    height: '100%',
                                    background: 'linear-gradient(90deg, #3b82f6, #9333ea)',
                                    borderRadius: '5px',
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {aboutData.languages && aboutData.languages.length > 0 && (
                <div style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(236, 72, 153, 0.1))', border: '1px solid rgba(147, 51, 234, 0.3)', borderRadius: '16px' }}>
                  <h3 style={{ fontSize: '24px', fontWeight: '600', color: '#a78bfa', marginBottom: '16px' }}>Languages</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                    {aboutData.languages.map((lang, i) => (
                      <span
                        key={i}
                        style={{
                          padding: '10px 20px',
                          background: 'rgba(147, 51, 234, 0.2)',
                          border: '1px solid rgba(147, 51, 234, 0.4)',
                          borderRadius: '20px',
                          color: '#a78bfa',
                          fontSize: '15px',
                          fontWeight: '500',
                        }}
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Interests Tab */}
          {tabId === 'interests' && (
            <>
              <h2 style={{ fontSize: '48px', fontWeight: 'bold', color: 'white', marginBottom: '32px', textAlign: 'center' }}>
                Beyond Code
              </h2>

              {aboutData.interests && aboutData.interests.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                  {aboutData.interests.map((interest, index) => (
                    <div
                      key={index}
                      style={{
                        padding: '20px 24px',
                        background: 'rgba(59, 130, 246, 0.05)',
                        border: '1px solid rgba(59, 130, 246, 0.2)',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                      }}
                    >
                      <span style={{ fontSize: '32px' }}>🎯</span>
                      <span style={{ fontSize: '16px', color: '#d1d5db', lineHeight: '1.4' }}>{interest}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}