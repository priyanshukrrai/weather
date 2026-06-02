/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Sun, Sunset, Sunrise } from "lucide-react";

interface SunArcProps {
  sunriseSec: number;
  sunsetSec: number;
  timezoneOffsetSec: number;
}

export default function SunArc({
  sunriseSec,
  sunsetSec,
  timezoneOffsetSec
}: SunArcProps) {
  // Convert timestamps to beautiful local strings
  const formatTime = (epochSec: number) => {
    const d = new Date((epochSec) * 1000);
    // Standard UTC calculation based on location offset
    const utcTime = d.getTime() + (d.getTimezoneOffset() * 60000);
    const localDate = new Date(utcTime + (timezoneOffsetSec * 1000));
    
    return localDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };

  const sunriseLabel = formatTime(sunriseSec);
  const sunsetLabel = formatTime(sunsetSec);

  // Day progress algorithm
  const nowSec = Math.floor(Date.now() / 1000);
  let progress = 0; // 0 to 1

  if (nowSec > sunsetSec) {
    progress = 1;
  } else if (nowSec < sunriseSec) {
    progress = 0;
  } else {
    // Current progress line
    progress = (nowSec - sunriseSec) / (sunsetSec - sunriseSec || 1);
  }

  // Trigonometric coordinates for the sun tracker on the visual arc
  // Angle extends from Math.PI (180deg = Left = Sunrise) to 0 (0deg = Right = Sunset)
  const angle = Math.PI - progress * Math.PI;
  const radiusX = 85;
  const radiusY = 45;
  const centerX = 100;
  const centerY = 65;

  // Ellipse parametric point
  const sunX = centerX + radiusX * Math.cos(angle);
  const sunY = centerY - radiusY * Math.sin(angle);

  const percentageInt = Math.round(progress * 100);

  return (
    <div className="flex flex-col items-center justify-center p-2" id="sun-arc-container">
      {/* Curved SVG Archway */}
      <div className="relative w-full max-w-[240px] h-[100px] flex justify-center">
        <svg viewBox="0 0 200 80" className="w-full h-full overflow-visible">
          <defs>
            {/* Sunrise-sunset gradient */}
            <linearGradient id="arcStrokeGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#FFD700" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#00c6ff" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.4" />
            </linearGradient>
            
            {/* Ambient sun glow filters */}
            <filter id="sunArcGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Golden horizon ground level line */}
          <line
            x1="10"
            y1="65"
            x2="190"
            y2="65"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="1"
          />

          {/* Dotted path (Completed & Remaining trajectory) */}
          <path
            d={`M ${centerX - radiusX} ${centerY} A ${radiusX} ${radiusY} 0 0 1 ${centerX + radiusX} ${centerY}`}
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Active travel path (drawn with gradient) */}
          <path
            d={`M ${centerX - radiusX} ${centerY} A ${radiusX} ${radiusY} 0 0 1 ${centerX + radiusX} ${centerY}`}
            fill="none"
            stroke="url(#arcStrokeGrad)"
            strokeWidth="2"
            strokeDasharray={`${progress * 267} 300`} // ~267px is custom ellipse semi-circumference length
          />

          {/* Golden Sun tracker bead */}
          {progress > 0 && progress < 1 && (
            <g filter="url(#sunArcGlow)">
              {/* Outer Pulsing Aura */}
              <circle
                cx={sunX}
                cy={sunY}
                r="7"
                fill="rgba(255, 215, 0, 0.35)"
                className="animate-pulse"
              />
              <circle
                cx={sunX}
                cy={sunY}
                r="4.5"
                fill="#FFD700"
                stroke="#ffffff"
                strokeWidth="1"
              />
            </g>
          )}
        </svg>

        {/* Float Sunrise Icons left and sunset right */}
        <div className="absolute left-0 bottom-1 flex items-center space-x-1">
          <Sunrise className="w-3.5 h-3.5 text-yellow-400" />
          <span className="text-[10px] font-mono font-medium text-gray-400">{sunriseLabel}</span>
        </div>
        <div className="absolute right-0 bottom-1 flex items-center space-x-1">
          <Sunset className="w-3.5 h-3.5 text-orange-400" />
          <span className="text-[10px] font-mono font-medium text-gray-400">{sunsetLabel}</span>
        </div>
      </div>

      {/* Sun stats feedback */}
      <div className="text-center mt-2">
        <div className="text-xs text-gray-400 font-sans tracking-wide">
          {nowSec < sunriseSec ? (
            <span>Twilight ascending · Sun starts at {sunriseLabel}</span>
          ) : nowSec > sunsetSec ? (
            <span>Night mode · Sun set at {sunsetLabel}</span>
          ) : (
            <span>Daylight progress: <strong className="text-yellow-400 font-bold">{percentageInt}%</strong> elapsed</span>
          )}
        </div>
      </div>
    </div>
  );
}
