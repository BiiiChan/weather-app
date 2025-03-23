import { useState, useEffect } from "react";
import axios from "axios";
import {
  WiDaySunny,
  WiCloud,
  WiRain,
  WiSnow,
  WiThunderstorm,
  WiHumidity,
  WiStrongWind,
} from "react-icons/wi";

const Weather = () => {
  const [city, setCity] = useState(localStorage.getItem("lastCity") || "");
  const [weather, setWeather] = useState(null);
  const [unit, setUnit] = useState("metric"); // metric (°C) or imperial (°F)
  const API_KEY = "518021b4bde22ed56373e2318b4ae073"; // Replace with your API key

  useEffect(() => {
    if (city) getWeather();
  }, [unit]); // Refresh when unit changes

  const getWeather = async (cityName = city) => {
    if (!cityName) return;
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=${unit}&appid=${API_KEY}`
      );
      setWeather(response.data);
      localStorage.setItem("lastCity", cityName); // Save last searched city
    } catch (error) {
      console.error(
        "Error fetching weather:",
        error.response?.data || error.message
      );
      alert(error.response?.data?.message || "City not found!");
    }
  };

  const getWeatherIcon = (main) => {
    switch (main) {
      case "Clear":
        return <WiDaySunny size={60} />;
      case "Clouds":
        return <WiCloud size={60} />;
      case "Rain":
        return <WiRain size={60} />;
      case "Snow":
        return <WiSnow size={60} />;
      case "Thunderstorm":
        return <WiThunderstorm size={60} />;
      default:
        return <WiDaySunny size={60} />;
    }
  };

  const getBackground = () => {
    if (!weather) return "#b3e0ff"; // Default Light Blue
    const condition = weather.weather[0].main;
    switch (condition) {
      case "Clear":
        return "#FFD700"; // Sunny - Yellow
      case "Clouds":
        return "#B0C4DE"; // Cloudy - Light Gray
      case "Rain":
        return "#87CEEB"; // Rainy - Sky Blue
      case "Snow":
        return "#FFFFFF"; // Snowy - White
      case "Thunderstorm":
        return "#808080"; // Thunderstorm - Gray
      default:
        return "#b3e0ff"; // Default
    }
  };

  const convertTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getUserLocation = () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${unit}&appid=${API_KEY}`
          );
          setCity(response.data.name);
          setWeather(response.data);
        } catch (error) {
          console.error("Error fetching location weather:", error);
          alert("Could not get location weather.");
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Location access denied!");
      }
    );
  };

  return (
    <div
      className="weather-container"
      style={{
        backgroundColor: getBackground(),
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <h2>Weather App</h2>
      <input
        type="text"
        placeholder="Enter city name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={() => getWeather()}>Get Weather</button>
      <button
        onClick={() => setUnit(unit === "metric" ? "imperial" : "metric")}
      >
        Switch to {unit === "metric" ? "°F" : "°C"}
      </button>
      <button onClick={getUserLocation}>Use My Location</button>

      {weather && (
        <div className="weather-info">
          {getWeatherIcon(weather.weather[0].main)}
          <h3>
            {weather.name}, {weather.sys.country}
          </h3>
          <p>
            Temperature: {weather.main.temp}°{unit === "metric" ? "C" : "F"}
          </p>
          <p>Condition: {weather.weather[0].main}</p>
          <p>
            <WiHumidity size={24} /> Humidity: {weather.main.humidity}%
          </p>
          <p>
            <WiStrongWind size={24} /> Wind Speed: {weather.wind.speed}{" "}
            {unit === "metric" ? "m/s" : "mph"}
          </p>
          <p>Pressure: {weather.main.pressure} hPa</p>
          <p>Sunrise: {convertTime(weather.sys.sunrise)}</p>
          <p>Sunset: {convertTime(weather.sys.sunset)}</p>
        </div>
      )}
    </div>
  );
};

export default Weather;
