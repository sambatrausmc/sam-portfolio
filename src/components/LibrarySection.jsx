import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { client, urlFor } from '../lib/sanity';
import MediaViewer from './MediaViewer';

export default function LibrarySection() {
  const [media, setMedia] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    client
      .fetch(
        `*[_type == "library"] | order(order asc) {
          _id,
          title,
          description,
          mediaType,
          image,
          videoUrl,
          videoFile {
            asset-> {
              url,
              playbackId,
              thumbTime
            }
          },
          category,
          tags,
          featured,
          order
        }`
      )
      .then((data) => {
        setMedia(data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const categories = ['All', ...new Set(media.map((m) => m.category).filter(Boolean))];

  const filteredMedia = filter === 'All' ? media : media.filter((m) => m.category === filter);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white text-2xl">Loading library...</p>
      </div>
    );
  }

  return (
    <>
      <section className="min-h-screen px-6 py-24 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6">Library</h2>
          <p className="text-xl text-gray-400">A collection of moments and memories</p>
        </motion.div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 max-w-4xl mx-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                padding: '10px 24px',
                background:
                  filter === cat
                    ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(147, 51, 234, 0.3))'
                    : 'rgba(255, 255, 255, 0.05)',
                border: filter === cat ? '1px solid rgba(59, 130, 246, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '25px',
                color: filter === cat ? '#60a5fa' : '#9ca3af',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)',
              }}
              onMouseEnter={(e) => {
                if (filter !== cat) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.color = '#ffffff';
                }
              }}
              onMouseLeave={(e) => {
                if (filter !== cat) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.color = '#9ca3af';
                }
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Photo Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px',
            maxWidth: '1400px',
            margin: '0 auto',
          }}
        >
          {filteredMedia.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, zIndex: 10 }}
              onClick={() => setSelectedMedia(item)}
              style={{
                position: 'relative',
                aspectRatio: '1 / 1',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              {/* Media Thumbnail */}
              {item.mediaType === 'image' && item.image ? (
                <img
                  src={urlFor(item.image).width(400).height(400).url()}
                  alt={item.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              ) : item.mediaType === 'video' ? (
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    background: item.image
                      ? 'transparent'
                      : 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {/* Use custom thumbnail if available */}
                  {item.image && (
                    <img
                      src={urlFor(item.image).width(400).height(400).url()}
                      alt={item.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  )}
                  
                  {/* Play button overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '80px',
                      height: '80px',
                      background: 'rgba(59, 130, 246, 0.9)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '32px',
                      color: 'white',
                      border: '3px solid rgba(255, 255, 255, 0.3)',
                    }}
                  >
                    ▶
                  </div>
                </div>
              ) : null}

              {/* Overlay on Hover */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent)',
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '20px',
                }}
                className="hover-overlay"
              >
                <h3
                  style={{
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: '600',
                    marginBottom: '8px',
                  }}
                >
                  {item.title}
                </h3>
                {item.mediaType && (
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      background: 'rgba(59, 130, 246, 0.3)',
                      borderRadius: '12px',
                      color: '#60a5fa',
                      fontSize: '12px',
                      fontWeight: '500',
                      width: 'fit-content',
                    }}
                  >
                    {item.mediaType === 'image' ? '📷 Image' : '🎥 Video'}
                  </span>
                )}
              </div>

              {/* Featured Badge */}
              {item.featured && (
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    padding: '6px 12px',
                    background: 'rgba(59, 130, 246, 0.9)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: '600',
                  }}
                >
                  ⭐
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* No Media Found */}
        {filteredMedia.length === 0 && (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-400">No media found in {filter}</p>
          </div>
        )}
      </section>

      {/* Media Viewer Modal */}
      {selectedMedia && (
        <MediaViewer media={selectedMedia} onClose={() => setSelectedMedia(null)} />
      )}

      {/* Hover Overlay Effect */}
      <style jsx>{`
        .hover-overlay {
          opacity: 0;
        }
        div:hover > .hover-overlay {
          opacity: 1;
        }
      `}</style>
    </>
  );
}