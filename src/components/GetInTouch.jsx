import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { sanityClient } from '../lib/sanity';
import { SiInstagram, SiLinkedin, SiGmail, SiWhatsapp } from 'react-icons/si';
import { HiDownload } from 'react-icons/hi';

export default function GetInTouch() {
  const [contactData, setContactData] = useState(null);

  // Fetch contact data from Sanity including title and subtitle
  useEffect(() => {
    sanityClient
      .fetch(`*[_type == "contact"][0] { 
        sectionTitle,
        sectionSubtitle,
        instagramUrl,
        linkedinUrl,
        email,
        phone,
        "resumeUrl": resume.asset->url
      }`)
      .then((data) => setContactData(data))
      .catch(console.error);
  }, []);

  if (!contactData) {
    return (
      <div className="text-center py-20">
        <h2 className="text-5xl md:text-7xl text-white font-bold mb-4">Loading...</h2>
      </div>
    );
  }

  const socialLinks = [
    {
      name: 'Instagram',
      icon: SiInstagram,
      url: contactData.instagramUrl,
    },
    {
      name: 'LinkedIn',
      icon: SiLinkedin,
      url: contactData.linkedinUrl,
    },
    {
      name: 'Gmail',
      icon: SiGmail,
      url: `mailto:${contactData.email}`,
    },
    {
      name: 'Phone',
      icon: SiWhatsapp,
      url: `tel:${contactData.phone}`,
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-8 py-20">
      <div className="text-center max-w-6xl mx-auto w-full">
        {/* Title - Editable via CMS */}
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-5xl md:text-7xl text-white font-bold mb-6"
        >
          {contactData.sectionTitle}
        </motion.h2>

        {/* Subtitle - Editable via CMS */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-gray-400 text-xl mb-20"
        >
          {contactData.sectionSubtitle}
        </motion.p>

        {/* Social Icons - LARGE with WIDE spacing */}
        <div 
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '80px', // 80px gap between icons
            marginBottom: '80px',
            flexWrap: 'wrap'
          }}
        >
          {socialLinks.map((social, index) => {
            const Icon = social.icon;
            return (
              <motion.a
                key={social.name}
                href={social.url}
                target={social.name !== 'Gmail' && social.name !== 'Phone' ? '_blank' : undefined}
                rel={social.name !== 'Gmail' && social.name !== 'Phone' ? 'noopener noreferrer' : undefined}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.2, 
                  y: -10,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.9 }}
                style={{
                  cursor: 'pointer',
                  display: 'block'
                }}
                aria-label={social.name}
              >
                <Icon 
                  style={{ 
                    width: '96px',  // 96px = 6rem - LARGE icons
                    height: '96px',
                    color: '#9ca3af'
                  }}
                />
              </motion.a>
            );
          })}
        </div>

        {/* Download Resume Button - Styled like Story tile button */}
        {contactData.resumeUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.a
              href={contactData.resumeUrl}
              download
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 24px',
                background: 'rgba(59, 130, 246, 0.9)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                border: 'none',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(59, 130, 246, 1)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.9)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <HiDownload className="w-5 h-5" />
              <span>Download Resume</span>
            </motion.a>
          </motion.div>
        )}
      </div>
    </div>
  );
}