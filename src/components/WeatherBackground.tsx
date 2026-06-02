/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import { isDayInCity } from "../utils/weatherUtils";

interface CurrentWeatherDetails {
  condition: string;
  isDay: boolean;
}

export default function WeatherBackground({
  condition,
  isDay
}: CurrentWeatherDetails) {
  const [raindrops, setRaindrops] = useState<any[]>([]);
  const [snowflakes, setSnowflakes] = useState<any[]>([]);
  const [stars, setStars] = useState<any[]>([]);

  const cond = condition ? condition.toLowerCase() : "clear";

  // Create weather particles when condition updates
  useEffect(() => {
    // Rain droplets
    if (cond.includes("rain") || cond.includes("storm") || cond.includes("thunder") || cond.includes("drizzle")) {
      const drops = Array.from({ length: 65 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 2.5}s`,
        duration: `${0.8 + Math.random() * 1.2}s`,
        opacity: 0.1 + Math.random() * 0.4
      }));
      setRaindrops(drops);
      setSnowflakes([]);
    }
    // Snow flakes
    else if (cond.includes("snow") || cond.includes("ice") || cond.includes("frost")) {
      const flakes = Array.from({ length: 45 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 6}s`,
        duration: `${4 + Math.random() * 7}s`,
        size: `${2 + Math.random() * 5}px`,
        opacity: 0.2 + Math.random() * 0.7
      }));
      setSnowflakes(flakes);
      setRaindrops([]);
    } else {
      setRaindrops([]);
      setSnowflakes([]);
    }

    // Twinkling stars if night
    if (!isDay) {
      const starParticles = Array.from({ length: 80 }).map((_, i) => ({
        id: i,
        top: `${Math.random() * 50}%`, // upper half
        left: `${Math.random() * 100}%`,
        size: `${1 + Math.random() * 3}px`,
        delay: `${Math.random() * 5}s`,
        duration: `${1 + Math.random() * 4}s`
      }));
      setStars(starParticles);
    } else {
      setStars([]);
    }
  }, [cond, isDay]);

  // Determine gradient based on condition & time of day
  // Clear day: deep blue → golden horizon (#0f2027 → #203a43 → #2c5364)
  // Night: midnight navy → deep purple (#0f0c29 → #302b63 → #24243e)
  // Rainy: dark slate → stormy grey (#373b44 → #4286f4)
  // Sunny: warm amber → sky blue (#f7971e → #ffd200 → #56ccf2)
  // Snow: icy white-blue (#e0eafc → #cfdef3)
  // Immersive Travel Landing Page Inspired Color Gradients (luxurious deep teals, volcanic slate, and glowing sunset ambers)
  const getGradientClass = () => {
    if (!isDay) {
      return "from-[#080d19] via-[#0e2133] to-[#1a1c2e]"; // Milkyway ocean night
    }
    if (cond.includes("snow") || cond.includes("ice") || cond.includes("frost")) {
      return "from-[#d5e7e8] via-[#ebf6f6] to-[#afcad1] text-teal-950"; // Morning alpine turquoise snow
    }
    if (cond.includes("rain") || cond.includes("drizzle") || cond.includes("shower")) {
      return "from-[#091b24] via-[#15343d] to-[#2a4d59]"; // Soft misty deep teal rain
    }
    if (cond.includes("storm") || cond.includes("thunder") || cond.includes("lightning")) {
      return "from-[#04090d] via-[#0c1c24] to-[#1a2f38]"; // Heavy stormy ocean abyss
    }
    if (cond.includes("sun") || cond.includes("sunny") || cond.includes("hot")) {
      return "from-[#0a1e27] via-[#21575f] to-[#f97316]"; // Sunrise golden-orange and deep turquoise peaks
    }
    if (cond.includes("cloud") || cond.includes("overcast") || cond.includes("mist") || cond.includes("fog")) {
      return "from-[#0c1f28] via-[#1b3d45] to-[#2f555e]"; // Overcast jade mountain ridges
    }
    // Default Clear Day: Ultra premium deep-lake teal to forest green travel-shot gradient
    return "from-[#091b29] via-[#0d2f35] to-[#174f4b]";
  };

  const isLightBackground = isDay && (cond.includes("snow") || cond.includes("sun") || cond.includes("sunny"));

  return (
    <div
      id="weather-background"
      className={`fixed inset-0 w-full h-full -z-50 overflow-hidden bg-gradient-to-b ${getGradientClass()} transition-all duration-1000 ease-in-out`}
    >
      {/* Lightning Overlay for Stormy Conditions */}
      {(cond.includes("storm") || cond.includes("thunder") || cond.includes("lightning")) && (
        <div id="lightning-strike" className="lightning-bg absolute inset-0 mix-blend-screen pointer-events-none" />
      )}

      {/* Raining Effect Layer */}
      {raindrops.map((drop) => (
        <div
          key={`drop-${drop.id}`}
          className="raindrop"
          style={{
            left: drop.left,
            animationDelay: drop.delay,
            animationDuration: drop.duration,
            opacity: drop.opacity
          }}
        />
      ))}

      {/* Snowfall Effect Layer */}
      {snowflakes.map((flake) => (
        <div
          key={`flake-${flake.id}`}
          className="snowflake"
          style={{
            left: flake.left,
            width: flake.size,
            height: flake.size,
            animationDelay: flake.delay,
            animationDuration: flake.duration,
            opacity: flake.opacity
          }}
        />
      ))}

      {/* Twinkling Night Stars */}
      {!isDay &&
        stars.map((star) => (
          <div
            key={`star-${star.id}`}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              animationDelay: star.delay,
              animationDuration: star.duration
            }}
          />
        ))}

      {/* Rotating / Pulsing Sun Visual (for Sunny days / Clear conditions) */}
      {isDay && (cond.includes("clear") || cond.includes("sun") || cond.includes("sunny")) && (
        <div id="solar-halo-system" className="absolute top-[10%] right-[10%] pointer-events-none md:scale-120 opacity-80">
          {/* Outer Rotating light rays */}
          <div className="sun-rays absolute -inset-16 w-32 h-32 md:w-48 md:h-48 border border-white/5 border-dashed rounded-full" />
          <div className="sun-rays absolute -inset-24 w-48 h-48 md:w-64 md:h-64 border border-white/5 rounded-full rotate-45" />
          {/* Pulsing Halo */}
          <div className="sun-halo absolute -inset-8 w-16 h-16 md:w-32 md:h-32 bg-yellow-400/20 blur-2xl rounded-full" />
          <div className="sun-halo absolute -inset-12 w-24 h-24 md:w-40 md:h-40 bg-orange-400/10 blur-3xl rounded-full" />
          {/* Main Core */}
          <div className="w-12 h-12 md:w-20 md:h-20 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full shadow-[0_0_50px_rgba(255,200,0,0.4)]" />
        </div>
      )}

      {/* Soft drifting clouds for any cloudy background */}
      {(cond.includes("cloud") || cond.includes("overcast") || cond.includes("rain") || cond.includes("storm") || cond.includes("thunder")) && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
          <svg className="cloud-drifter-left absolute w-96 h-40 text-white fill-current top-10" viewBox="0 0 100 100">
            <path d="M10 50 C10 40, 20 30, 35 30 C45 15, 65 15, 75 30 C85 30, 95 38, 95 50 C95 62, 85 70, 75 70 L25 70 C15 70, 10 62, 10 50 Z" />
          </svg>
          <svg className="cloud-drifter-right absolute w-[40rem] h-60 text-white fill-current top-1/3" viewBox="0 0 100 100" style={{ opacity: 0.7 }}>
            <path d="M10 50 C10 40, 20 30, 35 30 C45 15, 65 15, 75 30 C85 30, 95 38, 95 50 C95 62, 85 70, 75 70 L25 70 C15 70, 10 62, 10 50 Z" fillOpacity="0.4" />
          </svg>
        </div>
      )}

      {/* Parallax Depth / Ambient Dark Mist Vignette */}
      <div 
        className={`absolute inset-0 bg-gradient-to-tr ${
          isLightBackground 
            ? "from-[#ffffff]/10 to-transparent" 
            : "from-black/40 via-transparent to-black/15"
        } pointer-events-none`} 
      />
    </div>
  );
}
