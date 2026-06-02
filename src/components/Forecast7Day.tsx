/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Calendar, CloudRain } from "lucide-react";
import { DailyForecast } from "../types";
import { formatTemp } from "../utils/weatherUtils";

interface Forecast7DayProps {
  forecasts: DailyForecast[];
  unit: "metric" | "imperial";
  isDarkMode: boolean;
}

export default function Forecast7Day({
  forecasts,
  unit,
  isDarkMode
}: Forecast7DayProps) {
  const getSmallIcon = (cond: string) => {
    const icon = cond.toLowerCase();
    if (icon.includes("clear") || icon.includes("sunny")) return "☀️";
    if (icon.includes("snow") || icon.includes("frost")) return "❄️";
    if (icon.includes("rain") || icon.includes("drizzle")) return "🌧️";
    if (icon.includes("storm") || icon.includes("thunder")) return "⚡";
    return "☁️";
  };

  return (
    <div 
      id="forecast-7day-card"
      className={`p-6 rounded-3xl overflow-hidden transition-all relative ${
        isDarkMode ? "glass-panel text-white" : "glass-panel-light text-slate-800"
      }`}
    >
      {/* Glow Corner decorative */}
      <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-cyan-400/5 blur-xl rounded-full" />

      {/* Header element */}
      <div className="flex items-center space-x-2.5 mb-5 border-b border-white/5 pb-3">
        <Calendar className="w-4 h-4 text-cyan-400" />
        <h3 className="text-sm font-bold tracking-wider uppercase opacity-80 font-sans">
          7-Day Cinematic Forecast Strip
        </h3>
      </div>

      {/* Horizontal scrollable flex area */}
      <div className="flex space-x-3.5 overflow-x-auto pb-4 pt-1 px-1 no-scrollbar cursor-grab" id="forecast-days-row">
        {forecasts.map((forecast, idx) => {
          const maxT = formatTemp(forecast.tempMax, unit);
          const minT = formatTemp(forecast.tempMin, unit);
          
          return (
            <div
              key={forecast.dayName + "-" + idx}
              className={`flex-shrink-0 w-[115px] p-4 rounded-2xl flex flex-col items-center text-center transition-all transform hover:-translate-y-1 ${
                idx === 0 
                  ? "bg-gradient-to-b from-[#00c6ff]/15 to-transparent border border-cyan-400/25 ring-1 ring-cyan-400/20" 
                  : isDarkMode
                    ? "bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10"
                    : "bg-slate-100 hover:bg-slate-200 border border-slate-200"
              }`}
            >
              {/* Day title */}
              <span className="text-xs font-bold font-sans tracking-wide">
                {forecast.dayName}
              </span>
              <span className="text-[10px] text-gray-400 mt-0.5 leading-none font-mono">
                {forecast.dateLabel}
              </span>

              {/* Central Weather Icon Badge character */}
              <div className="text-3xl my-3 text-center filter drop-shadow-md select-none transform hover:scale-110 transition-transform">
                {getSmallIcon(forecast.condition)}
              </div>

              {/* Temperature spans */}
              <div className="flex items-baseline justify-center space-x-2.5 mt-1">
                <span className="text-sm font-extrabold text-white font-sans">{maxT}</span>
                <span className="text-[10px] text-gray-400 font-sans">{minT}</span>
              </div>

              {/* Subtitles: precipitation probability chance */}
              {forecast.rainChance > 10 ? (
                <div className="mt-2 text-[9px] font-mono text-cyan-400 flex items-center space-x-0.5 leading-none">
                  <CloudRain className="w-2.5 h-2.5" />
                  <span>{forecast.rainChance}%</span>
                </div>
              ) : (
                <div className="mt-2 text-[9px] font-mono text-gray-500 leading-none">
                  Stable
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
