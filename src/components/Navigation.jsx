import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navigation() {
  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const sections = [
    { id: 'home', label: 'Home' },
    { id: 'projects', label: 'Projects' },
    { id: 'library', label: 'Library' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      // Add background blur when scrolled
      setScrolled(window.scrollY > 50);

      // Detect active section
      const sectionElements = sections.map(section => ({
        id: section.id,
        element: document.getElementById(section.id)
      }));

      const current = sectionElements.find(section => {
        if (section.element) {
          const rect = section.element.getBoundingClientRect();
          return rect.top <= 150 && rect.bottom >= 150;
        }
        return false;
      });

      if (current) {
        setActiveSection(current.id);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          padding: '12px 24px',
          background: scrolled 
            ? 'rgba(10, 10, 10, 0.8)' 
            : 'rgba(10, 10, 10, 0.4)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '50px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.3s ease',
        }}
        className="hidden md:block"
      >
        <ul style={{ 
          display: 'flex', 
          gap: '8px', 
          listStyle: 'none', 
          margin: 0, 
          padding: 0 
        }}>
          {sections.map((section) => (
            <li key={section.id}>
              <button
                onClick={() => scrollToSection(section.id)}
                style={{
                  position: 'relative',
                  padding: '10px 20px',
                  background: activeSection === section.id 
                    ? 'rgba(59, 130, 246, 0.2)' 
                    : 'transparent',
                  border: 'none',
                  borderRadius: '25px',
                  color: activeSection === section.id ? '#60a5fa' : '#9ca3af',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  letterSpacing: '0.5px',
                }}
                onMouseEnter={(e) => {
                  if (activeSection !== section.id) {
                    e.currentTarget.style.color = '#ffffff';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeSection !== section.id) {
                    e.currentTarget.style.color = '#9ca3af';
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                {section.label}
              </button>
            </li>
          ))}
        </ul>
      </motion.nav>

      {/* Mobile Hamburger Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        onMouseEnter={() => {
          // Only trigger on desktop (screen width > 768px)
          if (window.innerWidth > 768) {
            setIsMenuOpen(true);
          }
        }}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 101,
          width: '48px',
          height: '48px',
          background: 'rgba(10, 10, 10, 0.8)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '5px',
          cursor: 'pointer',
          padding: 0,
        }}
        className="md:hidden"
      >
        <motion.span
          animate={{ rotate: isMenuOpen ? 45 : 0, y: isMenuOpen ? 8 : 0 }}
          style={{
            width: '20px',
            height: '2px',
            background: 'white',
            borderRadius: '2px',
          }}
        />
        <motion.span
          animate={{ opacity: isMenuOpen ? 0 : 1 }}
          style={{
            width: '20px',
            height: '2px',
            background: 'white',
            borderRadius: '2px',
          }}
        />
        <motion.span
          animate={{ rotate: isMenuOpen ? -45 : 0, y: isMenuOpen ? -8 : 0 }}
          style={{
            width: '20px',
            height: '2px',
            background: 'white',
            borderRadius: '2px',
          }}
        />
      </motion.button>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              width: '100%',
              height: '100vh',
              background: 'rgba(10, 10, 10, 0.98)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              zIndex: 100,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '30px',
            }}
            className="md:hidden"
          >
            {sections.map((section, index) => (
              <motion.button
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => scrollToSection(section.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: activeSection === section.id ? '#60a5fa' : '#ffffff',
                  fontSize: '32px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  padding: '10px',
                  transition: 'all 0.3s ease',
                }}
              >
                {section.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section Indicators (Desktop) */}
      <div
        style={{
          position: 'fixed',
          right: '30px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
        className="hidden lg:flex"
      >
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            style={{
              position: 'relative',
              width: '12px',
              height: '12px',
              background: activeSection === section.id 
                ? '#60a5fa' 
                : 'rgba(255, 255, 255, 0.3)',
              border: 'none',
              borderRadius: '50%',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              padding: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.3)';
              e.currentTarget.style.background = activeSection === section.id 
                ? '#60a5fa' 
                : 'rgba(255, 255, 255, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.background = activeSection === section.id 
                ? '#60a5fa' 
                : 'rgba(255, 255, 255, 0.3)';
            }}
            aria-label={`Go to ${section.label}`}
          />
        ))}
      </div>
    </>
  );
}