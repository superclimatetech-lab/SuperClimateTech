import { useNavigate } from 'react-router-dom';
import { ImageCarousel } from './ImageCarousel';

export const Hero = () => {
  const navigate = useNavigate();

  const heroImages = [
    'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1589519160732-57fc498494f8?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1200&h=600&fit=crop',
  ];

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden px-4 py-20">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-indigo-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-400/50 rounded-full backdrop-blur-sm text-blue-300 text-sm font-semibold hover:bg-blue-500/30 transition-all">
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                Real-Time Climate Intelligence
              </div>
              
              <h1 className="text-6xl md:text-7xl font-black leading-tight tracking-tight">
                <span className="bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                  Monitor Climate
                </span>
                <br />
                <span className="text-white">Threats in Africa</span>
              </h1>
              
              <p className="text-xl text-blue-100/80 leading-relaxed max-w-xl">
                Advanced AI-powered climate monitoring platform. Track extreme weather events, get intelligent alerts, and make data-driven decisions in real-time.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => navigate('/register')}
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold text-lg rounded-xl overflow-hidden shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center gap-2">
                  Start Free
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-4 border-2 border-blue-400/50 text-blue-300 font-bold text-lg rounded-xl hover:bg-blue-500/10 hover:border-blue-300 transition-all duration-300 backdrop-blur-sm"
              >
                Sign In
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-blue-500/30">
              <div className="space-y-2">
                <p className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">50+</p>
                <p className="text-blue-300/70 text-sm font-semibold">Locations</p>
              </div>
              <div className="space-y-2">
                <p className="text-4xl font-black bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">24/7</p>
                <p className="text-blue-300/70 text-sm font-semibold">Monitoring</p>
              </div>
              <div className="space-y-2">
                <p className="text-4xl font-black bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">30-Day</p>
                <p className="text-blue-300/70 text-sm font-semibold">Forecasts</p>
              </div>
            </div>
          </div>

          {/* Right Carousel */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur-2xl opacity-30"></div>
            <div className="relative">
              <ImageCarousel images={heroImages} autoPlayInterval={6000} height="h-96" />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }
        .animate-pulse {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
};
