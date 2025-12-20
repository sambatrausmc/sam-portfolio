import { useState, useEffect, useRef } from 'react';
import { urlFor } from '../lib/sanity';

export default function MediaViewer({ media, onClose }) {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [showFullCaption, setShowFullCaption] = useState(false);
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  // Prevent background scrolling
// Prevent background scrolling and save position
useEffect(() => {
  if (media) {
    // Save current scroll position
    const scrollY = window.pageYOffset;
    
    // Lock body
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    
    // Cleanup: restore scroll position
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      
      // Restore scroll position
      window.scrollTo(0, scrollY);
    };
  }
}, [media]);

  // Handle zoom with scroll wheel
  const handleWheel = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom((prev) => Math.min(Math.max(0.5, prev + delta), 5));
  };

  // Handle double click to zoom
  const handleDoubleClick = () => {
    if (zoom === 1) {
      setZoom(2);
    } else {
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    }
  };

  // Handle drag start
  const handleMouseDown = (e) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  // Handle drag move
  const handleMouseMove = (e) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  // Handle drag end
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Video controls
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const skipTime = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  // Reset zoom when media changes
  useEffect(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    setIsPlaying(false);
    setShowFullCaption(false);
  }, [media]);

  if (!media) return null;

  const isVideo = media.mediaType === 'video';
  const videoSrc = media.videoFile?.asset?.url || media.videoUrl;
  
  // Check if caption is long (more than 80 characters)
  const captionText = media.description || '';
  const isLongCaption = captionText.length > 80;
  const truncatedCaption = isLongCaption ? captionText.slice(0, 80) + '...' : captionText;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.98)',
        backdropFilter: 'blur(20px)',
        zIndex: 3000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '30px',
          right: '30px',
          width: '50px',
          height: '50px',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '50%',
          color: 'white',
          fontSize: '28px',
          cursor: 'pointer',
          zIndex: 10,
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

      {/* Zoom Controls */}
      <div
        style={{
          position: 'absolute',
          top: '30px',
          left: '30px',
          display: 'flex',
          gap: '12px',
          zIndex: 10,
        }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            setZoom((prev) => Math.max(0.5, prev - 0.2));
          }}
          style={{
            padding: '12px 20px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            color: 'white',
            fontSize: '18px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
          }}
        >
          −
        </button>
        <div
          style={{
            padding: '12px 20px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            color: 'white',
            fontSize: '14px',
            fontWeight: '600',
            minWidth: '80px',
            textAlign: 'center',
          }}
        >
          {Math.round(zoom * 100)}%
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setZoom((prev) => Math.min(5, prev + 0.2));
          }}
          style={{
            padding: '12px 20px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            color: 'white',
            fontSize: '18px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
          }}
        >
          +
        </button>
      </div>

      {/* Media Container */}
      <div
        ref={containerRef}
        onClick={(e) => e.stopPropagation()}
        onWheel={handleWheel}
        onDoubleClick={handleDoubleClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          maxWidth: '90vw',
          maxHeight: '90vh',
          overflow: 'hidden',
          cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
          position: 'relative',
        }}
      >
        {isVideo ? (
          <div style={{ position: 'relative' }}>
            <video
              ref={videoRef}
              src={videoSrc}
              style={{
                maxWidth: '90vw',
                maxHeight: '80vh',
                transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                transition: isDragging ? 'none' : 'transform 0.3s ease',
              }}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />

            {/* Video Controls */}
            <div
              style={{
                position: 'absolute',
                bottom: captionText ? '80px' : '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '12px',
                background: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(20px)',
                padding: '16px 24px',
                borderRadius: '50px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  skipTime(-10);
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'white',
                  fontSize: '20px',
                  cursor: 'pointer',
                  padding: '8px',
                }}
              >
                ⏪
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                style={{
                  background: 'rgba(59, 130, 246, 0.8)',
                  border: 'none',
                  color: 'white',
                  fontSize: '20px',
                  cursor: 'pointer',
                  padding: '8px 20px',
                  borderRadius: '25px',
                  fontWeight: '600',
                }}
              >
                {isPlaying ? '⏸' : '▶'}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  skipTime(10);
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'white',
                  fontSize: '20px',
                  cursor: 'pointer',
                  padding: '8px',
                }}
              >
                ⏩
              </button>
            </div>

            {/* Instagram-style Caption for Video */}
            {captionText && (
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  position: 'absolute',
                  bottom: '20px',
                  left: '20px',
                  right: '20px',
                  maxWidth: '500px',
                }}
              >
                <div
                  style={{
                    background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.6), transparent)',
                    padding: '20px 16px 16px 16px',
                    borderRadius: '12px',
                  }}
                >
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: '700',
                      marginBottom: '4px',
                    }}
                  >
                    {media.title}
                  </h3>
                  <p
                    style={{
                      color: 'white',
                      fontSize: '14px',
                      lineHeight: '1.4',
                      margin: 0,
                    }}
                  >
                    {showFullCaption ? captionText : truncatedCaption}
                    {isLongCaption && !showFullCaption && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowFullCaption(true);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#9ca3af',
                          cursor: 'pointer',
                          marginLeft: '4px',
                          fontSize: '14px',
                          fontWeight: '600',
                        }}
                      >
                        more
                      </button>
                    )}
                    {showFullCaption && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowFullCaption(false);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#9ca3af',
                          cursor: 'pointer',
                          marginLeft: '4px',
                          fontSize: '14px',
                          fontWeight: '600',
                        }}
                      >
                        less
                      </button>
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ position: 'relative' }}>
            <img
              src={urlFor(media.image).width(2000).url()}
              alt={media.title}
              draggable={false}
              style={{
                maxWidth: '90vw',
                maxHeight: '90vh',
                objectFit: 'contain',
                transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                transition: isDragging ? 'none' : 'transform 0.3s ease',
                userSelect: 'none',
              }}
            />

            {/* Instagram-style Caption for Image */}
            {captionText && (
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  position: 'absolute',
                  bottom: '20px',
                  left: '20px',
                  right: '20px',
                  maxWidth: '500px',
                }}
              >
                <div
                  style={{
                    background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.6), transparent)',
                    padding: '20px 16px 16px 16px',
                    borderRadius: '12px',
                  }}
                >
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: '700',
                      marginBottom: '4px',
                    }}
                  >
                    {media.title}
                  </h3>
                  <p
                    style={{
                      color: 'white',
                      fontSize: '14px',
                      lineHeight: '1.4',
                      margin: 0,
                    }}
                  >
                    {showFullCaption ? captionText : truncatedCaption}
                    {isLongCaption && !showFullCaption && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowFullCaption(true);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#9ca3af',
                          cursor: 'pointer',
                          marginLeft: '4px',
                          fontSize: '14px',
                          fontWeight: '600',
                        }}
                      >
                        more
                      </button>
                    )}
                    {showFullCaption && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowFullCaption(false);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#9ca3af',
                          cursor: 'pointer',
                          marginLeft: '4px',
                          fontSize: '14px',
                          fontWeight: '600',
                        }}
                      >
                        less
                      </button>
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}