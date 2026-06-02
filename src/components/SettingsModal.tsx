/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { X, Settings as SettingsIcon, Info, Sliders, Check } from "lucide-react";
import { Settings } from "../types";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onUpdateSettings: (s: Settings) => void;
  onSelectCityPreset: (city: string) => void;
  isApplying: boolean;
}

const PRESET_CITIES = [
  { name: "Tokyo", label: "Tokyo 🇯🇵 (Clear, Mild)" },
  { name: "London", label: "London 🇬🇧 (Rainy Day Mood)" },
  { name: "Reykjavik", label: "Reykjavik 🇮🇸 (Icy Polar Snow)" },
  { name: "Dubai", label: "Dubai 🇦🇪 (Warm Desert Sun)" },
  { name: "Zermatt", label: "Zermatt 🇨🇭 (Alps Alpine Snow)" },
  { name: "Vancouver", label: "Vancouver 🇨🇦 (Overcast Clouds)" }
];

export default function SettingsModal({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onSelectCityPreset,
  isApplying
}: SettingsModalProps) {
  if (!isOpen) return null;

  return (
    <div id="settings-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in animate-slide-up">
      {/* Container Frost card */}
      <div 
        id="settings-card" 
        className={`${
          settings.isDarkMode ? "glass-panel text-white" : "glass-panel-light text-slate-800"
        } w-full max-w-lg p-6 rounded-3xl relative overflow-hidden ring-1 ring-white/10`}
      >
        {/* Glow corner */}
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-cyan-400/20 blur-2xl rounded-full" />

        {/* Header toolbar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <SettingsIcon className="w-5 h-5 text-cyan-400 animate-spin-slow" />
            <h2 className="text-xl font-bold font-sans tracking-tight">SkyCast Core Settings</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 px-3 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings options Body */}
        <div className="space-y-6">
          {/* API Key details */}
          <div className="space-y-2">
            <label className="text-sm font-bold tracking-wider uppercase opacity-80 flex items-center space-x-1.5">
              <span>OpenWeatherMap Free API Key</span>
              <span className="text-[10px] bg-cyan-500/10 text-cyan-400 rounded-full px-2 py-0.5 font-mono">Optional</span>
            </label>
            <input 
              type="text"
              placeholder="Paste custom openweathermap appid key..."
              value={settings.apiKey}
              onChange={(e) => onUpdateSettings({ ...settings, apiKey: e.target.value })}
              className={`w-full p-3 font-mono text-sm leading-none bg-black/25 placeholder-gray-500 rounded-xl border border-white/10 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all ${
                !settings.isDarkMode && "text-slate-900 placeholder-slate-400 bg-white/50"
              }`}
            />
            <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
              No API Key? **No problem!** SkyCast generates highly realistic, cinematic weather layouts with poetic taglines from our procedural simulation core when no key is entered.
            </p>
          </div>

          {/* Unit selector details */}
          <div className="flex justify-between items-center py-2 border-t border-white/5">
            <div>
              <h4 className="text-sm font-medium">Temperature Metric Unit</h4>
              <p className="text-xs text-gray-400">Toggle between Celsius or Fahrenheit scales.</p>
            </div>
            <div className="flex bg-black/20 p-1 rounded-xl border border-white/5">
              <button
                onClick={() => onUpdateSettings({ ...settings, unit: "metric" })}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  settings.unit === "metric"
                    ? "bg-gradient-to-r from-cyan-500 to-[#00c6ff] text-white shadow-md shadow-cyan-500/20"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Metric (°C)
              </button>
              <button
                onClick={() => onUpdateSettings({ ...settings, unit: "imperial" })}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  settings.unit === "imperial"
                    ? "bg-gradient-to-r from-cyan-500 to-[#00c6ff] text-white shadow-md shadow-cyan-500/20"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Imperial (°F)
              </button>
            </div>
          </div>

          {/* Preset trigger buttons (Demo mode) */}
          <div className="space-y-3 pt-4 border-t border-white/5">
            <h4 className="text-sm font-bold tracking-wider uppercase opacity-80 flex items-center space-x-1.5">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Explore Cinematic Preset Demos</span>
            </h4>
            <p className="text-xs text-gray-400">
              Instantly simulate diverse weather patterns around the globe to trigger beautiful animations, sounds, and ambient color gradients.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {PRESET_CITIES.map((city) => (
                <button
                  key={city.name}
                  onClick={() => {
                    onSelectCityPreset(city.name);
                    onClose();
                  }}
                  className={`p-2.5 text-[11px] font-medium leading-none text-left rounded-xl transition-all border ${
                    settings.isDarkMode
                      ? "bg-white/5 hover:bg-cyan-500/10 border-white/5 hover:border-cyan-500/20 text-gray-300 hover:text-white"
                      : "bg-slate-100 hover:bg-cyan-100 border-slate-200 text-slate-800"
                  }`}
                >
                  {city.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer save/verify button toolbar */}
        <div className="mt-8 pt-4 border-t border-white/5 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-[#00c6ff] hover:brightness-110 text-white shadow-md transition-all flex items-center space-x-1"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Apply & Close</span>
          </button>
        </div>
      </div>
    </div>
  );
}
