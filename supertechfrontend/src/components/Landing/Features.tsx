import { ImageCarousel } from './ImageCarousel';

export const Features = () => {
  const features = [
    {
      title: 'Interactive Climate Map',
      description: 'Visualize weather conditions across Africa with color-coded climate zones',
      images: [
        'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1569163139394-de4798aa62b1?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1489493072403-63c31d77c0eb?w=600&h=400&fit=crop',
      ],
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 003 16.382V5.618a1 1 0 011.553-.894L9 7m0 0l6-4m-6 4v12m6-16v4m0 0l6-4m-6 4v12" />
        </svg>
      ),
    },
    {
      title: 'Heat Wave Detection',
      description: 'Automatically detect extreme heat events with temperatures exceeding 35°C',
      images: [
        'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1532618500077-b8f8794f572e?w=600&h=400&fit=crop',
      ],
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      title: 'Cold Wave Detection',
      description: 'Monitor extreme cold events with temperatures below 10°C',
      images: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1418985991508-e47386173823?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1533450718592-a3a91361715b?w=600&h=400&fit=crop',
      ],
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
    },
    {
      title: 'Short-Term Forecasts',
      description: '1-7 day predictions with hourly climate breakdowns',
      images: [
        'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1494594153288-be4a5c5f6c64?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop',
      ],
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: 'Long-Term Forecasts',
      description: '8-30 day trend analysis and climate predictions',
      images: [
        'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1494594153288-be4a5c5f6c64?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1495507592647-ca2e49ad53b1?w=600&h=400&fit=crop',
      ],
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      title: 'Historical Climate Analysis',
      description: 'Compare current data with 30-day historical climate patterns',
      images: [
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop',
      ],
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Multi-Location Monitoring',
      description: 'Track climate conditions across 50+ African locations simultaneously',
      images: [
        'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1569163139394-de4798aa62b1?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1489493072403-63c31d77c0eb?w=600&h=400&fit=crop',
      ],
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      title: 'Data Export & Reports',
      description: 'Download detailed climate reports in CSV and PDF formats',
      images: [
        'https://images.unsplash.com/photo-1516321318423-f06f70504646?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1516534775068-bb6348b3c22d?w=600&h=400&fit=crop',
      ],
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="features" className="relative py-32 px-4 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Background Accent */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-5xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-blue-500/20 border border-blue-400/50 rounded-full backdrop-blur-sm text-blue-300 text-sm font-semibold">
            <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
            Powerful Features
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-white mb-6">
            Advanced Climate
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Intelligence
            </span>
          </h2>
          <p className="text-xl text-blue-300/70 max-w-2xl mx-auto leading-relaxed">
            Comprehensive tools for monitoring, analyzing, and predicting climate patterns with precision
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative"
            >
              {/* Glow Effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-all duration-500 group-hover:blur-md"></div>
              
              {/* Card */}
              <div className="relative bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-xl border border-slate-600/50 group-hover:border-cyan-400/50 rounded-2xl overflow-hidden transition-all duration-500">
                {/* Carousel */}
                <div className="relative h-48 overflow-hidden rounded-t-2xl">
                  <ImageCarousel images={feature.images} autoPlayInterval={4000} height="h-48" />
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-xl group-hover:from-blue-500 group-hover:to-cyan-500 transition-all duration-300">
                    <div className="text-cyan-400 group-hover:text-white transition-colors">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-blue-300/70 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Hover Effect - Arrow */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
