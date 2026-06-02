/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from "react";
import { HourlyForecast } from "../types";

interface HourlyChartProps {
  hourlyData: HourlyForecast[];
  unit: "metric" | "imperial";
  isDarkMode: boolean;
}

export default function HourlyChart({
  hourlyData,
  unit,
  isDarkMode
}: HourlyChartProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<any | null>(null);
  const [chartLoaded, setChartLoaded] = useState<boolean>(false);

  // Labels and temps depends on the unit chosen
  const labels = hourlyData.map((d) => d.time);
  const temperatures = hourlyData.map((d) => (unit === "metric" ? d.temp : Math.round((d.temp * 9) / 5 + 32)));

  useEffect(() => {
    // Dynamic import safety check for window.Chart
    const Chart = (window as any).Chart;
    if (Chart) {
      setChartLoaded(true);
    } else {
      // Poll a few times if script load was slightly delayed
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if ((window as any).Chart) {
          setChartLoaded(true);
          clearInterval(interval);
        } else if (attempts > 15) {
          clearInterval(interval);
        }
      }, 300);
      return () => clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    const Chart = (window as any).Chart;
    if (!chartLoaded || !Chart || !canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    // Destroy existing chart if any
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    // Creating beautiful premium styling curves
    const primaryGlowColor = isDarkMode ? "rgba(0, 198, 255, 0.9)" : "rgba(32, 90, 240, 0.9)";
    const fillGlowColor = isDarkMode ? "rgba(0, 198, 255, 0.15)" : "rgba(32, 90, 240, 0.08)";

    const gradient = ctx.createLinearGradient(0, 0, 0, 200);
    gradient.addColorStop(0, fillGlowColor);
    gradient.addColorStop(1, "rgba(0,0,0,0)");

    // Initialize custom premium Chart.js options
    const newChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: `Temperature (°${unit === "metric" ? "C" : "F"})`,
            data: temperatures,
            borderColor: primaryGlowColor,
            borderWidth: 3,
            pointBackgroundColor: primaryGlowColor,
            pointBorderColor: "#ffffff",
            pointBorderWidth: 1.5,
            pointRadius: 5,
            pointHoverRadius: 7,
            backgroundColor: gradient,
            fill: true,
            tension: 0.4, // ultra-smooth curve
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false, // Clean, no legend clutter
          },
          tooltip: {
            enabled: true,
            mode: "index",
            intersect: false,
            backgroundColor: "rgba(10, 14, 30, 0.85)",
            backdropFilter: "blur(12px)",
            borderWidth: 1,
            borderColor: "rgba(255, 255, 255, 0.1)",
            titleFont: {
              family: "Outfit",
              size: 13,
              weight: "600"
            },
            bodyFont: {
              family: "Outfit",
              size: 14
            },
            padding: 10,
            displayColors: false,
            callbacks: {
              label: function (context: any) {
                return `  Temp: ${context.parsed.y}°${unit === "metric" ? "C" : "F"}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false, // hide vertical lines for premium look
            },
            ticks: {
              color: isDarkMode ? "rgba(255,255,255,0.6)" : "rgba(15,23,42,0.6)",
              font: {
                family: "Outfit",
                size: 11
              }
            }
          },
          y: {
            grid: {
              color: isDarkMode ? "rgba(255,255,255,0.04)" : "rgba(15,23,42,0.05)",
              drawBorder: false,
            },
            ticks: {
              display: true,
              color: isDarkMode ? "rgba(255,255,255,0.6)" : "rgba(15,23,42,0.6)",
              font: {
                family: "Outfit",
                size: 11
              },
              callback: function (val: any) {
                return `${val}°`;
              }
            }
          }
        },
        interaction: {
          intersect: false,
          mode: "nearest",
        }
      }
    });

    chartInstanceRef.current = newChart;

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [hourlyData, unit, chartLoaded, isDarkMode]);

  // Premium fall-back graphic (beautiful styled SVG Chart)
  // rendered if Chart.js script fails or is slow to load
  if (!chartLoaded) {
    const maxTemp = Math.max(...temperatures);
    const minTemp = Math.min(...temperatures);
    const range = maxTemp - minTemp || 1;
    const height = 140;
    const padding = 20;
    
    // Procedural SVG points
    const points = temperatures.map((temp, i) => {
      const x = padding + (i / (temperatures.length - 1)) * (360 - padding * 2);
      const y = height - padding - ((temp - minTemp) / range) * (height - padding * 2);
      return { x, y, temp };
    });

    const dPath = points.reduce((acc, p, i) => {
      if (i === 0) return `M ${p.x} ${p.y}`;
      // Cubic bezier control points for beautiful layout curves
      const prev = points[i - 1];
      const cp1X = prev.x + (p.x - prev.x) / 2;
      const cp1Y = prev.y;
      const cp2X = prev.x + (p.x - prev.x) / 2;
      const cp2Y = p.y;
      return `${acc} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${p.x} ${p.y}`;
    }, "");

    // Closing points for a beautiful gradient layout
    const fillPath = `${dPath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

    return (
      <div className="relative w-full h-[180px] flex flex-col justify-center items-center">
        <div className="absolute top-2 left-4 text-xs font-mono text-cyan-400">
          ✨ Custom High-Fidelity Render Engine
        </div>
        <svg viewBox={`0 0 360 ${height}`} className="w-full h-full max-h-[160px] cursor-crosshair">
          <defs>
            <linearGradient id="svgGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00c6ff" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#00c6ff" stopOpacity="0" />
            </linearGradient>
            <filter id="neonShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#00c6ff" floodOpacity="0.3" />
            </filter>
          </defs>
          
          {/* Horizontal Grid lines */}
          <line x1="10" y1={height/2} x2="350" y2={height/2} stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" />
          <line x1="10" y1={height - padding} x2="350" y2={height - padding} stroke="rgba(255,255,255,0.06)" />

          {/* Area under curve */}
          <path d={fillPath} fill="url(#svgGlow)" />

          {/* Glowing Line */}
          <path d={dPath} fill="none" stroke="#00c6ff" strokeWidth="2.5" filter="url(#neonShadow)" />

          {/* Point indicators */}
          {points.map((p, i) => (
            <g key={i} className="group/pt">
              <circle
                cx={p.x}
                cy={p.y}
                r="4.5"
                fill="#00c6ff"
                stroke="#ffffff"
                strokeWidth="1.5"
                className="transition-transform duration-200 hover:scale-150 cursor-pointer"
              />
              <text
                x={p.x}
                y={p.y - 10}
                className="font-sans font-medium text-[10px] text-center fill-white opacity-90 text-anchor-middle"
                style={{ textAnchor: "middle" }}
              >
                {p.temp}°
              </text>
              <text
                x={p.x}
                y={height - 4}
                className="font-sans font-light text-[9px] fill-gray-400"
                style={{ textAnchor: "middle" }}
              >
                {labels[i]}
              </text>
            </g>
          ))}
        </svg>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[220px] md:h-[200px]" id="hourly-canvas-container">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
