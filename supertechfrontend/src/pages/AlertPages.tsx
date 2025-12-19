import { DashboardLayout } from '../components/Dashboard/DashboardLayout';
import { AlertList } from '../components/Alerts';

export const HeatWaveAlertsPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-8">🔥 Heat Wave Alerts</h1>
        <AlertList type="heat_wave" />
      </div>
    </DashboardLayout>
  );
};

export const ColdWaveAlertsPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-8">❄️ Cold Wave Alerts</h1>
        <AlertList type="cold_wave" />
      </div>
    </DashboardLayout>
  );
};
