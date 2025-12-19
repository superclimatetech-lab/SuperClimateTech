import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { WeatherProvider } from './context/WeatherContext'
import { LandingPage } from './pages/LandingPage'
import { RegisterPage } from './pages/RegisterPage'
import { LoginPage } from './pages/LoginPage'
import { Dashboard } from './pages/Dashboard'
import { HistoricalDataPage } from './pages/HistoricalDataPage'
import { RealTimeMonitoring } from './pages/RealTimeMonitoring'
import { ShortTermPage } from './pages/ShortTermPage'
import { LongTermPage } from './pages/LongTermPage'
import { HeatWaveAlertsPage, ColdWaveAlertsPage } from './pages/AlertPages'
import './App.css'

function App() {
  const token = localStorage.getItem('auth_token')

  return (
    <WeatherProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/monitoring" element={token ? <RealTimeMonitoring /> : <Navigate to="/login" />} />
          <Route path="/forecast/short-term" element={token ? <ShortTermPage /> : <Navigate to="/login" />} />
          <Route path="/forecast/long-term" element={token ? <LongTermPage /> : <Navigate to="/login" />} />
          <Route path="/alerts/heat-wave" element={token ? <HeatWaveAlertsPage /> : <Navigate to="/login" />} />
          <Route path="/alerts/cold-wave" element={token ? <ColdWaveAlertsPage /> : <Navigate to="/login" />} />
          <Route path="/historical" element={token ? <HistoricalDataPage /> : <Navigate to="/login" />} />
        </Routes>
      </Router>
    </WeatherProvider>
  )
}

export default App
