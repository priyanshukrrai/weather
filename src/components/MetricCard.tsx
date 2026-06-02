/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subValue?: string | number;
  icon: ReactNode;
  isDarkMode: boolean;
  highlight?: boolean;
  id?: string;
}

export default function MetricCard({
  title,
  value,
  subValue,
  icon,
  isDarkMode,
  highlight = false,
  id
}: MetricCardProps) {
  return (
    <div
      id={id}
      className={`relative p-5 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.01] ${
        highlight 
          ? "glass-card-glow-blue border-sky-400/30" 
          : ""
      } ${
        isDarkMode 
          ? "glass-panel text-white" 
          : "glass-panel-light text-slate-800"
      }`}
    >
      {/* Corner radial glow if highlighted */}
      {highlight && (
        <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-400/10 blur-xl rounded-full" />
      )}

      <div className="flex items-start justify-between">
        {/* Header Title */}
        <div className="space-y-1">
          <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase font-sans">
            {title}
          </span>
          <div className="text-2xl font-extrabold tracking-tight font-sans leading-none mt-2">
            {value}
          </div>
        </div>

        {/* Floating Accent Icon */}
        <div className={`p-2 rounded-xl ${
          isDarkMode ? "bg-white/5 text-cyan-400" : "bg-sky-500/10 text-sky-600"
        }`}>
          {icon}
        </div>
      </div>

      {subValue && (
        <div className="text-[11px] text-gray-400 font-medium font-sans mt-3 border-t border-white/5 pt-2">
          {subValue}
        </div>
      )}
    </div>
  );
}
