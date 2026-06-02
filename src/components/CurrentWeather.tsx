/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import { Share2, Clock, Calendar, ArrowUp, ArrowDown, MapPin, Check } from "lucide-react";
import { WeatherData } from "../types";
import { formatTemp, getCountryFlagEmoji } from "../utils/weatherUtils";

interface CurrentWeatherProps {
  weather: WeatherData;
  unit: "metric" | "imperial";
  isDarkMode: boolean;
  onShare: () => void;
  isCopied: boolean;
}

export default function CurrentWeather({
  weather,
  unit,
  isDarkMode,
  onShare,
  isCopied
}: CurrentWeatherProps) {
  const [animatedTemp, setAnimatedTemp] = useState(0);

  // Smooth CountUp temperature animation during search switching
  useEffect(() => {
    const rawVal = weather.temp;
    // Calculate final interpolated units
    const targetTemp = unit === "metric" ? rawVal : Math.round((rawVal * 9) / 5 + 32);
    
    setAnimatedTemp(0); // reset
    let start = 0;
    const duration = 800; // ms
    const increment = targetTemp / (duration / 16);
    
    let timer = setInterval(() => {
      start += increment;
      if ((increment >= 0 && start >= targetTemp) || (increment < 0 && start <= targetTemp)) {
        setAnimatedTemp(targetTemp);
        clearInterval(timer);
      } else {
        setAnimatedTemp(Math.round(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [weather.temp, unit]);

  // Determine elegant iconic representations
  const getAtmosphericIcon = (cond: string) => {
    const icon = cond.toLowerCase();
    
    if (icon.includes("clear") || icon.includes("sunny") || icon.includes("hot")) {
      return (
        <svg className="w-16 h-16 md:w-24 md:h-24 filter drop-shadow-[0_0_20px_rgba(251,191,36,0.55)]" viewBox="0 0 24 24" fill="none">
          {/* Animated golden sun rays */}
          <circle cx="12" cy="12" r="5" fill="#FBBF24" />
          <g className="sun-rays" style={{ transformOrigin: "12px 12px" }}>
            <line x1="12" y1="1" x2="12" y2="3" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
            <line x1="12" y1="21" x2="12" y2="23" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
            <line x1="1" y1="12" x2="3" y2="12" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
            <line x1="21" y1="12" x2="23" y2="12" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
            <line x1="18.36" y1="4.22" x2="19.78" y2="5.64" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
            <line x1="4.22" y1="18.36" x2="5.64" y2="19.78" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
          </g>
        </svg>
      );
    }
    
    if (icon.includes("snow") || icon.includes("ice") || icon.includes("frost")) {
      return (
        <svg className="w-16 h-16 md:w-24 md:h-24 filter drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]" viewBox="0 0 24 24" fill="none">
          {/* Snowflake core lines drifting */}
          <circle cx="12" cy="12" r="3" fill="#ffffff" />
          <line x1="12" y1="2" x2="12" y2="22" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
          <line x1="2" y1="12" x2="22" y2="12" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
          <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    }
    
    if (icon.includes("rain") || icon.includes("drizzle") || icon.includes("shower")) {
      return (
        <svg className="w-16 h-16 md:w-24 md:h-24 filter drop-shadow-[0_0_15px_rgba(56,189,248,0.5)]" viewBox="0 0 24 24" fill="none">
          {/* Rainy rain clouds */}
          <path d="M18 10h-1.26A8 8 0 1 0 9 15h9a5 5 0 0 0 0-10z" fill="#94a3b8" />
          {/* Raining beads */}
          <line x1="8" y1="18" x2="7" y2="22" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
          <line x1="12" y1="19" x2="11" y2="23" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
          <line x1="16" y1="18" x2="15" y2="22" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    }
    
    if (icon.includes("storm") || icon.includes("thunder") || icon.includes("lightning")) {
      return (
        <svg className="w-16 h-16 md:w-24 md:h-24 filter drop-shadow-[0_0_20px_rgba(168,85,247,0.5)]" viewBox="0 0 24 24" fill="none">
          {/* Storm cloud */}
          <path d="M18 10h-1.26A8 8 0 1 0 9 15h9a5 5 0 0 0 0-10z" fill="#475569" />
          {/* Lightning strike bolt */}
          <path d="M13 14l-3 5h4l-2 4" stroke="#FFD700" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </svg>
      );
    }
    
    // Default representation is beautifully stylized clouds
    return (
      <svg className="w-16 h-16 md:w-24 md:h-24 filter drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" viewBox="0 0 24 24" fill="none">
        <path d="M18 10h-1.26A8 8 0 1 0 9 15h9a5 5 0 0 0 0-10z" fill="#cbd5e1" />
      </svg>
    );
  };

  const highLabel = formatTemp(weather.tempMax, unit);
  const lowLabel = formatTemp(weather.tempMin, unit);
  const flagEmoji = getCountryFlagEmoji(weather.countryCode);

  return (
    <div 
      id="current-weather-hero"
      className="relative text-center py-8 pb-12 rounded-3xl animate-slide-up select-none overflow-hidden"
    >
      {/* Absolute top grid panel info */}
      <div className="flex flex-col items-center space-y-3">
        {/* Floating city pill / coordinates status */}
        <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/10 font-mono text-[9px] uppercase tracking-wider text-cyan-400 border border-white/5 shadow-sm leading-none">
          <MapPin className="w-3 h-3 text-cyan-400" />
          <span>{weather.city}, {weather.country} {flagEmoji} // STATION_LINK</span>
        </div>

        {/* Big visual city name */}
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight font-sans drop-shadow-md text-white">
          {weather.city}
        </h1>

        {/* Small timezone local clock indicator */}
        <div className="flex items-center space-x-2 text-xs text-gray-300 font-sans tracking-wide">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>Local Time: <strong className="font-bold">{weather.localTime}</strong></span>
          <span className="opacity-30">|</span>
          <Calendar className="w-3.5 h-3.5 text-cyan-400" />
          <span>June 02, 2026</span>
        </div>
      </div>

      {/* Hero Temperature Cluster */}
      <div className="flex justify-center items-center space-x-5 md:space-x-8 my-8">
        {/* Animated weather svg */}
        <div className="hover:scale-105 transition-transform duration-300" id="hero-weather-icon-g">
          {getAtmosphericIcon(weather.condition)}
        </div>

        {/* Temp numeric digit display */}
        <div className="flex flex-col items-start leading-none">
          <div className="flex items-start">
            <span className="text-7xl md:text-[140px] font-light leading-none tracking-tighter drop-shadow-2xl bg-gradient-to-b from-white via-white to-cyan-200 bg-clip-text text-transparent">
              {animatedTemp}
            </span>
            <span className="text-3xl md:text-5xl font-light text-cyan-300 mt-2.5 md:mt-5 opacity-90">
              °{unit === "metric" ? "C" : "F"}
            </span>
          </div>

          {/* Condition text name pill badge */}
          <div className="inline-block mt-2">
            <span className="px-3.5 py-1 text-[11px] font-black tracking-widest uppercase bg-cyan-400/10 text-cyan-400 rounded-full border border-cyan-400/25 leading-none">
              {weather.condition.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Feels like poetry & Tagline block */}
      <div className="max-w-xl mx-auto px-6 space-y-4">
        {/* Poetic description */}
        <p className="text-sm md:text-base italic font-serif leading-relaxed text-cyan-100 bg-black/15 py-3 p-4 rounded-2xl border border-white/5 shadow-inner" id="weather-poetry-text">
          "{weather.poetry}"
        </p>

        {/* Min/Max indicators & Share trigger tools */}
        <div className="flex justify-center items-center space-x-4">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-white/5 rounded-xl border border-white/5 text-xs text-gray-300 font-sans leading-none">
            <ArrowUp className="w-3.5 h-3.5 text-red-400" />
            <span>High: <strong className="font-bold text-white">{highLabel}</strong></span>
          </div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-white/5 rounded-xl border border-white/5 text-xs text-gray-300 font-sans leading-none">
            <ArrowDown className="w-3.5 h-3.5 text-blue-400" />
            <span>Low: <strong className="font-bold text-white">{lowLabel}</strong></span>
          </div>
          <button 
            onClick={onShare}
            className={`cursor-pointer inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isCopied
                ? "bg-green-500/10 border-green-500/30 text-green-400"
                : "bg-cyan-500/10 border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/20"
            }`}
            id="weather-clipboard-sh-btn"
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied summary!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Weather</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
