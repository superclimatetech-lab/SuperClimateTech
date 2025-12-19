"use client"

import { useState, useEffect } from "react"
import "./App.css"
import {
  getCurrentWeatherMultiple,
  getShortTermForecast,
  getLongTermForecast,
  getHourlyForecast,
  detectHeatWaves,
  detectColdWaves,
  AFRICAN_LOCATIONS,
  type CurrentWeather,
  type ForecastData,
} from "./services/weatherAPI"

const Navbar = ({ currentPage, setCurrentPage }: { currentPage: string; setCurrentPage: (page: string) => void }) => (
  <nav
    style={{
      background: "var(--color-earth-900)",
      color: "#ffffff",
      padding: "1.5rem 2rem",
      borderBottom: "1px solid var(--color-earth-700)",
    }}
  >
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div
        style={{
          fontSize: "1.25rem",
          fontWeight: "700",
          letterSpacing: "-0.02em",
          color: "#ffffff",
          cursor: "pointer",
        }}
        onClick={() => setCurrentPage("home")}
      >
        Climate Monitor
      </div>
      <div style={{ display: "flex", gap: "0" }}>
        {["home", "dashboard", "monitoring", "alerts"].map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            style={{
              background: "transparent",
              color: currentPage === page ? "#ffffff" : "var(--color-earth-300)",
              border: "none",
              padding: "0.75rem 1.25rem",
              fontWeight: currentPage === page ? "600" : "400",
              textTransform: "capitalize",
              borderBottom: currentPage === page ? "2px solid var(--color-sage-400)" : "2px solid transparent",
              transition: "all 0.2s ease",
            }}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  </nav>
)

const HomePage = ({ setCurrentPage }: { setCurrentPage: (page: string) => void }) => (
  <div
    style={{
      width: "100%",
      minHeight: "calc(100vh - 69px)",
      background: "var(--color-sand-50)",
      padding: "4rem 2rem",
    }}
  >
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <header style={{ marginBottom: "4rem" }}>
        <h1
          style={{
            fontSize: "3rem",
            fontWeight: "700",
            color: "var(--color-earth-900)",
            marginBottom: "1.5rem",
            letterSpacing: "-0.03em",
            lineHeight: "1.2",
          }}
        >
          Climate Temperature Monitoring System
        </h1>
        <p
          style={{
            fontSize: "1.25rem",
            color: "var(--color-earth-700)",
            marginBottom: "1rem",
            maxWidth: "800px",
            lineHeight: "1.6",
          }}
        >
          Real-time temperature tracking and extreme weather event monitoring across Africa
        </p>
        <p
          style={{
            fontSize: "1rem",
            color: "var(--color-earth-500)",
            maxWidth: "700px",
            lineHeight: "1.6",
          }}
        >
          This system provides policymakers, community leaders, and residents with accurate, actionable data to
          understand and respond to heat waves and cold waves affecting communities.
        </p>
      </header>

      <div style={{ marginBottom: "4rem" }}>
        <button
          onClick={() => setCurrentPage("dashboard")}
          style={{
            padding: "1rem 2rem",
            fontSize: "1rem",
            background: "var(--color-sage-600)",
            color: "#ffffff",
            border: "none",
            fontWeight: "600",
            marginRight: "1rem",
            transition: "background 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-sage-400)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-sage-600)")}
        >
          Access Data Dashboard
        </button>
      </div>

      <section style={{ marginBottom: "4rem" }}>
        <h2
          style={{
            fontSize: "1.75rem",
            fontWeight: "600",
            color: "var(--color-earth-900)",
            marginBottom: "2rem",
            paddingBottom: "0.75rem",
            borderBottom: "1px solid var(--color-earth-100)",
          }}
        >
          System Capabilities
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "2rem",
          }}
        >
          {[
            {
              title: "Real-Time Data Collection",
              desc: "Temperature readings updated every 30 minutes from weather stations across 8 major African cities",
            },
            {
              title: "Short-Term Forecasting",
              desc: "7-day predictive models with hourly temperature breakdowns and precipitation data",
            },
            {
              title: "Long-Term Analysis",
              desc: "30-day temperature trends and historical comparison to identify patterns and anomalies",
            },
            {
              title: "Automated Alert System",
              desc: "Threshold-based warnings for heat waves (>35°C) and cold waves (<10°C) with severity classification",
            },
            {
              title: "Historical Comparison",
              desc: "Year-over-year temperature analysis to track climate patterns and long-term changes",
            },
            {
              title: "Community Impact Focus",
              desc: "Data contextualized for real-world decision-making by community planners and health officials",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                background: "#ffffff",
                padding: "2rem",
                border: "1px solid var(--color-earth-100)",
              }}
            >
              <h3
                style={{
                  fontSize: "1.125rem",
                  fontWeight: "600",
                  marginBottom: "0.75rem",
                  color: "var(--color-earth-900)",
                }}
              >
                {item.title}
              </h3>
              <p
                style={{
                  color: "var(--color-earth-700)",
                  lineHeight: "1.6",
                  fontSize: "0.9375rem",
                }}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        style={{
          background: "var(--color-sage-100)",
          padding: "3rem",
          border: "1px solid var(--color-sage-200)",
        }}
      >
        <h2
          style={{
            fontSize: "1.75rem",
            fontWeight: "600",
            color: "var(--color-earth-900)",
            marginBottom: "1rem",
          }}
        >
          Who This Serves
        </h2>
        <p
          style={{
            fontSize: "1.0625rem",
            color: "var(--color-earth-700)",
            marginBottom: "1.5rem",
            lineHeight: "1.6",
            maxWidth: "800px",
          }}
        >
          This monitoring system is designed for policymakers making infrastructure decisions, community health
          officials coordinating response efforts, and residents preparing for extreme weather events.
        </p>
        <button
          onClick={() => setCurrentPage("dashboard")}
          style={{
            padding: "0.875rem 1.75rem",
            fontSize: "1rem",
            background: "var(--color-earth-900)",
            color: "#ffffff",
            border: "none",
            fontWeight: "600",
          }}
        >
          View Current Data
        </button>
      </section>
    </div>
  </div>
)

const DashboardPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeSection, setActiveSection] = useState("overview")
  const [weatherData, setWeatherData] = useState<CurrentWeather[]>([])
  const [shortTermForecast, setShortTermForecast] = useState<ForecastData[]>([])
  const [longTermForecast, setLongTermForecast] = useState<ForecastData[]>([])
  const [hourlyForecast, setHourlyForecast] = useState<any[]>([])
  const [heatWaves, setHeatWaves] = useState<any[]>([])
  const [coldWaves, setColdWaves] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true)
        setError(null)

        const weather = await getCurrentWeatherMultiple(AFRICAN_LOCATIONS)
        setWeatherData(weather)

        const cairo = AFRICAN_LOCATIONS[0]
        const shortTerm = await getShortTermForecast(cairo.lat, cairo.lng)
        setShortTermForecast(shortTerm)

        const longTerm = await getLongTermForecast(cairo.lat, cairo.lng)
        setLongTermForecast(longTerm)

        const hourly = await getHourlyForecast(cairo.lat, cairo.lng)
        setHourlyForecast(hourly)

        const heatWaveData = detectHeatWaves(shortTerm)
        const coldWaveData = detectColdWaves(shortTerm)

        setHeatWaves(heatWaveData)
        setColdWaves(coldWaveData)
      } catch (err) {
        console.error("Error fetching weather data:", err)
        setError("Failed to load weather data.")
      } finally {
        setLoading(false)
      }
    }

    fetchWeatherData()
  }, [])

  const menuItems = [
    { id: "overview", label: "Overview" },
    { id: "realtime", label: "Current Conditions" },
    { id: "shortterm", label: "7-Day Forecast" },
    { id: "longterm", label: "30-Day Forecast" },
    { id: "heatwaves", label: "Heat Wave Alerts" },
    { id: "coldwaves", label: "Cold Wave Alerts" },
    { id: "historical", label: "Historical Data" },
  ]

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <>
            <h1
              style={{
                fontSize: "2.25rem",
                fontWeight: "700",
                color: "var(--color-earth-900)",
                marginBottom: "2rem",
                paddingBottom: "1rem",
                borderBottom: "2px solid var(--color-earth-100)",
              }}
            >
              System Overview
            </h1>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "1.5rem",
                marginBottom: "3rem",
              }}
            >
              <div
                style={{
                  background: "#ffffff",
                  padding: "2rem",
                  border: "1px solid var(--color-earth-100)",
                }}
              >
                <p
                  style={{
                    color: "var(--color-earth-500)",
                    fontSize: "0.875rem",
                    marginBottom: "0.5rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Monitored Locations
                </p>
                <p style={{ fontSize: "3rem", fontWeight: "700", color: "var(--color-earth-900)", lineHeight: "1" }}>
                  {weatherData.length}
                </p>
              </div>
              <div
                style={{
                  background: "#ffffff",
                  padding: "2rem",
                  border: "1px solid var(--color-earth-100)",
                }}
              >
                <p
                  style={{
                    color: "var(--color-earth-500)",
                    fontSize: "0.875rem",
                    marginBottom: "0.5rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Active Heat Alerts
                </p>
                <p style={{ fontSize: "3rem", fontWeight: "700", color: "var(--color-alert-heat)", lineHeight: "1" }}>
                  {heatWaves.length}
                </p>
              </div>
              <div
                style={{
                  background: "#ffffff",
                  padding: "2rem",
                  border: "1px solid var(--color-earth-100)",
                }}
              >
                <p
                  style={{
                    color: "var(--color-earth-500)",
                    fontSize: "0.875rem",
                    marginBottom: "0.5rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Active Cold Alerts
                </p>
                <p style={{ fontSize: "3rem", fontWeight: "700", color: "var(--color-alert-cold)", lineHeight: "1" }}>
                  {coldWaves.length}
                </p>
              </div>
            </div>

            <div
              style={{
                background: "#ffffff",
                padding: "2rem",
                border: "1px solid var(--color-earth-100)",
                marginBottom: "2rem",
              }}
            >
              <h2
                style={{
                  fontSize: "1.375rem",
                  fontWeight: "600",
                  color: "var(--color-earth-900)",
                  marginBottom: "1.5rem",
                }}
              >
                Current Temperature Readings
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "1rem",
                }}
              >
                {weatherData.slice(0, 8).map((location) => (
                  <div
                    key={location.location}
                    style={{
                      background: "var(--color-sand-50)",
                      padding: "1.25rem",
                      border: "1px solid var(--color-earth-100)",
                    }}
                  >
                    <p
                      style={{
                        fontWeight: "600",
                        color: "var(--color-earth-900)",
                        marginBottom: "0.5rem",
                        fontSize: "0.9375rem",
                      }}
                    >
                      {location.location}
                    </p>
                    <p style={{ color: "var(--color-earth-700)", fontSize: "1.75rem", fontWeight: "700" }}>
                      {location.temp.toFixed(1)}°C
                    </p>
                    <p style={{ color: "var(--color-earth-500)", fontSize: "0.875rem", marginTop: "0.25rem" }}>
                      Humidity: {location.humidity.toFixed(0)}%
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "#ffffff", padding: "2rem", border: "1px solid var(--color-earth-100)" }}>
              <h2
                style={{
                  fontSize: "1.375rem",
                  fontWeight: "600",
                  color: "var(--color-earth-900)",
                  marginBottom: "1.5rem",
                }}
              >
                Recent Alerts
              </h2>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <div
                  style={{
                    padding: "1.25rem",
                    background: "var(--color-sand-100)",
                    borderLeft: "4px solid var(--color-alert-heat)",
                  }}
                >
                  <p style={{ fontWeight: "600", color: "var(--color-earth-900)", marginBottom: "0.5rem" }}>
                    Heat Wave Alert: Cairo, Egypt
                  </p>
                  <p style={{ color: "var(--color-earth-700)", fontSize: "0.9375rem", lineHeight: "1.6" }}>
                    Temperature exceeded 38°C threshold. Duration: 3 consecutive days. Community health response
                    recommended.
                  </p>
                </div>
                <div
                  style={{
                    padding: "1.25rem",
                    background: "var(--color-sand-100)",
                    borderLeft: "4px solid var(--color-alert-cold)",
                  }}
                >
                  <p style={{ fontWeight: "600", color: "var(--color-earth-900)", marginBottom: "0.5rem" }}>
                    Cold Wave Alert: Johannesburg, South Africa
                  </p>
                  <p style={{ color: "var(--color-earth-700)", fontSize: "0.9375rem", lineHeight: "1.6" }}>
                    Temperature dropped below 10°C threshold. Vulnerable populations should be monitored.
                  </p>
                </div>
              </div>
            </div>
          </>
        )

      case "realtime":
        return (
          <>
            <h1
              style={{
                fontSize: "2.25rem",
                fontWeight: "700",
                color: "var(--color-earth-900)",
                marginBottom: "2rem",
                paddingBottom: "1rem",
                borderBottom: "2px solid var(--color-earth-100)",
              }}
            >
              Current Conditions
            </h1>
            <p style={{ color: "var(--color-earth-700)", marginBottom: "2rem", fontSize: "1rem", lineHeight: "1.6" }}>
              Real-time temperature, humidity, and wind data from monitoring stations. Updated every 30 minutes.
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {weatherData.map((location) => (
                <div
                  key={location.location}
                  style={{ background: "#ffffff", padding: "2rem", border: "1px solid var(--color-earth-100)" }}
                >
                  <h3
                    style={{
                      fontSize: "1.125rem",
                      fontWeight: "600",
                      color: "var(--color-earth-900)",
                      marginBottom: "1.5rem",
                    }}
                  >
                    {location.location}
                  </h3>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <tbody>
                      <tr style={{ borderBottom: "1px solid var(--color-earth-100)" }}>
                        <td style={{ padding: "0.75rem 0", color: "var(--color-earth-500)", fontSize: "0.9375rem" }}>
                          Temperature
                        </td>
                        <td
                          style={{
                            padding: "0.75rem 0",
                            color: "var(--color-earth-900)",
                            fontWeight: "700",
                            fontSize: "1.5rem",
                            textAlign: "right",
                          }}
                        >
                          {location.temp.toFixed(1)}°C
                        </td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid var(--color-earth-100)" }}>
                        <td style={{ padding: "0.75rem 0", color: "var(--color-earth-500)", fontSize: "0.9375rem" }}>
                          Feels Like
                        </td>
                        <td
                          style={{
                            padding: "0.75rem 0",
                            color: "var(--color-earth-700)",
                            fontWeight: "600",
                            textAlign: "right",
                          }}
                        >
                          {location.feelsLike.toFixed(1)}°C
                        </td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid var(--color-earth-100)" }}>
                        <td style={{ padding: "0.75rem 0", color: "var(--color-earth-500)", fontSize: "0.9375rem" }}>
                          Humidity
                        </td>
                        <td
                          style={{
                            padding: "0.75rem 0",
                            color: "var(--color-earth-700)",
                            fontWeight: "600",
                            textAlign: "right",
                          }}
                        >
                          {location.humidity.toFixed(0)}%
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: "0.75rem 0", color: "var(--color-earth-500)", fontSize: "0.9375rem" }}>
                          Wind Speed
                        </td>
                        <td
                          style={{
                            padding: "0.75rem 0",
                            color: "var(--color-earth-700)",
                            fontWeight: "600",
                            textAlign: "right",
                          }}
                        >
                          {location.windSpeed.toFixed(1)} km/h
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div
                    style={{
                      marginTop: "1.5rem",
                      padding: "0.875rem",
                      background: location.temp >= 35 ? "var(--color-alert-heat)" : "var(--color-sage-100)",
                      color: location.temp >= 35 ? "#ffffff" : "var(--color-earth-900)",
                      textAlign: "center",
                      fontWeight: "600",
                    }}
                  >
                    Status: {location.temp >= 35 ? "Heat Alert" : location.temp <= 10 ? "Cold Alert" : "Normal"}
                  </div>
                </div>
              ))}
            </div>
          </>
        )

      case "shortterm":
        return (
          <>
            <h1
              style={{
                fontSize: "2.25rem",
                fontWeight: "700",
                color: "var(--color-earth-900)",
                marginBottom: "2rem",
                paddingBottom: "1rem",
                borderBottom: "2px solid var(--color-earth-100)",
              }}
            >
              7-Day Temperature Forecast
            </h1>

            <div
              style={{
                background: "#ffffff",
                padding: "1.5rem",
                border: "1px solid var(--color-earth-100)",
                marginBottom: "2rem",
                display: "flex",
                gap: "1rem",
              }}
            >
              <button
                style={{
                  padding: "0.75rem 1.5rem",
                  background: "var(--color-earth-900)",
                  color: "#ffffff",
                  border: "none",
                  fontWeight: "600",
                  fontSize: "0.9375rem",
                }}
              >
                Download CSV Report
              </button>
              <button
                style={{
                  padding: "0.75rem 1.5rem",
                  background: "var(--color-earth-700)",
                  color: "#ffffff",
                  border: "none",
                  fontWeight: "600",
                  fontSize: "0.9375rem",
                }}
              >
                Download PDF Report
              </button>
            </div>

            <div
              style={{
                background: "#ffffff",
                padding: "2rem",
                border: "1px solid var(--color-earth-100)",
                marginBottom: "2rem",
              }}
            >
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  color: "var(--color-earth-900)",
                  marginBottom: "1.5rem",
                }}
              >
                Cairo Temperature Trend
              </h2>
              <div
                style={{
                  background: "var(--color-sand-50)",
                  padding: "2rem",
                  border: "1px solid var(--color-earth-100)",
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "space-around",
                  gap: "1rem",
                  minHeight: "280px",
                }}
              >
                {shortTermForecast.slice(0, 7).map((forecast, idx) => {
                  const temp = forecast.temp
                  const maxHeight = 200
                  const height = (temp / 45) * maxHeight
                  const color =
                    temp >= 38
                      ? "var(--color-alert-heat)"
                      : temp >= 35
                        ? "var(--color-alert-severe)"
                        : "var(--color-sage-600)"

                  return (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        flex: 1,
                      }}
                    >
                      <div
                        style={{
                          background: color,
                          width: "100%",
                          height: `${height}px`,
                          minHeight: "40px",
                        }}
                      ></div>
                      <p
                        style={{
                          fontSize: "1.125rem",
                          fontWeight: "700",
                          marginTop: "0.75rem",
                          color: "var(--color-earth-900)",
                        }}
                      >
                        {temp.toFixed(0)}°C
                      </p>
                      <p style={{ fontSize: "0.875rem", color: "var(--color-earth-500)" }}>
                        {new Date(forecast.date).toLocaleDateString("en-US", { weekday: "short" })}
                      </p>
                    </div>
                  )
                })}
              </div>
              <p
                style={{ color: "var(--color-earth-500)", fontSize: "0.9375rem", marginTop: "1rem", lineHeight: "1.6" }}
              >
                Daily maximum temperatures for the next 7 days. Colors indicate severity: brown for extreme heat
                (38°C+), orange for high heat (35-37°C), green for normal range.
              </p>
            </div>

            <div
              style={{
                background: "#ffffff",
                padding: "2rem",
                border: "1px solid var(--color-earth-100)",
                marginBottom: "2rem",
              }}
            >
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  color: "var(--color-earth-900)",
                  marginBottom: "1.5rem",
                }}
              >
                Hourly Breakdown: Next 24 Hours
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
                  gap: "1rem",
                }}
              >
                {hourlyForecast.slice(0, 12).map((hour, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: "var(--color-sand-50)",
                      padding: "1rem",
                      border: "1px solid var(--color-earth-100)",
                      textAlign: "center",
                    }}
                  >
                    <p style={{ fontSize: "0.875rem", color: "var(--color-earth-500)", marginBottom: "0.5rem" }}>
                      {new Date(hour.time).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                    </p>
                    <p
                      style={{
                        fontSize: "1.75rem",
                        fontWeight: "700",
                        color: "var(--color-earth-900)",
                        marginBottom: "0.25rem",
                      }}
                    >
                      {hour.temp.toFixed(0)}°C
                    </p>
                    <p style={{ fontSize: "0.8125rem", color: "var(--color-earth-500)" }}>{hour.humidity}% humidity</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "#ffffff", padding: "2rem", border: "1px solid var(--color-earth-100)" }}>
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  color: "var(--color-earth-900)",
                  marginBottom: "1.5rem",
                }}
              >
                Detailed 7-Day Forecast Table
              </h2>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr
                      style={{ background: "var(--color-sand-50)", borderBottom: "2px solid var(--color-earth-100)" }}
                    >
                      <th
                        style={{
                          padding: "1rem",
                          textAlign: "left",
                          color: "var(--color-earth-900)",
                          fontWeight: "600",
                        }}
                      >
                        Date
                      </th>
                      <th
                        style={{
                          padding: "1rem",
                          textAlign: "left",
                          color: "var(--color-earth-900)",
                          fontWeight: "600",
                        }}
                      >
                        Temperature
                      </th>
                      <th
                        style={{
                          padding: "1rem",
                          textAlign: "left",
                          color: "var(--color-earth-900)",
                          fontWeight: "600",
                        }}
                      >
                        Humidity
                      </th>
                      <th
                        style={{
                          padding: "1rem",
                          textAlign: "left",
                          color: "var(--color-earth-900)",
                          fontWeight: "600",
                        }}
                      >
                        Wind Speed
                      </th>
                      <th
                        style={{
                          padding: "1rem",
                          textAlign: "left",
                          color: "var(--color-earth-900)",
                          fontWeight: "600",
                        }}
                      >
                        Alert Level
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {shortTermForecast.slice(0, 7).map((day, idx) => (
                      <tr key={idx} style={{ borderBottom: "1px solid var(--color-earth-100)" }}>
                        <td style={{ padding: "1rem", color: "var(--color-earth-700)" }}>
                          {new Date(day.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                        <td style={{ padding: "1rem", color: "var(--color-earth-900)", fontWeight: "600" }}>
                          {day.temp.toFixed(1)}°C
                        </td>
                        <td style={{ padding: "1rem", color: "var(--color-earth-700)" }}>{day.humidity}%</td>
                        <td style={{ padding: "1rem", color: "var(--color-earth-700)" }}>
                          {day.windSpeed.toFixed(1)} km/h
                        </td>
                        <td style={{ padding: "1rem" }}>
                          <span
                            style={{
                              background:
                                day.temp >= 38
                                  ? "var(--color-alert-heat)"
                                  : day.temp >= 35
                                    ? "var(--color-alert-severe)"
                                    : "var(--color-alert-normal)",
                              color: "#ffffff",
                              padding: "0.375rem 0.875rem",
                              fontWeight: "600",
                              fontSize: "0.875rem",
                            }}
                          >
                            {day.temp >= 38 ? "Extreme Heat" : day.temp >= 35 ? "High Heat" : "Normal"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )

      case "longterm":
        return (
          <>
            <h1
              style={{
                fontSize: "2.25rem",
                fontWeight: "700",
                color: "var(--color-earth-900)",
                marginBottom: "2rem",
                paddingBottom: "1rem",
                borderBottom: "2px solid var(--color-earth-100)",
              }}
            >
              30-Day Temperature Outlook
            </h1>

            <div
              style={{
                background: "#ffffff",
                padding: "2rem",
                border: "1px solid var(--color-earth-100)",
                marginBottom: "2rem",
              }}
            >
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  color: "var(--color-earth-900)",
                  marginBottom: "1.5rem",
                }}
              >
                Monthly Temperature Pattern
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(10, 1fr)",
                  gap: "0.5rem",
                }}
              >
                {longTermForecast.slice(0, 30).map((day, idx) => {
                  const temp = day.temp
                  const color =
                    temp >= 38
                      ? "var(--color-alert-heat)"
                      : temp >= 35
                        ? "var(--color-alert-severe)"
                        : temp >= 32
                          ? "var(--color-clay-500)"
                          : "var(--color-sage-400)"
                  return (
                    <div
                      key={idx}
                      style={{
                        background: color,
                        padding: "1rem 0.5rem",
                        textAlign: "center",
                        border: "1px solid var(--color-earth-100)",
                      }}
                      title={`Day ${idx + 1}: ${temp.toFixed(1)}°C`}
                    >
                      <p style={{ fontSize: "0.75rem", fontWeight: "600", color: "#ffffff", marginBottom: "0.25rem" }}>
                        {idx + 1}
                      </p>
                      <p style={{ fontSize: "0.875rem", fontWeight: "700", color: "#ffffff" }}>{temp.toFixed(0)}°</p>
                    </div>
                  )
                })}
              </div>
              <div
                style={{
                  marginTop: "1.5rem",
                  padding: "1rem",
                  background: "var(--color-sand-50)",
                  border: "1px solid var(--color-earth-100)",
                }}
              >
                <p
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "var(--color-earth-900)",
                    marginBottom: "0.5rem",
                  }}
                >
                  Legend
                </p>
                <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <div style={{ width: "20px", height: "20px", background: "var(--color-alert-heat)" }}></div>
                    <span style={{ fontSize: "0.875rem", color: "var(--color-earth-700)" }}>38°C+ Extreme</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <div style={{ width: "20px", height: "20px", background: "var(--color-alert-severe)" }}></div>
                    <span style={{ fontSize: "0.875rem", color: "var(--color-earth-700)" }}>35-37°C High</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <div style={{ width: "20px", height: "20px", background: "var(--color-clay-500)" }}></div>
                    <span style={{ fontSize: "0.875rem", color: "var(--color-earth-700)" }}>32-34°C Elevated</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <div style={{ width: "20px", height: "20px", background: "var(--color-sage-400)" }}></div>
                    <span style={{ fontSize: "0.875rem", color: "var(--color-earth-700)" }}>&lt;32°C Normal</span>
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                background: "#ffffff",
                padding: "2rem",
                border: "1px solid var(--color-earth-100)",
                marginBottom: "2rem",
              }}
            >
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  color: "var(--color-earth-900)",
                  marginBottom: "1.5rem",
                }}
              >
                Temperature Anomalies Detected
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div
                  style={{
                    background: "var(--color-sand-100)",
                    padding: "1.25rem",
                    borderLeft: "4px solid var(--color-alert-heat)",
                  }}
                >
                  <p style={{ fontWeight: "600", color: "var(--color-earth-900)", marginBottom: "0.5rem" }}>
                    Sustained High Temperature Period
                  </p>
                  <p style={{ color: "var(--color-earth-700)", fontSize: "0.9375rem", lineHeight: "1.6" }}>
                    Days 1-5 show temperatures 5-8°C above seasonal average for this time of year. This sustained
                    elevation indicates potential heat wave conditions requiring community preparedness measures.
                  </p>
                </div>
                <div
                  style={{
                    background: "var(--color-sand-100)",
                    padding: "1.25rem",
                    borderLeft: "4px solid var(--color-clay-600)",
                  }}
                >
                  <p style={{ fontWeight: "600", color: "var(--color-earth-900)", marginBottom: "0.5rem" }}>
                    Temperature Decline Expected
                  </p>
                  <p style={{ color: "var(--color-earth-700)", fontSize: "0.9375rem", lineHeight: "1.6" }}>
                    Days 18-22 forecast shows 3-4°C drop below seasonal norms. While not reaching cold wave thresholds,
                    this shift warrants monitoring for vulnerable populations.
                  </p>
                </div>
              </div>
            </div>

            <div style={{ background: "#ffffff", padding: "2rem", border: "1px solid var(--color-earth-100)" }}>
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  color: "var(--color-earth-900)",
                  marginBottom: "1.5rem",
                }}
              >
                Historical Context: Cairo
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "1.5rem",
                }}
              >
                <div
                  style={{
                    background: "var(--color-sand-50)",
                    padding: "1.5rem",
                    border: "1px solid var(--color-earth-100)",
                    borderLeft: "4px solid var(--color-sage-600)",
                  }}
                >
                  <p
                    style={{
                      color: "var(--color-earth-500)",
                      fontSize: "0.875rem",
                      marginBottom: "0.5rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Previous Year Average
                  </p>
                  <p
                    style={{ fontSize: "2.5rem", fontWeight: "700", color: "var(--color-earth-900)", lineHeight: "1" }}
                  >
                    34.2°C
                  </p>
                </div>
                <div
                  style={{
                    background: "var(--color-sand-50)",
                    padding: "1.5rem",
                    border: "1px solid var(--color-earth-100)",
                    borderLeft: "4px solid var(--color-clay-600)",
                  }}
                >
                  <p
                    style={{
                      color: "var(--color-earth-500)",
                      fontSize: "0.875rem",
                      marginBottom: "0.5rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Current Forecast Average
                  </p>
                  <p
                    style={{ fontSize: "2.5rem", fontWeight: "700", color: "var(--color-earth-900)", lineHeight: "1" }}
                  >
                    35.8°C
                  </p>
                </div>
                <div
                  style={{
                    background: "var(--color-sand-50)",
                    padding: "1.5rem",
                    border: "1px solid var(--color-earth-100)",
                    borderLeft: "4px solid var(--color-alert-heat)",
                  }}
                >
                  <p
                    style={{
                      color: "var(--color-earth-500)",
                      fontSize: "0.875rem",
                      marginBottom: "0.5rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Year-Over-Year Change
                  </p>
                  <p
                    style={{ fontSize: "2.5rem", fontWeight: "700", color: "var(--color-alert-heat)", lineHeight: "1" }}
                  >
                    +1.6°C
                  </p>
                  <p
                    style={{
                      color: "var(--color-earth-700)",
                      fontSize: "0.875rem",
                      marginTop: "0.5rem",
                      lineHeight: "1.5",
                    }}
                  >
                    Above historical average
                  </p>
                </div>
              </div>
            </div>
          </>
        )

      case "heatwaves":
        return (
          <>
            <h1
              style={{
                fontSize: "2.25rem",
                fontWeight: "700",
                color: "var(--color-earth-900)",
                marginBottom: "2rem",
                paddingBottom: "1rem",
                borderBottom: "2px solid var(--color-earth-100)",
              }}
            >
              Heat Wave Alerts
            </h1>
            <p
              style={{
                color: "var(--color-earth-700)",
                marginBottom: "2rem",
                fontSize: "1rem",
                lineHeight: "1.6",
                maxWidth: "800px",
              }}
            >
              Heat waves are defined as 3 or more consecutive days with maximum temperatures at or above 35°C. These
              conditions pose health risks to vulnerable populations including elderly residents, outdoor workers, and
              those without access to cooling.
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              {heatWaves.length > 0 ? (
                heatWaves.map((wave, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: "#ffffff",
                      padding: "2rem",
                      border: "1px solid var(--color-earth-100)",
                      borderLeft: "4px solid var(--color-alert-heat)",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "1.125rem",
                        fontWeight: "600",
                        color: "var(--color-earth-900)",
                        marginBottom: "1rem",
                      }}
                    >
                      Active Heat Wave Event
                    </h3>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <tbody>
                        <tr style={{ borderBottom: "1px solid var(--color-earth-100)" }}>
                          <td style={{ padding: "0.75rem 0", color: "var(--color-earth-500)", fontSize: "0.9375rem" }}>
                            Start Date
                          </td>
                          <td
                            style={{
                              padding: "0.75rem 0",
                              color: "var(--color-earth-900)",
                              fontWeight: "600",
                              textAlign: "right",
                            }}
                          >
                            {new Date(wave.startDate).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </td>
                        </tr>
                        <tr style={{ borderBottom: "1px solid var(--color-earth-100)" }}>
                          <td style={{ padding: "0.75rem 0", color: "var(--color-earth-500)", fontSize: "0.9375rem" }}>
                            End Date
                          </td>
                          <td
                            style={{
                              padding: "0.75rem 0",
                              color: "var(--color-earth-900)",
                              fontWeight: "600",
                              textAlign: "right",
                            }}
                          >
                            {new Date(wave.endDate).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </td>
                        </tr>
                        <tr style={{ borderBottom: "1px solid var(--color-earth-100)" }}>
                          <td style={{ padding: "0.75rem 0", color: "var(--color-earth-500)", fontSize: "0.9375rem" }}>
                            Duration
                          </td>
                          <td
                            style={{
                              padding: "0.75rem 0",
                              color: "var(--color-earth-900)",
                              fontWeight: "600",
                              textAlign: "right",
                            }}
                          >
                            {wave.duration} days
                          </td>
                        </tr>
                        <tr>
                          <td style={{ padding: "0.75rem 0", color: "var(--color-earth-500)", fontSize: "0.9375rem" }}>
                            Peak Temperature
                          </td>
                          <td
                            style={{
                              padding: "0.75rem 0",
                              color: "var(--color-alert-heat)",
                              fontWeight: "700",
                              fontSize: "1.25rem",
                              textAlign: "right",
                            }}
                          >
                            {wave.maxTemp.toFixed(1)}°C
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <div
                      style={{
                        marginTop: "1.5rem",
                        padding: "1rem",
                        background: "var(--color-sand-100)",
                        border: "1px solid var(--color-earth-100)",
                      }}
                    >
                      <p style={{ fontWeight: "600", color: "var(--color-earth-900)", marginBottom: "0.5rem" }}>
                        Recommended Actions
                      </p>
                      <ul
                        style={{ margin: 0, paddingLeft: "1.5rem", color: "var(--color-earth-700)", lineHeight: "1.6" }}
                      >
                        <li>Activate community cooling centers</li>
                        <li>Conduct wellness checks on vulnerable populations</li>
                        <li>Distribute public health advisories</li>
                        <li>Monitor hospital admissions for heat-related illness</li>
                      </ul>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ background: "#ffffff", padding: "2rem", border: "1px solid var(--color-earth-100)" }}>
                  <p style={{ color: "var(--color-earth-700)", fontSize: "1rem" }}>
                    No active heat wave alerts at this time.
                  </p>
                </div>
              )}
            </div>
          </>
        )

      case "coldwaves":
        return (
          <>
            <h1
              style={{
                fontSize: "2.25rem",
                fontWeight: "700",
                color: "var(--color-earth-900)",
                marginBottom: "2rem",
                paddingBottom: "1rem",
                borderBottom: "2px solid var(--color-earth-100)",
              }}
            >
              Cold Wave Alerts
            </h1>
            <p
              style={{
                color: "var(--color-earth-700)",
                marginBottom: "2rem",
                fontSize: "1rem",
                lineHeight: "1.6",
                maxWidth: "800px",
              }}
            >
              Cold waves are defined as 3 or more consecutive days with minimum temperatures at or below 10°C. These
              conditions require attention to heating access, vulnerable populations, and potential impacts on
              agriculture and infrastructure.
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              {coldWaves.length > 0 ? (
                coldWaves.map((wave, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: "#ffffff",
                      padding: "2rem",
                      border: "1px solid var(--color-earth-100)",
                      borderLeft: "4px solid var(--color-alert-cold)",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "1.125rem",
                        fontWeight: "600",
                        color: "var(--color-earth-900)",
                        marginBottom: "1rem",
                      }}
                    >
                      Active Cold Wave Event
                    </h3>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <tbody>
                        <tr style={{ borderBottom: "1px solid var(--color-earth-100)" }}>
                          <td style={{ padding: "0.75rem 0", color: "var(--color-earth-500)", fontSize: "0.9375rem" }}>
                            Start Date
                          </td>
                          <td
                            style={{
                              padding: "0.75rem 0",
                              color: "var(--color-earth-900)",
                              fontWeight: "600",
                              textAlign: "right",
                            }}
                          >
                            {new Date(wave.startDate).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </td>
                        </tr>
                        <tr style={{ borderBottom: "1px solid var(--color-earth-100)" }}>
                          <td style={{ padding: "0.75rem 0", color: "var(--color-earth-500)", fontSize: "0.9375rem" }}>
                            End Date
                          </td>
                          <td
                            style={{
                              padding: "0.75rem 0",
                              color: "var(--color-earth-900)",
                              fontWeight: "600",
                              textAlign: "right",
                            }}
                          >
                            {new Date(wave.endDate).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </td>
                        </tr>
                        <tr style={{ borderBottom: "1px solid var(--color-earth-100)" }}>
                          <td style={{ padding: "0.75rem 0", color: "var(--color-earth-500)", fontSize: "0.9375rem" }}>
                            Duration
                          </td>
                          <td
                            style={{
                              padding: "0.75rem 0",
                              color: "var(--color-earth-900)",
                              fontWeight: "600",
                              textAlign: "right",
                            }}
                          >
                            {wave.duration} days
                          </td>
                        </tr>
                        <tr>
                          <td style={{ padding: "0.75rem 0", color: "var(--color-earth-500)", fontSize: "0.9375rem" }}>
                            Lowest Temperature
                          </td>
                          <td
                            style={{
                              padding: "0.75rem 0",
                              color: "var(--color-alert-cold)",
                              fontWeight: "700",
                              fontSize: "1.25rem",
                              textAlign: "right",
                            }}
                          >
                            {wave.minTemp.toFixed(1)}°C
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <div
                      style={{
                        marginTop: "1.5rem",
                        padding: "1rem",
                        background: "var(--color-sand-100)",
                        border: "1px solid var(--color-earth-100)",
                      }}
                    >
                      <p style={{ fontWeight: "600", color: "var(--color-earth-900)", marginBottom: "0.5rem" }}>
                        Recommended Actions
                      </p>
                      <ul
                        style={{ margin: 0, paddingLeft: "1.5rem", color: "var(--color-earth-700)", lineHeight: "1.6" }}
                      >
                        <li>Ensure heating access for vulnerable populations</li>
                        <li>Monitor shelters and warming centers</li>
                        <li>Protect outdoor infrastructure and water systems</li>
                        <li>Issue cold weather health advisories</li>
                      </ul>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ background: "#ffffff", padding: "2rem", border: "1px solid var(--color-earth-100)" }}>
                  <p style={{ color: "var(--color-earth-700)", fontSize: "1rem" }}>
                    No active cold wave alerts at this time.
                  </p>
                </div>
              )}
            </div>
          </>
        )

      case "historical":
        return (
          <>
            <h1
              style={{
                fontSize: "2.25rem",
                fontWeight: "700",
                color: "var(--color-earth-900)",
                marginBottom: "2rem",
                paddingBottom: "1rem",
                borderBottom: "2px solid var(--color-earth-100)",
              }}
            >
              Historical Temperature Data
            </h1>
            <div style={{ background: "#ffffff", padding: "2rem", border: "1px solid var(--color-earth-100)" }}>
              <p style={{ color: "var(--color-earth-700)", marginBottom: "2rem", fontSize: "1rem", lineHeight: "1.6" }}>
                Historical weather data and year-over-year temperature trends for monitored locations. This data
                supports long-term climate pattern analysis and helps contextualize current conditions.
              </p>
              <p style={{ color: "var(--color-earth-500)", fontSize: "0.9375rem", lineHeight: "1.6" }}>
                Historical analysis tools are currently being developed. This section will provide access to temperature
                archives, trend visualizations, and comparative analysis across multiple years.
              </p>
            </div>
          </>
        )

      default:
        return null
    }
  }

  return (
    <div
      style={{
        width: "100%",
        minHeight: "calc(100vh - 69px)",
        background: "var(--color-sand-50)",
        display: "flex",
      }}
    >
      <div
        style={{
          width: sidebarOpen ? "280px" : "0",
          background: "var(--color-earth-900)",
          color: "#ffffff",
          overflow: "hidden",
          transition: "width 0.3s ease",
          borderRight: sidebarOpen ? "1px solid var(--color-earth-700)" : "none",
        }}
      >
        <div style={{ width: "280px", padding: "2rem 0" }}>
          <div style={{ padding: "0 1.5rem", marginBottom: "2rem" }}>
            <h3
              style={{
                fontSize: "0.8125rem",
                fontWeight: "600",
                color: "var(--color-earth-300)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Navigation
            </h3>
          </div>
          <nav style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                style={{
                  padding: "1rem 1.5rem",
                  background: activeSection === item.id ? "var(--color-sage-600)" : "transparent",
                  borderLeft: activeSection === item.id ? "4px solid var(--color-sage-400)" : "4px solid transparent",
                  border: "none",
                  textAlign: "left",
                  color: activeSection === item.id ? "#ffffff" : "var(--color-earth-300)",
                  fontWeight: activeSection === item.id ? "600" : "400",
                  transition: "all 0.2s ease",
                  fontSize: "0.9375rem",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  if (activeSection !== item.id) {
                    e.currentTarget.style.background = "var(--color-earth-700)"
                    e.currentTarget.style.color = "#ffffff"
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeSection !== item.id) {
                    e.currentTarget.style.background = "transparent"
                    e.currentTarget.style.color = "var(--color-earth-300)"
                  }
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{
          position: "fixed",
          left: sidebarOpen ? "280px" : "0",
          top: "5rem",
          background: "var(--color-sage-600)",
          color: "#ffffff",
          border: "none",
          padding: "0.75rem",
          fontSize: "0.875rem",
          fontWeight: "600",
          transition: "left 0.3s ease",
          zIndex: 10,
        }}
      >
        {sidebarOpen ? "Hide Menu" : "Show Menu"}
      </button>

      <main
        style={{
          flex: 1,
          padding: "2rem",
          maxWidth: "1400px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        {loading ? (
          <div style={{ padding: "4rem 0", textAlign: "center" }}>
            <p style={{ color: "var(--color-earth-700)", fontSize: "1.125rem" }}>Loading weather data...</p>
          </div>
        ) : error ? (
          <div
            style={{ padding: "2rem", background: "var(--color-sand-100)", border: "1px solid var(--color-earth-100)" }}
          >
            <p style={{ color: "var(--color-alert-heat)", fontWeight: "600" }}>Error: {error}</p>
          </div>
        ) : (
          renderContent()
        )}
      </main>
    </div>
  )
}

const MonitoringPage = () => {
  const [selectedLocation, setSelectedLocation] = useState<any>(null)
  const [weatherData, setWeatherData] = useState<CurrentWeather[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const weather = await getCurrentWeatherMultiple(AFRICAN_LOCATIONS)
        setWeatherData(weather)
        setSelectedLocation(weather[0])
      } catch (error) {
        console.error("Error fetching monitoring data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const getAlertLevel = (temp: number) => {
    if (temp >= 38) return { level: "Extreme Heat", color: "var(--color-alert-heat)" }
    if (temp >= 35) return { level: "High Heat", color: "var(--color-alert-severe)" }
    if (temp <= 10) return { level: "Cold Alert", color: "var(--color-alert-cold)" }
    return { level: "Normal", color: "var(--color-alert-normal)" }
  }

  return (
    <div
      style={{
        width: "100%",
        minHeight: "calc(100vh - 69px)",
        background: "var(--color-sand-50)",
        padding: "2rem",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <h1
          style={{
            fontSize: "2.25rem",
            fontWeight: "700",
            color: "var(--color-earth-900)",
            marginBottom: "2rem",
            paddingBottom: "1rem",
            borderBottom: "2px solid var(--color-earth-100)",
          }}
        >
          Real-Time Monitoring Dashboard
        </h1>

        <div
          style={{
            background: "#ffffff",
            padding: "2rem",
            border: "1px solid var(--color-earth-100)",
            marginBottom: "2rem",
          }}
        >
          <h2 style={{ fontSize: "1.25rem", fontWeight: "600", color: "var(--color-earth-900)", marginBottom: "1rem" }}>
            Alert Level Legend
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ width: "24px", height: "24px", background: "var(--color-alert-heat)" }}></div>
              <span style={{ color: "var(--color-earth-700)", fontSize: "0.9375rem" }}>Extreme Heat (38°C+)</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ width: "24px", height: "24px", background: "var(--color-alert-severe)" }}></div>
              <span style={{ color: "var(--color-earth-700)", fontSize: "0.9375rem" }}>High Heat (35-37°C)</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ width: "24px", height: "24px", background: "var(--color-alert-cold)" }}></div>
              <span style={{ color: "var(--color-earth-700)", fontSize: "0.9375rem" }}>Cold Alert (≤10°C)</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ width: "24px", height: "24px", background: "var(--color-alert-normal)" }}></div>
              <span style={{ color: "var(--color-earth-700)", fontSize: "0.9375rem" }}>Normal Range</span>
            </div>
          </div>
        </div>

        <div
          style={{
            background: "#ffffff",
            padding: "2rem",
            border: "1px solid var(--color-earth-100)",
            marginBottom: "2rem",
          }}
        >
          <h2
            style={{ fontSize: "1.25rem", fontWeight: "600", color: "var(--color-earth-900)", marginBottom: "1.5rem" }}
          >
            All Monitored Locations
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "1rem",
            }}
          >
            {weatherData.map((location) => {
              const alert = getAlertLevel(location.temp)
              return (
                <button
                  key={location.location}
                  onClick={() => setSelectedLocation(location)}
                  style={{
                    padding: "1.25rem",
                    background: alert.color,
                    border:
                      selectedLocation?.location === location.location
                        ? "3px solid var(--color-earth-900)"
                        : "1px solid var(--color-earth-100)",
                    cursor: "pointer",
                    textAlign: "center",
                    color: "#ffffff",
                    transition: "all 0.2s ease",
                  }}
                >
                  <p style={{ fontWeight: "600", marginBottom: "0.5rem", fontSize: "0.875rem" }}>{location.location}</p>
                  <p style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "0.25rem" }}>
                    {location.temp.toFixed(1)}°C
                  </p>
                  <p style={{ fontSize: "0.8125rem", opacity: 0.95 }}>{alert.level}</p>
                </button>
              )
            })}
          </div>
        </div>

        {selectedLocation && (
          <div
            style={{
              background: "#ffffff",
              padding: "2rem",
              border: "1px solid var(--color-earth-100)",
              marginBottom: "2rem",
            }}
          >
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: "600",
                color: "var(--color-earth-900)",
                marginBottom: "1.5rem",
              }}
            >
              Detailed Data: {selectedLocation.location}
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "1.5rem",
              }}
            >
              <div
                style={{
                  background: "var(--color-sand-50)",
                  padding: "1.5rem",
                  border: "1px solid var(--color-earth-100)",
                  borderLeft: "4px solid var(--color-clay-600)",
                }}
              >
                <p
                  style={{
                    color: "var(--color-earth-500)",
                    fontSize: "0.875rem",
                    marginBottom: "0.5rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Current Temperature
                </p>
                <p style={{ fontSize: "3rem", fontWeight: "700", color: "var(--color-earth-900)", lineHeight: "1" }}>
                  {selectedLocation.temp.toFixed(1)}°C
                </p>
              </div>

              <div
                style={{
                  background: "var(--color-sand-50)",
                  padding: "1.5rem",
                  border: "1px solid var(--color-earth-100)",
                  borderLeft: "4px solid var(--color-sage-400)",
                }}
              >
                <p
                  style={{
                    color: "var(--color-earth-500)",
                    fontSize: "0.875rem",
                    marginBottom: "0.5rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Humidity Level
                </p>
                <p style={{ fontSize: "3rem", fontWeight: "700", color: "var(--color-earth-900)", lineHeight: "1" }}>
                  {selectedLocation.humidity.toFixed(0)}%
                </p>
                <div
                  style={{
                    background: "var(--color-earth-100)",
                    height: "6px",
                    marginTop: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      background: "var(--color-sage-600)",
                      height: "100%",
                      width: `${selectedLocation.humidity}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div
                style={{
                  background: "var(--color-sand-50)",
                  padding: "1.5rem",
                  border: "1px solid var(--color-earth-100)",
                  borderLeft: "4px solid var(--color-earth-500)",
                }}
              >
                <p
                  style={{
                    color: "var(--color-earth-500)",
                    fontSize: "0.875rem",
                    marginBottom: "0.5rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Wind Speed
                </p>
                <p style={{ fontSize: "3rem", fontWeight: "700", color: "var(--color-earth-900)", lineHeight: "1" }}>
                  {selectedLocation.windSpeed.toFixed(1)}
                </p>
                <p style={{ color: "var(--color-earth-500)", fontSize: "0.875rem", marginTop: "0.25rem" }}>km/h</p>
              </div>

              <div
                style={{
                  background: getAlertLevel(selectedLocation.temp).color,
                  color: "#ffffff",
                  padding: "1.5rem",
                  border: "1px solid var(--color-earth-100)",
                }}
              >
                <p
                  style={{
                    fontSize: "0.875rem",
                    marginBottom: "0.5rem",
                    opacity: 0.95,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Alert Status
                </p>
                <p style={{ fontSize: "1.5rem", fontWeight: "700", lineHeight: "1.3" }}>
                  {getAlertLevel(selectedLocation.temp).level}
                </p>
              </div>
            </div>
          </div>
        )}

        <div style={{ background: "#ffffff", padding: "2rem", border: "1px solid var(--color-earth-100)" }}>
          <h2
            style={{ fontSize: "1.25rem", fontWeight: "600", color: "var(--color-earth-900)", marginBottom: "1.5rem" }}
          >
            Active Alert Summary
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {weatherData
              .filter((loc) => loc.temp >= 35 || loc.temp <= 10)
              .map((location) => {
                const alert = getAlertLevel(location.temp)
                return (
                  <div
                    key={location.location}
                    style={{
                      padding: "1.25rem",
                      background: "var(--color-sand-100)",
                      borderLeft: `4px solid ${alert.color}`,
                    }}
                  >
                    <p style={{ fontWeight: "600", color: "var(--color-earth-900)", marginBottom: "0.5rem" }}>
                      {alert.level}: {location.location}
                    </p>
                    <p style={{ color: "var(--color-earth-700)", fontSize: "0.9375rem", lineHeight: "1.6" }}>
                      Current temperature: {location.temp.toFixed(1)}°C | Humidity: {location.humidity.toFixed(0)}% |
                      Wind: {location.windSpeed.toFixed(1)} km/h
                    </p>
                  </div>
                )
              })}
          </div>
        </div>
      </div>
    </div>
  )
}

const AlertsPage = () => (
  <div
    style={{
      width: "100%",
      minHeight: "calc(100vh - 69px)",
      background: "var(--color-sand-50)",
      padding: "2rem",
    }}
  >
    <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
      <h1
        style={{
          fontSize: "2.25rem",
          fontWeight: "700",
          color: "var(--color-earth-900)",
          marginBottom: "2rem",
          paddingBottom: "1rem",
          borderBottom: "2px solid var(--color-earth-100)",
        }}
      >
        Active Weather Alerts
      </h1>

      <div
        style={{
          background: "#ffffff",
          padding: "2rem",
          border: "1px solid var(--color-earth-100)",
          marginBottom: "2rem",
        }}
      >
        <h2 style={{ fontSize: "1.25rem", fontWeight: "600", color: "var(--color-earth-900)", marginBottom: "1rem" }}>
          Alert System Information
        </h2>
        <p style={{ color: "var(--color-earth-700)", fontSize: "0.9375rem", lineHeight: "1.6", marginBottom: "1rem" }}>
          Automated alerts are generated when temperature conditions meet or exceed defined thresholds for three
          consecutive days. This system provides early warning to enable coordinated community response and protect
          vulnerable populations.
        </p>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
          <thead>
            <tr style={{ background: "var(--color-sand-50)", borderBottom: "2px solid var(--color-earth-100)" }}>
              <th style={{ padding: "0.75rem", textAlign: "left", color: "var(--color-earth-900)", fontWeight: "600" }}>
                Alert Type
              </th>
              <th style={{ padding: "0.75rem", textAlign: "left", color: "var(--color-earth-900)", fontWeight: "600" }}>
                Threshold
              </th>
              <th style={{ padding: "0.75rem", textAlign: "left", color: "var(--color-earth-900)", fontWeight: "600" }}>
                Duration Required
              </th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: "1px solid var(--color-earth-100)" }}>
              <td style={{ padding: "0.75rem", color: "var(--color-earth-700)" }}>Heat Wave</td>
              <td style={{ padding: "0.75rem", color: "var(--color-earth-700)" }}>≥35°C</td>
              <td style={{ padding: "0.75rem", color: "var(--color-earth-700)" }}>3 consecutive days</td>
            </tr>
            <tr>
              <td style={{ padding: "0.75rem", color: "var(--color-earth-700)" }}>Cold Wave</td>
              <td style={{ padding: "0.75rem", color: "var(--color-earth-700)" }}>≤10°C</td>
              <td style={{ padding: "0.75rem", color: "var(--color-earth-700)" }}>3 consecutive days</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            padding: "2rem",
            border: "1px solid var(--color-earth-100)",
            borderLeft: "4px solid var(--color-alert-heat)",
          }}
        >
          <h3
            style={{ fontSize: "1.125rem", fontWeight: "600", color: "var(--color-earth-900)", marginBottom: "1rem" }}
          >
            Heat Wave Alert: Cairo, Egypt
          </h3>
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "1.5rem" }}>
            <tbody>
              <tr style={{ borderBottom: "1px solid var(--color-earth-100)" }}>
                <td style={{ padding: "0.75rem 0", color: "var(--color-earth-500)", fontSize: "0.9375rem" }}>
                  Severity Level
                </td>
                <td
                  style={{
                    padding: "0.75rem 0",
                    color: "var(--color-alert-heat)",
                    fontWeight: "700",
                    textAlign: "right",
                  }}
                >
                  EXTREME
                </td>
              </tr>
              <tr style={{ borderBottom: "1px solid var(--color-earth-100)" }}>
                <td style={{ padding: "0.75rem 0", color: "var(--color-earth-500)", fontSize: "0.9375rem" }}>
                  Current Temperature
                </td>
                <td
                  style={{
                    padding: "0.75rem 0",
                    color: "var(--color-earth-900)",
                    fontWeight: "600",
                    textAlign: "right",
                  }}
                >
                  40.0°C
                </td>
              </tr>
              <tr style={{ borderBottom: "1px solid var(--color-earth-100)" }}>
                <td style={{ padding: "0.75rem 0", color: "var(--color-earth-500)", fontSize: "0.9375rem" }}>
                  Threshold
                </td>
                <td
                  style={{
                    padding: "0.75rem 0",
                    color: "var(--color-earth-900)",
                    fontWeight: "600",
                    textAlign: "right",
                  }}
                >
                  38.0°C
                </td>
              </tr>
              <tr>
                <td style={{ padding: "0.75rem 0", color: "var(--color-earth-500)", fontSize: "0.9375rem" }}>
                  Expected Duration
                </td>
                <td
                  style={{
                    padding: "0.75rem 0",
                    color: "var(--color-earth-900)",
                    fontWeight: "600",
                    textAlign: "right",
                  }}
                >
                  3 more days
                </td>
              </tr>
            </tbody>
          </table>
          <div
            style={{ padding: "1rem", background: "var(--color-sand-100)", border: "1px solid var(--color-earth-100)" }}
          >
            <p style={{ fontWeight: "600", color: "var(--color-earth-900)", marginBottom: "0.5rem" }}>
              Response Recommendations
            </p>
            <p style={{ color: "var(--color-earth-700)", fontSize: "0.9375rem", lineHeight: "1.6" }}>
              Extreme heat conditions require immediate action. Open cooling centers, conduct wellness checks on elderly
              residents and those with chronic health conditions, and issue public health advisories through all
              available communication channels.
            </p>
          </div>
        </div>

        <div
          style={{
            background: "#ffffff",
            padding: "2rem",
            border: "1px solid var(--color-earth-100)",
            borderLeft: "4px solid var(--color-alert-severe)",
          }}
        >
          <h3
            style={{ fontSize: "1.125rem", fontWeight: "600", color: "var(--color-earth-900)", marginBottom: "1rem" }}
          >
            Heat Wave Alert: Lagos, Nigeria
          </h3>
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "1.5rem" }}>
            <tbody>
              <tr style={{ borderBottom: "1px solid var(--color-earth-100)" }}>
                <td style={{ padding: "0.75rem 0", color: "var(--color-earth-500)", fontSize: "0.9375rem" }}>
                  Severity Level
                </td>
                <td
                  style={{
                    padding: "0.75rem 0",
                    color: "var(--color-alert-severe)",
                    fontWeight: "700",
                    textAlign: "right",
                  }}
                >
                  HIGH
                </td>
              </tr>
              <tr style={{ borderBottom: "1px solid var(--color-earth-100)" }}>
                <td style={{ padding: "0.75rem 0", color: "var(--color-earth-500)", fontSize: "0.9375rem" }}>
                  Current Temperature
                </td>
                <td
                  style={{
                    padding: "0.75rem 0",
                    color: "var(--color-earth-900)",
                    fontWeight: "600",
                    textAlign: "right",
                  }}
                >
                  36.0°C
                </td>
              </tr>
              <tr style={{ borderBottom: "1px solid var(--color-earth-100)" }}>
                <td style={{ padding: "0.75rem 0", color: "var(--color-earth-500)", fontSize: "0.9375rem" }}>
                  Threshold
                </td>
                <td
                  style={{
                    padding: "0.75rem 0",
                    color: "var(--color-earth-900)",
                    fontWeight: "600",
                    textAlign: "right",
                  }}
                >
                  35.0°C
                </td>
              </tr>
              <tr>
                <td style={{ padding: "0.75rem 0", color: "var(--color-earth-500)", fontSize: "0.9375rem" }}>
                  Expected Duration
                </td>
                <td
                  style={{
                    padding: "0.75rem 0",
                    color: "var(--color-earth-900)",
                    fontWeight: "600",
                    textAlign: "right",
                  }}
                >
                  2 more days
                </td>
              </tr>
            </tbody>
          </table>
          <div
            style={{ padding: "1rem", background: "var(--color-sand-100)", border: "1px solid var(--color-earth-100)" }}
          >
            <p style={{ fontWeight: "600", color: "var(--color-earth-900)", marginBottom: "0.5rem" }}>
              Response Recommendations
            </p>
            <p style={{ color: "var(--color-earth-700)", fontSize: "0.9375rem", lineHeight: "1.6" }}>
              High heat alert requires increased monitoring and public awareness. Ensure vulnerable populations have
              access to cooling resources and hydration. Community health workers should be prepared for potential
              heat-related health impacts.
            </p>
          </div>
        </div>

        <div
          style={{
            background: "#ffffff",
            padding: "2rem",
            border: "1px solid var(--color-earth-100)",
            borderLeft: "4px solid var(--color-alert-cold)",
          }}
        >
          <h3
            style={{ fontSize: "1.125rem", fontWeight: "600", color: "var(--color-earth-900)", marginBottom: "1rem" }}
          >
            Cold Wave Alert: Johannesburg, South Africa
          </h3>
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "1.5rem" }}>
            <tbody>
              <tr style={{ borderBottom: "1px solid var(--color-earth-100)" }}>
                <td style={{ padding: "0.75rem 0", color: "var(--color-earth-500)", fontSize: "0.9375rem" }}>
                  Severity Level
                </td>
                <td
                  style={{
                    padding: "0.75rem 0",
                    color: "var(--color-alert-cold)",
                    fontWeight: "700",
                    textAlign: "right",
                  }}
                >
                  HIGH
                </td>
              </tr>
              <tr style={{ borderBottom: "1px solid var(--color-earth-100)" }}>
                <td style={{ padding: "0.75rem 0", color: "var(--color-earth-500)", fontSize: "0.9375rem" }}>
                  Current Temperature
                </td>
                <td
                  style={{
                    padding: "0.75rem 0",
                    color: "var(--color-earth-900)",
                    fontWeight: "600",
                    textAlign: "right",
                  }}
                >
                  8.0°C
                </td>
              </tr>
              <tr style={{ borderBottom: "1px solid var(--color-earth-100)" }}>
                <td style={{ padding: "0.75rem 0", color: "var(--color-earth-500)", fontSize: "0.9375rem" }}>
                  Threshold
                </td>
                <td
                  style={{
                    padding: "0.75rem 0",
                    color: "var(--color-earth-900)",
                    fontWeight: "600",
                    textAlign: "right",
                  }}
                >
                  10.0°C
                </td>
              </tr>
              <tr>
                <td style={{ padding: "0.75rem 0", color: "var(--color-earth-500)", fontSize: "0.9375rem" }}>
                  Expected Duration
                </td>
                <td
                  style={{
                    padding: "0.75rem 0",
                    color: "var(--color-earth-900)",
                    fontWeight: "600",
                    textAlign: "right",
                  }}
                >
                  4 more days
                </td>
              </tr>
            </tbody>
          </table>
          <div
            style={{ padding: "1rem", background: "var(--color-sand-100)", border: "1px solid var(--color-earth-100)" }}
          >
            <p style={{ fontWeight: "600", color: "var(--color-earth-900)", marginBottom: "0.5rem" }}>
              Response Recommendations
            </p>
            <p style={{ color: "var(--color-earth-700)", fontSize: "0.9375rem", lineHeight: "1.6" }}>
              Cold wave conditions require attention to heating access and shelter availability. Monitor vulnerable
              populations including homeless individuals and those with inadequate housing. Coordinate with social
              services to ensure winter preparedness resources are accessible.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
)

function App() {
  const [currentPage, setCurrentPage] = useState("home")

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "var(--color-sand-50)" }}>
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      {currentPage === "home" && <HomePage setCurrentPage={setCurrentPage} />}
      {currentPage === "dashboard" && <DashboardPage />}
      {currentPage === "monitoring" && <MonitoringPage />}
      {currentPage === "alerts" && <AlertsPage />}
    </div>
  )
}

export default App
