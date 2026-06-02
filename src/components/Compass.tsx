/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Compass as CompassIcon } from "lucide-react";

interface CompassProps {
  degrees: number; // wind direction angle
  speed: number;   // wind speed
  unit: "metric" | "imperial";
}

export default function Compass({ degrees, speed, unit }: CompassProps) {
  const getDirectionName = (deg: number) => {
    const sectors = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    const index = Math.round(((deg % 360) / 22.5)) % 16;
    return sectors[index];
  };

  const speedLabel = unit === "metric" ? `${speed} m/s` : `${Math.round(speed * 2.237)} mph`;

  return (
    <div className="flex flex-col items-center justify-center space-y-3" id="compass-container">
      {/* Visual Rotating Circular Dial */}
      <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full border border-white/10 flex items-center justify-center bg-black/10 shadow-[inner_0_4px_12px_rgba(0,0,0,0.4)]">
        {/* Ring Cardinal direction letters */}
        <span className="absolute top-1 text-[10px] font-bold text-gray-400 font-mono">N</span>
        <span className="absolute right-2 text-[10px] font-bold text-gray-400 font-mono">E</span>
        <span className="absolute bottom-1 text-[10px] font-bold text-gray-400 font-mono">S</span>
        <span className="absolute left-2 text-[10px] font-bold text-gray-400 font-mono">W</span>

        {/* Tick line graphics rotating indicator */}
        <div className="absolute inset-2 border border-dashed border-white/5 rounded-full pointer-events-none" />

        {/* The Animated spinning arrow */}
        <div 
          className="absolute w-full h-full flex items-center justify-center transition-transform duration-1000 ease-out"
          style={{ transform: `rotate(${degrees}deg)` }}
        >
          {/* Arrow visual pointer */}
          <svg className="w-10 h-10 md:w-12 md:h-12 drop-shadow-[0_0_8px_rgba(0,198,255,0.6)]" viewBox="0 0 24 24" fill="none">
            {/* North pointing arrow part (Cyan) */}
            <path
              d="M12 2L16 11H12V2Z"
              fill="#00c6ff"
              stroke="#00c6ff"
              strokeWidth="1"
              strokeLinejoin="round"
            />
            {/* Tail pointing part (Subtle White) */}
            <path
              d="M12 22L16 13H12V22Z"
              fill="rgba(255, 255, 255, 0.4)"
              stroke="rgba(255, 255, 255, 0.4)"
              strokeWidth="1"
              strokeLinejoin="round"
            />
            {/* Split arrow visual structure for 3D depth */}
            <path
              d="M12 2L8 11H12V2Z"
              fill="#0099cc"
              stroke="#0099cc"
              strokeWidth="1"
              strokeLinejoin="round"
            />
            <path
              d="M12 22L8 13H12V22Z"
              fill="rgba(255, 255, 255, 0.2)"
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth="1"
              strokeLinejoin="round"
            />
            {/* Center golden rivet pin */}
            <circle cx="12" cy="12" r="1.5" fill="#FFD700" />
          </svg>
        </div>

        {/* Soft layout detail */}
        <div className="absolute text-center">
          <CompassIcon className="w-4 h-4 text-white/10 mx-auto" />
        </div>
      </div>

      {/* Numeric Indicator footer */}
      <div className="text-center">
        <div className="text-lg font-bold text-white tracking-wide font-sans">{speedLabel}</div>
        <div className="text-xs text-gray-400 font-medium">
          Heading: {degrees}° ({getDirectionName(degrees)})
        </div>
      </div>
    </div>
  );
}
