import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarItem {
  path: string;
  label: string;
  icon: string;
}

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems: SidebarItem[] = [
    { path: '/dashboard', label: 'Overview', icon: '🏠' },
    { path: '/monitoring', label: 'Real-Time Monitoring', icon: '🌡️' },
    { path: '/forecast/short-term', label: 'Short-Term Forecast', icon: '📅' },
    { path: '/forecast/long-term', label: 'Long-Term Forecast', icon: '📈' },
    { path: '/alerts/heat-wave', label: 'Heat Wave Alerts', icon: '🔥' },
    { path: '/alerts/cold-wave', label: 'Cold Wave Alerts', icon: '❄️' },
    { path: '/historical', label: 'Historical Data', icon: '📚' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleNavClick = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Hamburger Button - Only visible on mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden w-12 h-12 flex items-center justify-center bg-orange-600 text-white rounded-full shadow-lg active:scale-95 transition-transform"
        aria-label="Toggle menu"
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar - Desktop fixed left, Mobile overlay */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-gray-900 text-white transition-transform duration-300 overflow-y-auto w-64 ${
          isOpen ? 'translate-x-0 z-40' : '-translate-x-full lg:translate-x-0 lg:z-40'
        }`}
      >
        <div className="p-6 mt-16 lg:mt-0">
          <h1 className="text-2xl font-bold text-orange-500 mb-8">SuperTech</h1>
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all text-base font-medium min-h-[44px] flex items-center gap-3 ${
                  isActive(item.path)
                    ? 'bg-orange-600 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-gray-800 active:bg-gray-700'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Mobile Overlay - only show when sidebar is open */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          aria-hidden="true"
        />
      )}
    </>
  );
};
