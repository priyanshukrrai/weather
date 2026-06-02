/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AirQuality {
  aqi: number; // 1 = Good, 2 = Fair, 3 = Moderate, 4 = Poor, 5 = Very Poor
  no2: number;
  o3: number;
  pm2_5: number;
  pm10: number;
}

export interface HourlyForecast {
  time: string; // e.g., "09:00 AM" or "21:00"
  temp: number;
  icon: string;
  condition: string;
  rainChance: number;
  pop: number; // probability of precipitation (0 to 1)
}

export interface DailyForecast {
  dayName: string; // e.g., "Monday"
  dateLabel: string; // e.g., "June 03"
  tempMax: number;
  tempMin: number;
  icon: string;
  condition: string;
  rainChance: number;
  humidity: number;
}

export interface WeatherData {
  city: string;
  country: string;
  countryCode: string;
  temp: number;
  tempMax: number;
  tempMin: number;
  feelsLike: number;
  condition: string; // e.g., "Rain", "Snow", "Clear", "Clouds", "Stormy", "Sunny"
  description: string; // e.g., "scattered clouds"
  humidity: number;
  windSpeed: number;
  windDeg: number;
  visibility: number; // in meters
  pressure: number; // in hPa
  uvIndex: number;
  sunrise: number; // UTC timestamp
  sunset: number; // UTC timestamp
  timezoneOffset: number; // Seconds from UTC
  localTime: string; // Searched city local time
  dewPoint: number;
  cloudCover: number; // percentage
  moonPhase: number; // 0 to 1 (New Moon to Full Moon to New Moon)
  moonPhaseName: string; // e.g., "Waxing Gibbous"
  aqi: AirQuality;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  poetry: string; // Cinematic custom poetic description
}

export interface Settings {
  apiKey: string;
  unit: "metric" | "imperial"; // Celsius / Fahrenheit
  isDarkMode: boolean;
  isAudioOn: boolean;
  selectedTrack: "rain" | "wind" | "sunny" | "none";
}
