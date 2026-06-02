/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

interface BrandLogoProps {
  className?: string;
  showText?: boolean;
}

export default function BrandLogo({ className = "h-8", showText = true }: BrandLogoProps) {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Precision Recreated SVGAbrand Logo Icon */}
      <svg
        viewBox="0 0 160 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto filter drop-shadow-[0_2px_10px_rgba(56,189,248,0.25)]"
      >
        <defs>
          {/* Metallic light silver gradients */}
          <linearGradient id="silverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#d8e8f3" />
            <stop offset="100%" stopColor="#8fa9bc" />
          </linearGradient>

          {/* Deep blue chrome / tealy gradient */}
          <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8bc3eb" />
            <stop offset="40%" stopColor="#3172a3" />
            <stop offset="75%" stopColor="#122d41" />
            <stop offset="100%" stopColor="#0a1a24" />
          </linearGradient>

          {/* Glow filter */}
          <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* --- SIGNAL BROADCAST ARCS --- */}
        {/* Inner Arc */}
        <path
          d="M 68 28 A 15 15 0 0 1 92 28"
          stroke="url(#silverGradient)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Middle Arc */}
        <path
          d="M 61 22 A 25 25 0 0 1 99 22"
          stroke="url(#silverGradient)"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.85"
        />
        {/* Outer Arc */}
        <path
          d="M 54 16 A 35 35 0 0 1 106 16"
          stroke="url(#silverGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.7"
        />

        {/* --- CLOUD INFINITY BODY --- */}
        {/* Beautiful high precision layered stroke depicting the metallic curves */}
        
        {/* Base dark chrome drop-shadow outline accent */}
        <path
          d="M 52 72 
             C 32 72, 28 50, 48 46 
             C 44 26, 76 18, 86 36 
             C 100 24, 126 34, 124 58 
             C 142 54, 142 86, 114 86 
             C 86 86, 72 86, 68 86
             C 62 86, 52 72, 72 72
             C 102 72, 114 74, 112 80"
          stroke="url(#blueGradient)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.9"
        />

        {/* Foreground metallic Silver main core curve matching perfectly */}
        <path
          d="M 50 74 
             C 34 74, 30 54, 48 50 
             C 46 30, 76 22, 86 38 
             C 98 26, 122 36, 121 60 
             C 138 58, 138 84, 114 84 
             L 76 84 
             C 66 84, 58 74, 76 74
             L 106 74
             C 114 74, 118 78, 110 82"
          stroke="url(#silverGradient)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Inner glow line highlight */}
        <path
          d="M 46 54
             C 44 38, 72 30, 80 44
             C 92 32, 114 40, 115 62"
          stroke="#ffffff"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.6"
        />
      </svg>

      {/* Text Branding with pristine styling matching the image precisely */}
      {showText && (
        <div className="flex flex-col select-none leading-none items-start">
          <span className="text-2xl font-bold font-sans tracking-[0.14em] text-white brightness-110 uppercase drop-shadow-sm font-sans">
            SKYCAST
          </span>
          <span className="text-[7.5px] tracking-[0.27em] text-cyan-400 font-semibold font-sans uppercase mt-1 opacity-90">
            WEATHER BROADCASTING
          </span>
        </div>
      )}
    </div>
  );
}
