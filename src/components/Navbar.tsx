/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { Search, MapPin, Settings as SettingsIcon, Volume2, VolumeX, Moon, Sun, CloudSun } from "lucide-react";
import { Settings } from "../types";
import { POPULAR_CITIES, AutocompleteCity } from "../utils/weatherUtils";
import BrandLogo from "./BrandLogo";

interface NavbarProps {
  settings: Settings;
  onUpdateSettings: (s: Settings) => void;
  onSearchCity: (city: string) => void;
  onAutoDetectLocation: () => void;
  onOpenSettings: () => void;
  isSearching: boolean;
}

export default function Navbar({
  settings,
  onUpdateSettings,
  onSearchCity,
  onAutoDetectLocation,
  onOpenSettings,
  isSearching
}: NavbarProps) {
  const [searchVal, setSearchVal] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<AutocompleteCity[]>([]);
  
  const searchRef = useRef<HTMLDivElement | null>(null);

  // Simple query matching for auto-suggest
  useEffect(() => {
    if (searchVal.trim().length === 0) {
      setSuggestions([]);
      return;
    }
    
    const query = searchVal.toLowerCase();
    const filtered = POPULAR_CITIES.filter(
      (c) =>
        c.name.toLowerCase().startsWith(query) ||
        c.country.toLowerCase().startsWith(query)
    ).slice(0, 5); // limit 5 suggestions for clarity

    setSuggestions(filtered);
  }, [searchVal]);

  // Click outside listener for dynamic autocompletes
  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim() === "") return;
    onSearchCity(searchVal);
    setIsFocused(false);
  };

  const handleSelectSuggestion = (cityName: string) => {
    setSearchVal(cityName);
    onSearchCity(cityName);
    setIsFocused(false);
  };

  return (
    <nav 
      id="top-navbar"
      className={`sticky top-0 z-40 w-full transition-all border-b ${
        settings.isDarkMode 
          ? "bg-[#0b0e1a]/80 backdrop-blur-md border-white/5 text-white" 
          : "bg-white/80 backdrop-blur-md border-slate-200 text-slate-800"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Brand App Logo & Title */}
        <div 
          id="app-branding"
          onClick={() => {
            setSearchVal("");
            onSearchCity("Tokyo"); // default reset Presets
          }}
          className="flex items-center cursor-pointer select-none group hover:scale-[1.02] transition-transform duration-300"
        >
          <BrandLogo className="h-12" />
        </div>

        {/* Global Search Center Form */}
        <div ref={searchRef} className="relative flex-1 max-w-md mx-6 flex items-center justify-center">
          <form onSubmit={handleSubmit} className="w-full relative">
            <div 
              className={`flex items-center rounded-2xl transition-all duration-300 border ${
                isFocused 
                  ? "border-cyan-400 bg-black/35 shadow-[0_0_15px_rgba(0,198,255,0.15)] ring-2 ring-cyan-400/20" 
                  : settings.isDarkMode
                    ? "border-white/10 bg-white/5 hover:border-white/20"
                    : "border-slate-300 bg-slate-100 hover:border-slate-400 text-slate-900"
              }`}
            >
              {/* Left Search Lens Icon */}
              <div className="pl-4 pr-2 text-gray-400">
                <Search className={`w-4 h-4 ${isSearching ? "animate-spin text-cyan-400" : ""}`} />
              </div>

              {/* Text Input Field */}
              <input
                type="text"
                placeholder="Search worldwide city..."
                value={searchVal}
                onFocus={() => setIsFocused(true)}
                onChange={(e) => setSearchVal(e.target.value)}
                className={`w-full py-2.5 pr-4 font-sans text-sm focus:outline-none placeholder-gray-400 ${
                  settings.isDarkMode ? "text-white" : "text-slate-900"
                }`}
              />
              
              {/* Auto-detect Location coordinates button right nested inside search bar */}
              <button
                type="button"
                onClick={onAutoDetectLocation}
                title="Auto-detect core GPS local weather"
                className="p-1 px-3.5 text-gray-400 hover:text-cyan-400 transition-colors"
                id="searchbar-geolocation-btn"
              >
                <MapPin className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Autocomplete Dropdown suggestions panel */}
          {isFocused && suggestions.length > 0 && (
            <div 
              id="search-autocomplete-dropdown"
              className={`absolute top-[48px] left-0 w-full rounded-2xl overflow-hidden p-1 shadow-2xl z-50 border ring-1 focus:outline-none ${
                settings.isDarkMode
                  ? "bg-slate-900/95 backdrop-blur-xl border-white/10 text-white ring-white/10"
                  : "bg-white/95 backdrop-blur-xl border-slate-200 text-slate-800 ring-slate-200"
              }`}
            >
              <div className="px-3 py-1.5 text-[9px] font-bold tracking-wider text-gray-500 uppercase font-mono border-b border-white/5">
                MATCHING WORLD CITIES presets
              </div>
              {suggestions.map((city) => (
                <button
                  key={`${city.name}-${city.countryCode}`}
                  onClick={() => handleSelectSuggestion(city.name)}
                  className={`w-full px-3.5 py-2.5 text-xs text-left rounded-xl transition-all flex items-center justify-between ${
                    settings.isDarkMode
                      ? "hover:bg-cyan-500/10 text-gray-100 hover:text-white"
                      : "hover:bg-cyan-100 text-slate-700 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{city.name}</span>
                    <span className="opacity-50 text-[10px]">{city.country}</span>
                  </div>
                  <div className="flex items-center space-x-1 font-mono text-[9px] text-cyan-400/90 font-bold bg-cyan-400/5 px-2 py-0.5 rounded border border-cyan-400/10 leading-none uppercase">
                    <span>{city.signatureCondition}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Icons Utility Tools Toolbar */}
        <div className="flex items-center space-x-1.5 sm:space-x-3">
          
          {/* Ambient loop Sound Toggle button */}
          <button
            onClick={() => {
              const activeTrack = settings.selectedTrack;
              let nextTrack: "rain" | "wind" | "sunny" | "none" = "none";
              
              if (activeTrack === "none") nextTrack = "rain";
              else if (activeTrack === "rain") nextTrack = "wind";
              else if (activeTrack === "wind") nextTrack = "sunny";
              else nextTrack = "none";

              onUpdateSettings({ 
                ...settings, 
                isAudioOn: nextTrack !== "none",
                selectedTrack: nextTrack 
              });
            }}
            title={`Ambient Synthesizer Sound (Active: ${settings.selectedTrack.toUpperCase()})`}
            className={`p-2.5 rounded-xl border transition-all relative group flex items-center justify-center leading-none ${
              settings.isAudioOn 
                ? "bg-cyan-500/10 border-cyan-400/30 text-cyan-400" 
                : settings.isDarkMode
                  ? "bg-white/5 border-white/5 hover:border-white/10 text-gray-400"
                  : "bg-slate-100 border-slate-200 hover:border-slate-300 text-slate-500"
            }`}
            id="ambient-synth-toggle-btn"
          >
            {settings.isAudioOn ? (
              <div className="flex space-x-0.5 h-4 w-4 items-center justify-center">
                {/* Micro Equilizer visual animations */}
                <div className="eq-bar h-3" />
                <div className="eq-bar h-4" />
                <div className="eq-bar h-2" />
                <div className="eq-bar h-3" />
              </div>
            ) : (
              <VolumeX className="w-4 h-4" />
            )}

            {/* Hover tooltip */}
            <span className="absolute bottom-[-32px] scale-0 group-hover:scale-100 transition-all font-mono text-[9px] px-2 py-0.5 bg-black/90 text-white rounded whitespace-nowrap z-50">
              SOUND: {settings.selectedTrack.toUpperCase()}
            </span>
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={() => onUpdateSettings({ ...settings, isDarkMode: !settings.isDarkMode })}
            title="Toggle theme preset mode"
            className={`p-2.5 rounded-xl border transition-all ${
              settings.isDarkMode
                ? "bg-white/5 border-white/5 hover:border-white/10 text-yellow-400"
                : "bg-slate-100 border-slate-200 hover:border-slate-300 text-indigo-900"
            }`}
            id="theme-mode-toggle-btn"
          >
            {settings.isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* API Keys Configuration Button */}
          <button
            onClick={onOpenSettings}
            title="Open Core API Developer Settings"
            className={`p-2.5 rounded-xl border transition-all ${
              settings.isDarkMode
                ? "bg-white/5 border-white/5 hover:border-white/10 text-gray-300 hover:text-white"
                : "bg-slate-100 border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800"
            }`}
            id="developer-settings-modal-btn"
          >
            <SettingsIcon className="w-4 h-4 animate-spin-slow" />
          </button>
        </div>

      </div>
    </nav>
  );
}
