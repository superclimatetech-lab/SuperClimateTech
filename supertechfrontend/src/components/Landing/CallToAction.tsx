import { useNavigate } from 'react-router-dom';
import { ImageCarousel } from './ImageCarousel';

export const CallToAction = () => {
  const navigate = useNavigate();

  const ctaImages = [
    'https://images.unsplash.com/photo-1589519160732-57fc498494f8?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1569163139394-de4798aa62b1?w=1200&h=600&fit=crop',
  ];

  return (
    <section id="cta" className="relative py-32 px-4 bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-5xl md:text-7xl font-black leading-tight tracking-tight">
                <span className="text-white">Join Thousands</span>
                <br />
                <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-cyan-400 bg-clip-text text-transparent">
                  Monitoring Africa
                </span>
              </h2>
              
              <p className="text-lg text-blue-100/80 leading-relaxed max-w-xl">
                SuperTech powers climate monitoring for organizations, NGOs, and governments across Africa. Get real-time alerts, predictive analytics, and actionable insights.
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-3">
              {[
                'No credit card required',
                'Setup in 5 minutes',
                '24/7 dedicated support',
                'Unlimited data exports'
              ].map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-slate-900 font-bold" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-blue-100">{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                onClick={() => navigate('/register')}
                className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-lg rounded-xl overflow-hidden shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center gap-2">
                  Start Free Trial
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-4 border-2 border-cyan-400/50 text-blue-300 font-bold text-lg rounded-xl hover:bg-cyan-500/10 hover:border-cyan-300 transition-all duration-300 backdrop-blur-sm"
              >
                Existing Users
              </button>
            </div>
          </div>

          {/* Right Carousel */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur-2xl opacity-30"></div>
            <div className="relative">
              <ImageCarousel images={ctaImages} autoPlayInterval={5000} height="h-96" />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }
        .animate-pulse {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </section>
  );
};
