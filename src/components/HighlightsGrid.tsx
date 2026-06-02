/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Sun, Heart, Eye, ArrowUp, Thermometer, Wind, Compass as CompassIcon, Compass as CompIcon } from "lucide-react";
import { WeatherData } from "../types";
import Compass from "./Compass";
import SunArc from "./SunArc";
import { formatTemp } from "../utils/weatherUtils";

interface HighlightsGridProps {
  weather: WeatherData;
  unit: "metric" | "imperial";
  isDarkMode: boolean;
}

export default function HighlightsGrid({
  weather,
  unit,
  isDarkMode
}: HighlightsGridProps) {
  // AQI calculations
  // 1 = Good, 2 = Fair, 3 = Moderate, 4 = Poor, 5 = Hazardous
  const getAqiLabel = (aqi: number) => {
    switch (aqi) {
      case 1:
        return { name: "Good", color: "bg-emerald-400 text-emerald-950", barCol: "bg-emerald-400 shadow-emerald-400/30" };
      case 2:
        return { name: "Fair", color: "bg-green-300 text-green-950", barCol: "bg-green-300 shadow-green-300/30" };
      case 3:
        return { name: "Moderate", color: "bg-yellow-300 text-yellow-950", barCol: "bg-yellow-300 shadow-yellow-300/30" };
      case 4:
        return { name: "Poor", color: "bg-orange-400 text-orange-950", barCol: "bg-orange-400 shadow-orange-400/30" };
      case 5:
        return { name: "Hazardous", color: "bg-red-400 text-red-950", barCol: "bg-red-400 shadow-red-400/30" };
      default:
        return { name: "Good", color: "bg-emerald-400 text-emerald-950", barCol: "bg-emerald-400 shadow-emerald-400/30" };
    }
  };

  const aqiInfo = getAqiLabel(weather.aqi.aqi);

  // UV index descriptions
  const getUvDescription = (uv: number) => {
    if (uv <= 2) return "Low (Safe) 🟢";
    if (uv <= 5) return "Moderate (Fair) 🟡";
    if (uv <= 7) return "High (Protection required) 🟠";
    return "Very High / Extreme (Stay indoors) 🔴";
  };

  const formattedDewPoint = formatTemp(weather.dewPoint, unit);
  const formattedFeelsLike = formatTemp(weather.feelsLike, unit);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" id="weather-highlights-grid">
      
      {/* 1. Sunrise/Sunset astronomical day progress arc */}
      <div 
        className={`p-6 rounded-3xl transition-all relative overflow-hidden ${
          isDarkMode ? "glass-panel text-white" : "glass-panel-light text-slate-800"
        }`}
        id="highlight-sunarc"
      >
        <h4 className="text-sm font-bold tracking-wider uppercase opacity-80 mb-4 font-sans text-gray-400">
          Daylight Progress Arc 🌅
        </h4>
        <SunArc 
          sunriseSec={weather.sunrise}
          sunsetSec={weather.sunset}
          timezoneOffsetSec={weather.timezoneOffset}
        />
      </div>

      {/* 2. Interactive compass needle details */}
      <div 
        className={`p-6 rounded-3xl transition-all relative overflow-hidden ${
          isDarkMode ? "glass-panel text-white" : "glass-panel-light text-slate-800"
        }`}
        id="highlight-windCompass"
      >
        <h4 className="text-sm font-bold tracking-wider uppercase opacity-80 mb-4 font-sans text-gray-400">
          Wind Director Compass 🧭
        </h4>
        <Compass 
          degrees={weather.windDeg}
          speed={weather.windSpeed}
          unit={unit}
        />
      </div>

      {/* 3. Humidity Progress Bar Meter */}
      <div 
        className={`p-6 rounded-3xl transition-all relative overflow-hidden flex flex-col justify-between ${
          isDarkMode ? "glass-panel text-white" : "glass-panel-light text-slate-800"
        }`}
        id="highlight-humidity"
      >
        <div>
          <h4 className="text-sm font-bold tracking-wider uppercase opacity-80 mb-4 font-sans text-gray-400">
            Atmospheric Humidity 💧
          </h4>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-extrabold tracking-tight font-sans text-white">{weather.humidity}%</span>
            <span className="text-xs text-cyan-400 font-medium">relative saturation</span>
          </div>
        </div>

        {/* Real-time custom animated progress capsule */}
        <div className="w-full mt-4">
          <div className="flex justify-between text-[11px] text-gray-400 font-mono mb-1.5">
            <span>Dry</span>
            <span>Comfortable</span>
            <span>Wet</span>
          </div>
          <div className="w-full h-2.5 bg-black/25 rounded-full overflow-hidden border border-white/5 relative">
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 to-sky-500 rounded-full transition-all duration-[1200ms] ease-out shadow-[0_0_10px_rgba(0,198,255,0.4)]"
              style={{ width: `${weather.humidity}%` }}
            />
          </div>
          <div className="text-[11px] text-gray-400 leading-relaxed font-sans mt-3">
            The dew point is currently **{formattedDewPoint}** · Feels like **{formattedFeelsLike}**.
          </div>
        </div>
      </div>

      {/* 4. Air Quality Index Progress Indicator */}
      <div 
        className={`p-6 rounded-3xl transition-all relative overflow-hidden flex flex-col justify-between ${
          isDarkMode ? "glass-panel text-white" : "glass-panel-light text-slate-800"
        }`}
        id="highlight-aqi"
      >
        <div>
          <h4 className="text-sm font-bold tracking-wider uppercase opacity-80 mb-4 font-sans text-gray-400 flex justify-between items-center">
            <span>Air Quality Index (AQI) 🫧</span>
            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase leading-none ${aqiInfo.color}`}>
              {aqiInfo.name}
            </span>
          </h4>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-extrabold tracking-tight font-sans text-white">Class {weather.aqi.aqi}</span>
            <span className="text-xs text-gray-400">OpenWeather Standard</span>
          </div>
        </div>

        {/* Level metrics bar */}
        <div className="mt-4">
          <div className="w-full h-2.5 bg-black/25 rounded-full overflow-hidden border border-white/5 relative">
            <div 
              className={`h-full rounded-full transition-all duration-[1200ms] ease-out shadow-md ${aqiInfo.barCol}`}
              style={{ width: `${(weather.aqi.aqi / 5) * 100}%` }}
            />
          </div>
          <div className="grid grid-cols-4 gap-1 text-center mt-3 text-[9px] font-mono leading-tight">
            <div className="p-1 rounded bg-white/5 border border-white/5">
              <span className="block text-gray-400">PM2.5</span>
              <strong className="text-white font-bold">{weather.aqi.pm2_5} μg</strong>
            </div>
            <div className="p-1 rounded bg-white/5 border border-white/5">
              <span className="block text-gray-400">PM10</span>
              <strong className="text-white font-bold">{weather.aqi.pm10} μg</strong>
            </div>
            <div className="p-1 rounded bg-white/5 border border-white/5">
              <span className="block text-gray-400">O3</span>
              <strong className="text-white font-bold">{weather.aqi.o3} μg</strong>
            </div>
            <div className="p-1 rounded bg-white/5 border border-white/5">
              <span className="block text-gray-400">NO2</span>
              <strong className="text-white font-bold">{weather.aqi.no2} μg</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Astronomical Moon Phase display */}
      <div 
        className={`p-6 rounded-3xl transition-all relative overflow-hidden flex flex-col justify-between ${
          isDarkMode ? "glass-panel text-white" : "glass-panel-light text-slate-800"
        }`}
        id="highlight-moon"
      >
        <div>
          <h4 className="text-sm font-bold tracking-wider uppercase opacity-80 mb-4 font-sans text-gray-400">
            Celestial Moon Phase 🌙
          </h4>
          <div className="flex items-center space-x-3">
            <div className="text-4xl text-center select-none filter drop-shadow-[0_0_12px_rgba(255,230,100,0.4)]">
              {weather.moonPhaseName.toLowerCase().includes("full") ? "🌕" : "🌙"}
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight font-sans text-white leading-none block">
                {weather.moonPhaseName}
              </span>
              <span className="text-[10px] text-gray-400 font-mono">Phase Fractional Index: {weather.moonPhase}</span>
            </div>
          </div>
        </div>

        {/* Small celestial trivia summary line */}
        <p className="text-[11px] text-gray-400 leading-relaxed font-sans mt-3 border-t border-white/5 pt-2">
          The lunar cycle is in an elegant Waxing posture today. Solitude and soft ambient twilight provide clean visibility.
        </p>
      </div>

      {/* 6. Static / secondary indexes combo (UV & Clouds) */}
      <div 
        className={`p-6 rounded-3xl transition-all relative overflow-hidden flex flex-col justify-between ${
          isDarkMode ? "glass-panel text-white" : "glass-panel-light text-slate-800"
        }`}
        id="highlight-uvCloud"
      >
        <div>
          <h4 className="text-sm font-bold tracking-wider uppercase opacity-80 mb-4 font-sans text-gray-400">
            UV Solar Exposure Index ☀️
          </h4>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-extrabold tracking-tight font-sans text-white">Index {weather.uvIndex}</span>
            <span className="text-xs text-yellow-400 font-medium">of 11+</span>
          </div>
        </div>

        <div className="mt-4 pt-2 border-t border-white/5 font-sans space-y-1">
          <div className="text-xs text-gray-300">
            Risk factor: <strong className="font-bold text-white">{getUvDescription(weather.uvIndex)}</strong>
          </div>
          <div className="text-[11px] text-gray-400">
            Cloud cover occupies **{weather.cloudCover}%** of the local overhead hemisphere today.
          </div>
        </div>
      </div>

    </div>
  );
}
