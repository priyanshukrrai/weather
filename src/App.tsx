/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { 
  CloudSun, 
  MapPin, 
  Sparkles, 
  Clipboard, 
  AlertCircle, 
  Sliders, 
  Eye, 
  Compass, 
  Gauge, 
  Sparkle, 
  Thermometer,
  CloudLightning
} from "lucide-react";
import { WeatherData, Settings } from "./types";
import { generateMockWeatherData, fetchRealWeatherData } from "./utils/weatherUtils";
import { startAmbientSound, stopAmbientSound } from "./utils/audioSynth";

// Import custom React modules
import Navbar from "./components/Navbar";
import WeatherBackground from "./components/WeatherBackground";
import CurrentWeather from "./components/CurrentWeather";
import HourlyChart from "./components/HourlyChart";
import Forecast7Day from "./components/Forecast7Day";
import HighlightsGrid from "./components/HighlightsGrid";
import WeatherMap from "./components/WeatherMap";
import SettingsModal from "./components/SettingsModal";
import MetricCard from "./components/MetricCard";
import BrandLogo from "./components/BrandLogo";

export default function App() {
  // Initialize States
  const [weatherState, setWeatherState] = useState<WeatherData | null>(null);
  const [cityQuery, setCityQuery] = useState("Tokyo");
  const [isSearching, setIsSearching] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Core settings synchronized with LocalStorage
  const [settings, setSettings] = useState<Settings>(() => {
    const cached = localStorage.getItem("skycast_settings");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        return {
          apiKey: parsed.apiKey || "",
          unit: parsed.unit || "metric",
          isDarkMode: parsed.isDarkMode !== undefined ? parsed.isDarkMode : true,
          isAudioOn: parsed.isAudioOn || false,
          selectedTrack: parsed.selectedTrack || "none"
        };
      } catch (e) {
        // Fallback
      }
    }
    return {
      apiKey: "",
      unit: "metric",
      isDarkMode: true,
      isAudioOn: false,
      selectedTrack: "none"
    };
  });

  // Track settings updating
  useEffect(() => {
    localStorage.setItem("skycast_settings", JSON.stringify(settings));
    
    // Manage Synthesizer Sound Engine status
    if (settings.isAudioOn && settings.selectedTrack !== "none") {
      startAmbientSound(settings.selectedTrack as any);
    } else {
      stopAmbientSound();
    }
  }, [settings]);

  // Synchronize document background styling
  useEffect(() => {
    if (settings.isDarkMode) {
      document.body.classList.add("dark");
      document.body.style.backgroundColor = "#0e111d";
    } else {
      document.body.classList.remove("dark");
      document.body.style.backgroundColor = "#f3f4f6";
    }
  }, [settings.isDarkMode]);

  // Retrieve last searched city on startup or defaults to "Tokyo"
  useEffect(() => {
    const cachedCity = localStorage.getItem("skycast_last_city");
    const startupCity = cachedCity || "Tokyo";
    setCityQuery(startupCity);
    handleLoadWeather(startupCity);

    // Simulated luxury splash loader (1400ms intro)
    const splashTimer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 1400);

    return () => {
      clearTimeout(splashTimer);
      stopAmbientSound();
    };
  }, []);

  // Weather fetch orchestrator orchestrator helper
  const handleLoadWeather = async (cityName: string) => {
    setIsSearching(true);
    setErrorMessage(null);
    try {
      let data: WeatherData;
      if (settings.apiKey && settings.apiKey.trim() !== "") {
        data = await fetchRealWeatherData(cityName, settings.apiKey);
      } else {
        // Fallback procedural simulator
        data = generateMockWeatherData(cityName);
      }
      
      setWeatherState(data);
      localStorage.setItem("skycast_last_city", data.city);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "An error occurred while fetching meteorological forecasts.");
    } finally {
      setIsSearching(false);
    }
  };

  // Autodetect GPS Location
  const handleAutoDetectLocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage("Geolocation is not supported by your current browser environment.");
      return;
    }

    setIsSearching(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          // If api key is present, fetch coordinates using OWM Reverse Geocoder or trigger customized location mocks
          if (settings.apiKey) {
            const res = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${settings.apiKey}&units=metric`
            );
            if (res.ok) {
              const data = await res.json();
              if (data.name) {
                handleLoadWeather(data.name);
                return;
              }
            }
          }
          // Coordinate simulations if offline or custom
          const coordName = `Lat: ${latitude.toFixed(2)}, Lon: ${longitude.toFixed(2)}`;
          const mockData = generateMockWeatherData("San Francisco"); // Base default
          mockData.city = "Current GPS Position";
          mockData.country = "Local";
          mockData.poetry = `Coordinates resolved successfully at latitude ${latitude.toFixed(2)} and longitude ${longitude.toFixed(2)}. Soft, maritime air cycles comfortably around.`;
          setWeatherState(mockData);
        } catch (e) {
          setErrorMessage("Failed to resolve GPS coordinates weather.");
        } finally {
          setIsSearching(false);
        }
      },
      (err) => {
        setErrorMessage("Location request was rejected. Make sure permission is allowed.");
        setIsSearching(false);
      },
      { timeout: 10000 }
    );
  };

  // Copies weather layout text formatting to clipboard
  const handleShareWeather = () => {
    if (!weatherState) return;
    const tempDisplay = settings.unit === "metric" 
      ? `${weatherState.temp}°C` 
      : `${Math.round((weatherState.temp * 9) / 5 + 32)}°F`;

    const summary = `⛅ SkyCast Weather Report // ${weatherState.city}, ${weatherState.country}
🌡️ Current Temp: ${tempDisplay} (${weatherState.condition})
💨 Wind: ${weatherState.windSpeed} m/s | 💧 Humidity: ${weatherState.humidity}%
🍃 Outlook: "${weatherState.poetry}"
Developed by Priyanshu Kumar Rai`;

    navigator.clipboard.writeText(summary);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Loading Splash Layout
  if (isInitialLoad) {
    return (
      <div 
        id="loading-splash"
        className="fixed inset-0 w-full h-full flex flex-col items-center justify-center bg-[#070d19] text-white z-50 transition-opacity duration-500 font-sans"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/5 blur-3xl rounded-full" />
        
        {/* Centered Precision Brand logo */}
        <div className="relative mb-8 mt-[-40px] flex flex-col items-center select-none animate-[bounce_2.5s_infinite] scale-110">
          <BrandLogo className="h-28 flex-col text-center" showText={true} />
        </div>

        {/* Dynamic status string */}
        <div className="text-center space-y-2 select-none">
          <p className="text-xs md:text-sm text-cyan-400 tracking-[0.2em] font-sans font-black uppercase animate-pulse">
            LOADING PREMIUM METEOROLOGY LAB...
          </p>
          <p className="text-[10px] text-gray-500 font-mono">
            SECURE_SAT_LINK_STABLE // PROCEDURAL_GENERATION_ONLINE
          </p>
        </div>

        {/* Developer Credit Signature Line */}
        <div className="absolute bottom-10 text-center opacity-40 font-serif text-[11px] tracking-wider italic">
          Designed by Priyanshu Kumar Rai
        </div>
      </div>
    );
  }

  // Determine isDay from current time of searched city
  const isDayVal = weatherState 
    ? (new Date().getHours() >= 6 && new Date().getHours() < 19) 
    : true;

  return (
    <div className={`min-h-screen ${settings.isDarkMode ? "text-white" : "text-slate-800"}`}>
      {/* Dynamic atmospheric cinematic particles */}
      <WeatherBackground 
        condition={weatherState?.condition || "Clear"}
        isDay={isDayVal}
      />

      {/* Primary Top Navbar */}
      <Navbar 
        settings={settings}
        onUpdateSettings={setSettings}
        onSearchCity={handleLoadWeather}
        onAutoDetectLocation={handleAutoDetectLocation}
        onOpenSettings={() => setShowSettings(true)}
        isSearching={isSearching}
      />

      {/* Main Container structure */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 pb-20">
        
        {/* Error Notification Card banner */}
        {errorMessage && (
          <div id="error-alert-banner" className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-start space-x-3 text-red-200 animate-slide-up">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-sm font-bold block">Transmission Error</span>
              <p className="text-xs text-red-300/80">{errorMessage}</p>
            </div>
          </div>
        )}

        {weatherState && (
          <>
            {/* Primary Current weather and Animated Poetry Panel */}
            <CurrentWeather 
              weather={weatherState}
              unit={settings.unit}
              isDarkMode={settings.isDarkMode}
              onShare={handleShareWeather}
              isCopied={isCopied}
            />

            {/* Quick stats mini ribbon (metallic cards) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="essential-stats-ribbon">
              <MetricCard 
                title="Feels Like"
                value={settings.unit === "metric" ? `${weatherState.feelsLike}°C` : `${Math.round((weatherState.feelsLike * 9) / 5 + 32)}°F`}
                subValue={`Thermal comfort index`}
                icon={<Thermometer className="w-5 h-5" />}
                isDarkMode={settings.isDarkMode}
                highlight={true}
              />
              <MetricCard 
                title="Visibility"
                value={weatherState.visibility >= 1000 ? `${(weatherState.visibility / 1000).toFixed(1)} km` : `${weatherState.visibility} m`}
                subValue={`Horizontal clarity limit`}
                icon={<Eye className="w-5 h-5" />}
                isDarkMode={settings.isDarkMode}
              />
              <MetricCard 
                title="Air Pressure"
                value={`${weatherState.pressure} hPa`}
                subValue={`Barometric weight`}
                icon={<Gauge className="w-5 h-5" />}
                isDarkMode={settings.isDarkMode}
              />
              <MetricCard 
                title="Cloud Cover"
                value={`${weatherState.cloudCover}%`}
                subValue={`Hemispherical density`}
                icon={<CloudSun className="w-5 h-5" />}
                isDarkMode={settings.isDarkMode}
              />
            </div>

            {/* 7-Day Forecast horiz deck */}
            <Forecast7Day 
              forecasts={weatherState.daily}
              unit={settings.unit}
              isDarkMode={settings.isDarkMode}
            />

            {/* Middle Section: Chart and Radar Satellite view */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="meteorology-detailed-panels">
              {/* Hourly Chart (2 Columns width) */}
              <div 
                className={`lg:col-span-2 p-6 rounded-3xl transition-all relative ${
                  settings.isDarkMode ? "glass-panel text-white" : "glass-panel-light text-slate-800"
                }`}
                id="hourly-timeline-panel"
              >
                <div className="flex items-center space-x-2.5 mb-4 border-b border-white/5 pb-3">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-bold tracking-wider uppercase opacity-80 font-sans">
                    24-Hour Atmospheric Temperature Timeline
                  </h3>
                </div>
                <HourlyChart 
                  hourlyData={weatherState.hourly}
                  unit={settings.unit}
                  isDarkMode={settings.isDarkMode}
                />
              </div>

              {/* Weather Map Satellite (1 Column width) */}
              <div id="satellite-map-panel">
                <WeatherMap 
                  city={weatherState.city}
                  isDarkMode={settings.isDarkMode}
                />
              </div>
            </div>

            {/* Comprehensive meteorological Highlights structure */}
            <div className="space-y-4" id="astrophysics-grid-group">
              <h3 className="text-md font-bold tracking-widest uppercase opacity-65 font-sans pl-1">
                ✦ Atmospheric highlights
              </h3>
              <HighlightsGrid 
                weather={weatherState}
                unit={settings.unit}
                isDarkMode={settings.isDarkMode}
              />
            </div>
          </>
        )}

        {/* MANDATORY SIGNATURE FOOTER */}
        <footer 
          id="crafted-footer"
          className="text-center pt-16 pb-8 space-y-4"
        >
          {/* Subtle layout gold divider line */}
          <div className="w-full h-[1.5px] bg-gradient-to-r from-transparent via-[#FFD700]/30 to-transparent shadow-[0_0_8px_rgba(255,215,0,0.2)]" />
          
          <div className="flex justify-center items-center space-x-2">
            {/* Pulsing golden sparkle */}
            <Sparkle className="w-4 h-4 text-[#FFD700] fill-[#FFD700] animate-pulse" />
            <span className="font-serif italic text-sm text-gray-400">
              Designed & Developed by{" "}
              <strong className="text-base text-[#FFD700] not-italic drop-shadow-[0_0_12px_rgba(255,215,0,0.55)]">
                Priyanshu Kumar Rai
              </strong>
            </span>
            <Sparkle className="w-4 h-4 text-[#FFD700] fill-[#FFD700] animate-pulse delay-150" />
          </div>
          
          <p className="text-[10px] font-mono tracking-widest text-gray-500 uppercase">
            © All Rights Reserved
          </p>
        </footer>

      </main>

      {/* API Configuration Modals */}
      <SettingsModal 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onUpdateSettings={setSettings}
        onSelectCityPreset={handleLoadWeather}
        isApplying={isSearching}
      />
    </div>
  );
}
