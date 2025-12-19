import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const LandingNavbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-b from-slate-900/95 to-slate-900/80 backdrop-blur-lg border-b border-blue-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div 
            onClick={() => navigate('/')}
            className="flex items-center cursor-pointer group"
          >
            <div className="text-3xl font-black bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:via-blue-300 group-hover:to-cyan-400 transition-all duration-300">
              SuperTech
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('features')}
              className="text-blue-300/70 hover:text-cyan-300 font-semibold transition-colors relative group"
            >
              Features
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300"></span>
            </button>
            <button
              onClick={() => scrollToSection('cta')}
              className="text-blue-300/70 hover:text-cyan-300 font-semibold transition-colors relative group"
            >
              Get Started
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300"></span>
            </button>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2 text-blue-300 hover:text-cyan-300 font-semibold transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-bold hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105"
            >
              Sign Up
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-blue-300 hover:text-cyan-300 transition-colors p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-6 space-y-3 border-t border-blue-500/20 pt-4">
            <button
              onClick={() => scrollToSection('features')}
              className="block w-full text-left px-4 py-2 text-blue-300 hover:text-cyan-300 hover:bg-blue-500/10 transition-all rounded-lg"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('cta')}
              className="block w-full text-left px-4 py-2 text-blue-300 hover:text-cyan-300 hover:bg-blue-500/10 transition-all rounded-lg"
            >
              Get Started
            </button>
            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={() => navigate('/login')}
                className="w-full px-4 py-2 text-cyan-300 border border-cyan-400/50 rounded-lg font-semibold hover:bg-cyan-500/10 transition-all"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
                className="w-full px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-bold hover:shadow-lg transition-all"
              >
                Sign Up
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
