import { useState, useEffect, useCallback } from "react";
import {
  Search,
  RefreshCw,
  Droplets,
  Wind,
  Eye,
  Sunrise,
  Sunset,
  Thermometer,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const WMO_CODES: Record<number, { label: string; icon: string }> = {
  0: { label: "Clear Sky", icon: "☀️" },
  1: { label: "Mainly Clear", icon: "🌤️" },
  2: { label: "Partly Cloudy", icon: "⛅" },
  3: { label: "Overcast", icon: "☁️" },
  45: { label: "Fog", icon: "🌫️" },
  48: { label: "Rime Fog", icon: "🌫️" },
  51: { label: "Light Drizzle", icon: "🌦️" },
  53: { label: "Drizzle", icon: "🌦️" },
  55: { label: "Dense Drizzle", icon: "🌧️" },
  56: { label: "Freezing Drizzle", icon: "🌧️" },
  57: { label: "Dense Freezing Drizzle", icon: "🌧️" },
  61: { label: "Slight Rain", icon: "🌦️" },
  63: { label: "Rain", icon: "🌧️" },
  65: { label: "Heavy Rain", icon: "🌧️" },
  66: { label: "Freezing Rain", icon: "🌧️" },
  67: { label: "Heavy Freezing Rain", icon: "🌧️" },
  71: { label: "Slight Snow", icon: "🌨️" },
  73: { label: "Snow", icon: "❄️" },
  75: { label: "Heavy Snow", icon: "❄️" },
  77: { label: "Snow Grains", icon: "❄️" },
  80: { label: "Slight Rain Showers", icon: "🌦️" },
  81: { label: "Rain Showers", icon: "🌧️" },
  82: { label: "Violent Rain Showers", icon: "⛈️" },
  85: { label: "Slight Snow Showers", icon: "🌨️" },
  86: { label: "Heavy Snow Showers", icon: "❄️" },
  95: { label: "Thunderstorm", icon: "⛈️" },
  96: { label: "Thunderstorm + Hail", icon: "⛈️" },
  99: { label: "Severe Thunderstorm + Hail", icon: "⛈️" },
};

interface GeoResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}

interface WeatherData {
  current: {
    temperature: number;
    windspeed: number;
    weathercode: number;
    winddirection: number;
    time: string;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation: number[];
    weathercode: number[];
    windspeed_10m: number[];
    relative_humidity_2m: number[];
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weathercode: number[];
    precipitation_sum: number[];
    sunrise: string[];
    sunset: string[];
  };
  timezone: string;
}

const QUICK_CITIES: GeoResult[] = [
  { id: 1, name: "New York", latitude: 40.7143, longitude: -74.006, country: "United States", admin1: "New York" },
  { id: 2, name: "London", latitude: 51.5085, longitude: -0.1257, country: "United Kingdom", admin1: "England" },
  { id: 3, name: "Tokyo", latitude: 35.6895, longitude: 139.6917, country: "Japan", admin1: "Tokyo" },
  { id: 4, name: "Sydney", latitude: -33.8679, longitude: 151.2073, country: "Australia", admin1: "New South Wales" },
  { id: 5, name: "Dubai", latitude: 25.2048, longitude: 55.2708, country: "United Arab Emirates", admin1: "Dubai" },
  { id: 6, name: "Paris", latitude: 48.8534, longitude: 2.3488, country: "France", admin1: "Île-de-France" },
];

function getWeatherInfo(code: number) {
  return WMO_CODES[code] || { label: "Unknown", icon: "🌡️" };
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function formatHour(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric" });
}

function formatDay(iso: string, index: number) {
  if (index === 0) return "Today";
  if (index === 1) return "Tomorrow";
  return new Date(iso).toLocaleDateString("en-US", { weekday: "short" });
}

export default function Weather() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<GeoResult>(QUICK_CITIES[0]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async (city: GeoResult) => {
    setLoading(true);
    setError(null);
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current_weather=true&hourly=temperature_2m,precipitation,weathercode,windspeed_10m,relative_humidity_2m&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_sum,sunrise,sunset&timezone=auto&forecast_days=7`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch weather");
      const data = await res.json();
      setWeather({
        current: data.current_weather,
        hourly: data.hourly,
        daily: data.daily,
        timezone: data.timezone,
      });
    } catch (err) {
      setError("Unable to load weather data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchQuery)}&count=1&language=en&format=json`;
      const geoRes = await fetch(geoUrl);
      if (!geoRes.ok) throw new Error("Search failed");
      const geoData = await geoRes.json();
      if (!geoData.results || geoData.results.length === 0) {
        setError(`No city found for "${searchQuery}". Try another name.`);
        setLoading(false);
        return;
      }
      const city = geoData.results[0] as GeoResult;
      setSelectedCity(city);
      setSearchQuery("");
      await fetchWeather(city);
    } catch {
      setError("Search failed. Please try again.");
      setLoading(false);
    }
  }, [searchQuery, fetchWeather]);

  useEffect(() => {
    fetchWeather(selectedCity);
  }, [selectedCity, fetchWeather]);

  const currentHourIndex = weather
    ? weather.hourly.time.findIndex((t) => new Date(t).getHours() === new Date(weather.current.time).getHours())
    : -1;

  const hourlyData = weather && currentHourIndex >= 0
    ? Array.from({ length: 24 }, (_, i) => ({
        time: weather.hourly.time[currentHourIndex + i],
        temp: weather.hourly.temperature_2m[currentHourIndex + i],
        precip: weather.hourly.precipitation[currentHourIndex + i],
        code: weather.hourly.weathercode[currentHourIndex + i],
      }))
    : [];

  const currentInfo = weather ? getWeatherInfo(weather.current.weathercode) : null;
  const humidity = weather && currentHourIndex >= 0 ? weather.hourly.relative_humidity_2m[currentHourIndex] : null;
  const windSpeed = weather?.current.windspeed ?? null;
  const precipNow = weather && currentHourIndex >= 0 ? weather.hourly.precipitation[currentHourIndex] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50" data-testid="weather-page">
      <main className="container mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Weather Dashboard</h1>
        <p className="text-slate-500 mb-6">Live weather forecasts from around the world</p>

        {/* Search Bar */}
        <div className="flex gap-2 mb-4" data-testid="weather-search-section">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} aria-hidden="true" />
            <Input
              type="text"
              placeholder="Search any city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
              className="pl-10 bg-white shadow-sm"
              aria-label="Search for a city"
              data-testid="weather-search-input"
            />
          </div>
          <Button
            onClick={handleSearch}
            disabled={loading || !searchQuery.trim()}
            data-testid="weather-search-button"
            aria-label="Search city"
          >
            <Search size={18} aria-hidden="true" />
            <span className="ml-1 hidden sm:inline">Search</span>
          </Button>
          {weather && (
            <Button
              variant="outline"
              onClick={() => fetchWeather(selectedCity)}
              disabled={loading}
              aria-label="Refresh weather data"
              data-testid="weather-refresh-button"
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} aria-hidden="true" />
            </Button>
          )}
        </div>

        {/* Quick Cities */}
        <div className="flex flex-wrap gap-2 mb-6">
          {QUICK_CITIES.map((city) => (
            <Button
              key={city.id}
              variant={selectedCity.name === city.name ? "default" : "secondary"}
              size="sm"
              onClick={() => setSelectedCity(city)}
              data-testid={`weather-quick-city-${city.name.toLowerCase().replace(/\s/g, "-")}`}
            >
              {city.name}
            </Button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6" data-testid="weather-error" role="alert">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && !weather && (
          <div className="flex items-center justify-center py-20" data-testid="weather-loading" aria-live="polite">
            <RefreshCw className="animate-spin text-blue-500" size={32} aria-hidden="true" />
            <span className="ml-3 text-slate-500">Loading weather data...</span>
          </div>
        )}

        {/* Weather Content */}
        {weather && currentInfo && !loading && (
          <div className="space-y-6">
            {/* Current Weather */}
            <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white" data-testid="weather-current-section">
              <CardHeader>
                <CardTitle className="text-white/90 text-lg flex items-center gap-2">
                  <span className="text-2xl">📍</span>
                  {selectedCity.name}
                  {selectedCity.admin1 && <span className="text-white/70 text-sm font-normal">, {selectedCity.admin1}</span>}
                  <span className="text-white/70 text-sm font-normal">, {selectedCity.country}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-7xl" aria-hidden="true">{currentInfo.icon}</span>
                    <div>
                      <div className="text-5xl font-bold" data-testid="weather-temperature">
                        {Math.round(weather.current.temperature)}°C
                      </div>
                      <div className="text-white/80 text-lg" data-testid="weather-condition">{currentInfo.label}</div>
                      <div className="text-white/60 text-sm mt-1">
                        Feels like {Math.round(weather.current.temperature)}°C
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 min-w-[200px]">
                    <div className="bg-white/15 rounded-lg p-3 backdrop-blur-sm" data-testid="weather-humidity">
                      <div className="flex items-center gap-1 text-white/70 text-xs mb-1">
                        <Droplets size={14} aria-hidden="true" /> Humidity
                      </div>
                      <div className="text-xl font-semibold">{humidity ?? "--"}%</div>
                    </div>
                    <div className="bg-white/15 rounded-lg p-3 backdrop-blur-sm" data-testid="weather-wind">
                      <div className="flex items-center gap-1 text-white/70 text-xs mb-1">
                        <Wind size={14} aria-hidden="true" /> Wind
                      </div>
                      <div className="text-xl font-semibold">{windSpeed ?? "--"} km/h</div>
                    </div>
                    <div className="bg-white/15 rounded-lg p-3 backdrop-blur-sm" data-testid="weather-precip">
                      <div className="flex items-center gap-1 text-white/70 text-xs mb-1">
                        <Eye size={14} aria-hidden="true" /> Precip
                      </div>
                      <div className="text-xl font-semibold">{precipNow ?? 0} mm</div>
                    </div>
                    <div className="bg-white/15 rounded-lg p-3 backdrop-blur-sm" data-testid="weather-feels">
                      <div className="flex items-center gap-1 text-white/70 text-xs mb-1">
                        <Thermometer size={14} aria-hidden="true" /> High / Low
                      </div>
                      <div className="text-xl font-semibold">
                        {Math.round(weather.daily.temperature_2m_max[0])}° / {Math.round(weather.daily.temperature_2m_min[0])}°
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-4 text-white/70 text-sm">
                  <span className="flex items-center gap-1">
                    <Sunrise size={16} aria-hidden="true" /> {formatTime(weather.daily.sunrise[0])}
                  </span>
                  <span className="flex items-center gap-1">
                    <Sunset size={16} aria-hidden="true" /> {formatTime(weather.daily.sunset[0])}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={16} aria-hidden="true" /> {weather.timezone}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* 7-Day Forecast */}
            <div>
              <h2 className="text-xl font-semibold text-slate-800 mb-3">7-Day Forecast</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3" data-testid="weather-forecast-section">
                {weather.daily.time.map((day, i) => {
                  const info = getWeatherInfo(weather.daily.weathercode[i]);
                  return (
                    <Card
                      key={day}
                      className={`text-center cursor-pointer transition-all hover:shadow-md ${i === 0 ? "ring-2 ring-blue-400" : ""}`}
                      data-testid={`weather-forecast-day-${i}`}
                    >
                      <CardContent className="pt-4 pb-4">
                        <div className="text-sm font-medium text-slate-600">{formatDay(day, i)}</div>
                        <div className="text-3xl my-2" aria-hidden="true">{info.icon}</div>
                        <div className="text-xs text-slate-500 mb-1">{info.label}</div>
                        <div className="text-lg font-bold text-slate-800">
                          {Math.round(weather.daily.temperature_2m_max[i])}°
                        </div>
                        <div className="text-sm text-slate-400">
                          {Math.round(weather.daily.temperature_2m_min[i])}°
                        </div>
                        {weather.daily.precipitation_sum[i] > 0 && (
                          <div className="text-xs text-blue-500 mt-1 flex items-center justify-center gap-1">
                            <Droplets size={12} aria-hidden="true" /> {weather.daily.precipitation_sum[i]}mm
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Hourly Forecast */}
            <div>
              <h2 className="text-xl font-semibold text-slate-800 mb-3">Next 24 Hours</h2>
              <Card data-testid="weather-hourly-section">
                <CardContent className="pt-6">
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {hourlyData.map((hour, i) => {
                      const info = getWeatherInfo(hour.code);
                      return (
                        <div
                          key={i}
                          className="flex-shrink-0 flex flex-col items-center min-w-[64px] py-2 px-1 rounded-lg hover:bg-slate-50"
                          data-testid={`weather-hourly-item-${i}`}
                        >
                          <span className="text-xs text-slate-500 mb-1">
                            {i === 0 ? "Now" : formatHour(hour.time)}
                          </span>
                          <span className="text-2xl" aria-hidden="true">{info.icon}</span>
                          <span className="text-sm font-semibold text-slate-800 mt-1">
                            {Math.round(hour.temp)}°
                          </span>
                          {hour.precip > 0 && (
                            <span className="text-xs text-blue-500 flex items-center gap-0.5">
                              <Droplets size={10} aria-hidden="true" />{hour.precip}mm
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
