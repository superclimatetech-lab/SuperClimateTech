import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-gray-50 lg:ml-64">
      {/* Sidebar - fixed on all devices */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Header */}
        <Header />

        {/* Main Content - scrollable */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden w-full">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 pb-20 sm:pb-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
