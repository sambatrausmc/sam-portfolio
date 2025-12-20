import AboutSection from './components/AboutSection'
import HeroSection from './components/HeroSection'
import BackToTop from './components/BackToTop'
import Navigation from './components/Navigation'
import ProjectsSection from './components/ProjectsSection'
import LibrarySection from './components/LibrarySection'
import GetInTouch from './components/GetInTouch'
import useSmoothScroll from './hooks/useSmoothScroll'
import './index.css'

function App() {
  // Initialize smooth scroll with snap behavior
  useSmoothScroll();

  return (
    <div className="App scroll-container">
      {/* Navigation */}
      <Navigation />
      
      {/* Back to Top Button */}
      <BackToTop />

      {/* Hero Section */}
      <div id="home" className="snap-section">
        <HeroSection />
      </div>
      
      {/* Projects Section */}
      <section id="projects" className="snap-section bg-[#0a0a0a]">
        <ProjectsSection />
      </section>

      {/* Library Section */}
      <section id="library" className="snap-section bg-[#0f0f0f]">
        <LibrarySection />
      </section>
      
      {/* About Section */}
      <section id="about" className="snap-section bg-[#0a0a0a]">
        <AboutSection />
      </section>
      
      {/* Contact Section */}
      <section id="contact" className="snap-section bg-[#0f0f0f]">
        <GetInTouch />
      </section>
    </div>
  )
}

export default App