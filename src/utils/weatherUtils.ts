/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { WeatherData, AirQuality, HourlyForecast, DailyForecast } from "../types";

// Famous global cities for premium autocomplete recommendations
export interface AutocompleteCity {
  name: string;
  country: string;
  countryCode: string;
  lat: number;
  lon: number;
  signatureCondition: string; // Used to customize mock weather naturally
}

export const POPULAR_CITIES: AutocompleteCity[] = [
  { name: "Tokyo", country: "Japan", countryCode: "JP", lat: 35.6762, lon: 139.6503, signatureCondition: "Clear" },
  { name: "New York", country: "United States", countryCode: "US", lat: 40.7128, lon: -74.0060, signatureCondition: "Clouds" },
  { name: "London", country: "United Kingdom", countryCode: "GB", lat: 51.5074, lon: -0.1278, signatureCondition: "Rain" },
  { name: "Paris", country: "France", countryCode: "FR", lat: 48.8566, lon: 2.3522, signatureCondition: "Clear" },
  { name: "Sydney", country: "Australia", countryCode: "AU", lat: -33.8688, lon: 151.2093, signatureCondition: "Sunny" },
  { name: "Mumbai", country: "India", countryCode: "IN", lat: 19.0760, lon: 72.8777, signatureCondition: "Sunny" },
  { name: "Cairo", country: "Egypt", countryCode: "EG", lat: 30.0444, lon: 31.2357, signatureCondition: "Sunny" },
  { name: "Reykjavik", country: "Iceland", countryCode: "IS", lat: 64.1466, lon: -21.9426, signatureCondition: "Snow" },
  { name: "Rio de Janeiro", country: "Brazil", countryCode: "BR", lat: -22.9068, lon: -43.1729, signatureCondition: "Sunny" },
  { name: "Cape Town", country: "South Africa", countryCode: "ZA", lat: -33.9249, lon: 18.4241, signatureCondition: "Clouds" },
  { name: "Delhi", country: "India", countryCode: "IN", lat: 28.6139, lon: 77.2090, signatureCondition: "Sunny" },
  { name: "Singapore", country: "Singapore", countryCode: "SG", lat: 1.3521, lon: 103.8198, signatureCondition: "Rain" },
  { name: "Dubai", country: "United Arab Emirates", countryCode: "AE", lat: 25.2048, lon: 55.2708, signatureCondition: "Sunny" },
  { name: "Vancouver", country: "Canada", countryCode: "CA", lat: 49.2827, lon: -123.1207, signatureCondition: "Clouds" },
  { name: "Zermatt", country: "Switzerland", countryCode: "CH", lat: 46.0207, lon: 7.7491, signatureCondition: "Snow" }
];

// Helper to secure flag emojis for standard country codes
export function getCountryFlagEmoji(countryCode: string): string {
  if (!countryCode) return "🌍";
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map(char => 127397 + char.charCodeAt(0));
  try {
    return String.fromCodePoint(...codePoints);
  } catch (e) {
    return "🌍";
  }
}

// Convert temperature values
export function cToF(c: number): number {
  return Math.round((c * 9) / 5 + 32);
}

export function formatTemp(c: number, unit: "metric" | "imperial"): string {
  const rounded = Math.round(c);
  if (unit === "metric") {
    return `${rounded}°C`;
  }
  return `${cToF(rounded)}°F`;
}

// Poetic AI-Weather tagline generator based on metrics
export function getWeatherPoetry(
  condition: string,
  city: string,
  temp: number,
  windSpeed: number,
  timeOfDay: "day" | "night"
): string {
  const cond = condition.toLowerCase();
  
  if (cond.includes("clear")) {
    if (timeOfDay === "night") {
      return `The velvet night is absolute and starlit over ${city}. A serene calm settles as deep horizons rest under stardust whispers. 🌌`;
    }
    return `Golden, bright rays of raw solar clarity pour over ${city}. The skies stretch to an infinite azure canopy. ☀️`;
  }
  
  if (cond.includes("rain") || cond.includes("drizzle") || cond.includes("shower")) {
    return `Raindrops play a subtle syncopated jazz rhythm on the windowpanes of ${city}. Earth of glass and wet stones, cloaked in a cool, romantic mist. 🌧️`;
  }
  
  if (cond.includes("snow") || cond.includes("ice") || cond.includes("blizzard")) {
    return `${city} is draped in a pristine, cinematic blanket of silent, crystalline snow. An ancient quietude wraps the streets in glacial grace. ❄️`;
  }
  
  if (cond.includes("thunder") || cond.includes("storm") || cond.includes("lightning")) {
    return `Electric sparks dance across dark, violet rainclouds above ${city}. Nature sings in deep, low baritone rumbles of lightning power. ⚡`;
  }
  
  if (cond.includes("cloud") || cond.includes("overcast")) {
    return `Gently layered cotton castles drift in a soft, elegant ceiling above ${city}. Cool shadows rest over the streets with comfortable moodiness. ☁️`;
  }
  
  if (temp > 30) {
    return `A warm, lingering solar glow wraps ${city} in amber heat. The air is ripe with tropical warmth and active summer spirits. 🌡️`;
  }
  
  if (windSpeed > 8) {
    return `A brisk, cinematic wind sweeps along the lanes of ${city}. Crisp, dancing breezes paint rustling lines through park canopy trees. 🌬️`;
  }
  
  return `A soft, comfortable equilibrium blankets ${city} today. The weather whispers a relaxing, calm harmony in beautiful balance. 🍃`;
}

// Determines moon phase name from moon fraction
export function getMoonPhaseDetails(fraction: number): { name: string; icon: string } {
  if (fraction < 0.03 || fraction > 0.97) return { name: "New Moon", icon: "🌑" };
  if (fraction >= 0.03 && fraction < 0.22) return { name: "Waxing Crescent", icon: "🌒" };
  if (fraction >= 0.22 && fraction < 0.28) return { name: "First Quarter", icon: "🌓" };
  if (fraction >= 0.28 && fraction < 0.47) return { name: "Waxing Gibbous", icon: "🌔" };
  if (fraction >= 0.47 && fraction < 0.53) return { name: "Full Moon", icon: "🌕" };
  if (fraction >= 0.53 && fraction < 0.72) return { name: "Waning Gibbous", icon: "🌖" };
  if (fraction >= 0.72 && fraction < 0.78) return { name: "Last Quarter", icon: "🌗" };
  return { name: "Waning Crescent", icon: "🌘" };
}

// Format local time from timezone offsets
export function getLocalTimeOfCity(timezoneOffsetSec: number): string {
  const utcDate = new Date();
  const utcTime = utcDate.getTime() + (utcDate.getTimezoneOffset() * 60000);
  const localDate = new Date(utcTime + (timezoneOffsetSec * 1000));
  
  return localDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
}

// Determine if Day or Night in the searched city
export function isDayInCity(sunrise: number, sunset: number, timezoneOffsetSec: number): boolean {
  const utcDate = new Date();
  const utcTime = utcDate.getTime() + (utcDate.getTimezoneOffset() * 60000);
  const localDate = new Date(utcTime + (timezoneOffsetSec * 1000));
  const currentHour = localDate.getHours();
  // Simple heuristic based on hours (6 am to 6:30 pm is day) if timestamps are not available
  return currentHour >= 6 && currentHour < 19;
}

// Fallback high-fidelity Weather Data Simulator
export function generateMockWeatherData(cityName: string): WeatherData {
  const normalizedCity = cityName.trim();
  const popular = POPULAR_CITIES.find(c => c.name.toLowerCase() === normalizedCity.toLowerCase());
  
  const country = popular?.country || "Earth";
  const countryCode = popular?.countryCode || "UN";
  const signature = popular?.signatureCondition || "Clear";
  
  // Custom baseline temp depending on signature
  let baseTemp = 20;
  let condition = signature;
  let description = "mostly clear skies";
  
  if (signature === "Snow" || normalizedCity.toLowerCase().includes("reykjavik") || normalizedCity.toLowerCase().includes("zermatt") || normalizedCity.toLowerCase().includes("iceland")) {
    baseTemp = -2;
    condition = "Snow";
    description = "soft drifting snowflakes";
  } else if (signature === "Rain" || normalizedCity.toLowerCase().includes("london") || normalizedCity.toLowerCase().includes("singapore")) {
    baseTemp = 14;
    condition = "Rain";
    description = "gentle rhythmic rainfall";
  } else if (signature === "Clouds" || normalizedCity.toLowerCase().includes("vancouver") || normalizedCity.toLowerCase().includes("cape town")) {
    baseTemp = 16;
    condition = "Clouds";
    description = "cinematic scattered clouds";
  } else if (signature === "Sunny" || normalizedCity.toLowerCase().includes("dubai") || normalizedCity.toLowerCase().includes("mumbai") || normalizedCity.toLowerCase().includes("cairo")) {
    baseTemp = 34;
    condition = "Sunny"; // Custom beautiful condition
    description = "vibrant endless sunshine";
  }
  
  // Random variance
  const randomVariance = Math.floor(Math.sin(normalizedCity.charCodeAt(0)) * 6);
  baseTemp = baseTemp + randomVariance;
  
  const tempMax = baseTemp + 4 + Math.round(Math.random() * 2);
  const tempMin = baseTemp - 5 - Math.round(Math.random() * 2);
  const feelsLike = baseTemp + (baseTemp > 28 ? 2 : baseTemp < 5 ? -2 : 0);
  const humidity = condition === "Rain" ? 92 : condition === "Snow" ? 85 : condition === "Clouds" ? 70 : 38;
  const windSpeed = condition === "Stormy" ? 18.4 : condition === "Rain" ? 7.2 : 3.6 + Math.round(Math.random() * 6);
  const windDeg = Math.round(Math.random() * 360);
  const visibility = condition === "Rain" ? 6000 : condition === "Snow" ? 4000 : 10000;
  const pressure = 1012 + Math.round(Math.random() * 8);
  const cloudCover = condition === "Sunny" ? 2 : condition === "Clear" ? 5 : condition === "Clouds" ? 65 : 98;
  const uvIndex = condition === "Sunny" ? 9 : condition === "Clear" ? 7 : condition === "Clouds" ? 3 : 1;
  const dewPoint = Math.round(baseTemp - ((100 - humidity)/5));
  
  // Sunrise/Sunset anchors (represented as local epoch seconds offset)
  const sunrise = Math.floor(Date.now() / 1000) - 18000; // 5 hours ago
  const sunset = Math.floor(Date.now() / 1000) + 18000; // 5 hours from now
  const timezoneOffset = popular ? popular.lat * 400 : 0; // Simulated
  
  // Moon info
  const moonSeed = (normalizedCity.charCodeAt(0) % 10) / 10;
  const moonPhaseDetails = getMoonPhaseDetails(moonSeed);
  
  // Air Quality
  const airQualityLevels = [1, 2, 2, 3, 1, 4, 1];
  const aqiValue = airQualityLevels[normalizedCity.charCodeAt(0) % airQualityLevels.length];
  const aqi: AirQuality = {
    aqi: aqiValue,
    pm2_5: aqiValue === 1 ? 12 : aqiValue === 2 ? 24 : aqiValue === 3 ? 48 : 88,
    pm10: aqiValue === 1 ? 22 : aqiValue === 2 ? 38 : aqiValue === 3 ? 62 : 110,
    o3: 35 + aqiValue * 10,
    no2: 8 + aqiValue * 6
  };
  
  // Hourly list
  const hourly: HourlyForecast[] = [];
  const hoursOfForecast = [9, 12, 15, 18, 21, 0, 3, 6];
  const conditions = [condition, condition, "Clouds", condition, "Clear", "Clear", "Clouds", condition];
  
  const currentHour = new Date().getHours();
  for (let i = 0; i < 8; i++) {
    const hr = (currentHour + i * 3) % 24;
    const isAm = hr < 12;
    const dispHour = hr === 0 ? 12 : hr > 12 ? hr - 12 : hr;
    const label = `${dispHour}:00 ${isAm ? "AM" : "PM"}`;
    
    // Natural temperature curve over day-night cycles
    const hourFactor = Math.sin(((hr - 6) / 24) * 2 * Math.PI); // Peak temp around 2pm (Hour 14)
    const hTemp = Math.round(baseTemp + hourFactor * 5 + (Math.random() - 0.5) * 2);
    
    hourly.push({
      time: label,
      temp: hTemp,
      icon: conditions[i % conditions.length].toLowerCase(),
      condition: conditions[i % conditions.length],
      rainChance: conditions[i % conditions.length] === "Rain" ? 85 : conditions[i % conditions.length] === "Snow" ? 75 : 10,
      pop: conditions[i % conditions.length] === "Rain" ? 0.85 : 0.1
    });
  }
  
  // 7-day Daily list
  const daily: DailyForecast[] = [];
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const tomorrow = new Date();
  
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(tomorrow.getDate() + i);
    const dayName = i === 0 ? "Today" : days[d.getDay()];
    const dateLabel = `${months[d.getMonth()]} ${d.getDate()}`;
    
    const dayVariance = Math.sin(i) * 3;
    const dMax = Math.round(tempMax + dayVariance);
    const dMin = Math.round(tempMin + dayVariance);
    
    let dCond = condition;
    if (i % 3 === 1) dCond = "Clouds";
    if (i % 5 === 2) dCond = "Clear";
    
    daily.push({
      dayName,
      dateLabel,
      tempMax: dMax,
      tempMin: dMin,
      icon: dCond.toLowerCase(),
      condition: dCond,
      rainChance: dCond === "Rain" ? 80 : dCond === "Snow" ? 70 : 15,
      humidity: dCond === "Rain" ? 90 : 45
    });
  }
  
  const poem = getWeatherPoetry(
    condition,
    normalizedCity,
    baseTemp,
    windSpeed,
    isDayInCity(sunrise, sunset, timezoneOffset) ? "day" : "night"
  );
  
  return {
    city: normalizedCity,
    country,
    countryCode,
    temp: baseTemp,
    tempMax,
    tempMin,
    feelsLike,
    condition,
    description,
    humidity,
    windSpeed,
    windDeg,
    visibility,
    pressure,
    uvIndex,
    sunrise,
    sunset,
    timezoneOffset,
    localTime: getLocalTimeOfCity(timezoneOffset),
    dewPoint,
    cloudCover,
    moonPhase: moonSeed,
    moonPhaseName: moonPhaseDetails.name,
    aqi,
    hourly,
    daily,
    poetry: poem
  };
}

// Fetch Real Weather Data from OpenWeatherMap API
export async function fetchRealWeatherData(
  cityName: string,
  apiKey: string
): Promise<WeatherData> {
  if (!apiKey) {
    throw new Error("API Key is required");
  }
  
  // 1. Current Weather
  const weatherRes = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      cityName
    )}&appid=${apiKey}&units=metric`
  );
  if (!weatherRes.ok) {
    throw new Error(`City "${cityName}" not found or API rejected request.`);
  }
  const weatherData = await weatherRes.json();
  const { lat, lon } = weatherData.coord;
  
  // 2. Forecast Weather
  const forecastRes = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
      cityName
    )}&appid=${apiKey}&units=metric`
  );
  let hourlyForecasts: HourlyForecast[] = [];
  let dailyForecasts: DailyForecast[] = [];
  
  if (forecastRes.ok) {
    const forecastData = await forecastRes.json();
    
    // Group into 3-hour increments for hourly chart (take matching 8 entries max for 24 hours)
    const list = forecastData.list || [];
    hourlyForecasts = list.slice(0, 8).map((item: any) => {
      const dt = new Date(item.dt * 1000);
      const isAm = dt.getHours() < 12;
      const hours = dt.getHours() === 0 ? 12 : dt.getHours() > 12 ? dt.getHours() - 12 : dt.getHours();
      const label = `${hours}:00 ${isAm ? "AM" : "PM"}`;
      
      return {
        time: label,
        temp: Math.round(item.main.temp),
        icon: item.weather[0]?.main || "Clear",
        condition: item.weather[0]?.main || "Clear",
        rainChance: Math.round((item.pop || 0) * 100),
        pop: item.pop || 0
      };
    });
    
    // Group into 5-day / daily forecasts (by selecting lunch time 12:00 entries for weather patterns)
    const daysMap: { [key: string]: any[] } = {};
    list.forEach((item: any) => {
      const dateStr = item.dt_txt.split(" ")[0]; // yyyy-mm-dd
      if (!daysMap[dateStr]) {
        daysMap[dateStr] = [];
      }
      daysMap[dateStr].push(item);
    });
    
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    Object.keys(daysMap).slice(0, 7).forEach((dateKey, index) => {
      const items = daysMap[dateKey];
      // Find max and min temp
      let tMax = -999;
      let tMin = 999;
      items.forEach(h => {
        if (h.main.temp_max > tMax) tMax = h.main.temp_max;
        if (h.main.temp_min < tMin) tMin = h.main.temp_min;
      });
      // Match mid-day item for condition info
      const midItem = items[Math.floor(items.length / 2)] || items[0];
      const dt = new Date(midItem.dt * 1000);
      const dayName = index === 0 ? "Today" : days[dt.getDay()];
      const dateLabel = `${months[dt.getMonth()]} ${dt.getDate()}`;
      
      dailyForecasts.push({
        dayName,
        dateLabel,
        tempMax: Math.round(tMax),
        tempMin: Math.round(tMin),
        icon: midItem.weather[0]?.main || "Clear",
        condition: midItem.weather[0]?.main || "Clear",
        rainChance: Math.round((midItem.pop || 0) * 100),
        humidity: midItem.main.humidity
      });
    });
  }
  
  // 3. Air Pollution Index
  let aqi: AirQuality = { aqi: 1, pm2_5: 10, pm10: 15, o3: 31, no2: 5 };
  try {
    const pollutionRes = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
    );
    if (pollutionRes.ok) {
      const pollutionData = await pollutionRes.json();
      const firstComponent = pollutionData.list?.[0];
      if (firstComponent) {
        aqi = {
          aqi: firstComponent.main?.aqi || 1,
          pm2_5: Math.round(firstComponent.components?.pm2_5 || 10),
          pm10: Math.round(firstComponent.components?.pm10 || 15),
          o3: Math.round(firstComponent.components?.o3 || 32),
          no2: Math.round(firstComponent.components?.no2 || 6)
        };
      }
    }
  } catch (err) {
    console.error("AQI fetch failed:", err);
  }
  
  const temp = Math.round(weatherData.main.temp);
  const condition = weatherData.weather[0]?.main || "Clear";
  const poet = getWeatherPoetry(
    condition,
    weatherData.name,
    temp,
    weatherData.wind?.speed || 0,
    isDayInCity(weatherData.sys.sunrise, weatherData.sys.sunset, weatherData.timezone) ? "day" : "night"
  );
  
  // Synthesize custom metrics
  const moonPhaseSeed = (weatherData.name.charCodeAt(0) % 10) / 10;
  const moonPhaseDetails = getMoonPhaseDetails(moonPhaseSeed);
  const cloudCover = weatherData.clouds?.all || 0;
  const dewPoint = Math.round(temp - ((100 - weatherData.main.humidity)/5));
  
  return {
    city: weatherData.name,
    country: weatherData.sys.country || "Unknown",
    countryCode: weatherData.sys.country || "",
    temp,
    tempMax: Math.round(weatherData.main.temp_max),
    tempMin: Math.round(weatherData.main.temp_min),
    feelsLike: Math.round(weatherData.main.feels_like),
    condition,
    description: weatherData.weather[0]?.description || "clear",
    humidity: weatherData.main.humidity,
    windSpeed: weatherData.wind?.speed || 0,
    windDeg: weatherData.wind?.deg || 0,
    visibility: weatherData.visibility || 10000,
    pressure: weatherData.main.pressure,
    uvIndex: condition === "Rain" ? 1 : condition === "Snow" ? 1 : cloudCover > 80 ? 2 : cloudCover > 50 ? 4 : 7,
    sunrise: weatherData.sys.sunrise,
    sunset: weatherData.sys.sunset,
    timezoneOffset: weatherData.timezone,
    localTime: getLocalTimeOfCity(weatherData.timezone),
    dewPoint,
    cloudCover,
    moonPhase: moonPhaseSeed,
    moonPhaseName: moonPhaseDetails.name,
    aqi,
    hourly: hourlyForecasts.length > 0 ? hourlyForecasts : generateMockWeatherData(weatherData.name).hourly,
    daily: dailyForecasts.length > 0 ? dailyForecasts : generateMockWeatherData(weatherData.name).daily,
    poetry: poet
  };
}
