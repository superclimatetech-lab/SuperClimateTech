import { LandingNavbar } from '../components/Landing/LandingNavbar';
import { Hero } from '../components/Landing/Hero';
import { Features } from '../components/Landing/Features';
import { CallToAction } from '../components/Landing/CallToAction';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <LandingNavbar />
      <Hero />
      <Features />
      <CallToAction />
      
      {/* Footer */}
      <footer className="relative border-t border-blue-500/20 bg-gradient-to-b from-slate-800/50 to-slate-900 px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="text-2xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                SuperTech
              </div>
              <p className="text-blue-300/60 text-sm">Advanced climate monitoring for Africa</p>
            </div>
            <div>
              <h4 className="font-bold text-cyan-300 mb-4">Product</h4>
              <ul className="space-y-2 text-blue-300/70 text-sm">
                <li><a href="#features" className="hover:text-cyan-300 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-cyan-300 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-cyan-300 transition-colors">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-cyan-300 mb-4">Company</h4>
              <ul className="space-y-2 text-blue-300/70 text-sm">
                <li><a href="#" className="hover:text-cyan-300 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-cyan-300 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-cyan-300 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-cyan-300 mb-4">Legal</h4>
              <ul className="space-y-2 text-blue-300/70 text-sm">
                <li><a href="#" className="hover:text-cyan-300 transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-cyan-300 transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-cyan-300 transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-blue-500/20 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-blue-300/50 text-sm">&copy; 2024 SuperTech. All rights reserved.</p>
            <div className="flex gap-6 mt-6 sm:mt-0">
              <a href="#" className="text-blue-300/50 hover:text-cyan-400 transition-colors group">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-7.007 3.748 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
              </a>
              <a href="#" className="text-blue-300/50 hover:text-cyan-400 transition-colors group">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
