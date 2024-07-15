import React, { useState, useEffect } from 'react'; // Import React and hooks
import axios from 'axios'; // Import axios for API calls
import './App.css'; // Import CSS file for styling

const App = () => {
  const [weatherData, setWeatherData] = useState(null); // State to store weather data
  const [location, setLocation] = useState(''); // State to store user input for location
  const [userLocation, setUserLocation] = useState('Giza'); // State to store the current location being fetched

  useEffect(() => {
    fetchWeather(userLocation); // Fetch weather data when userLocation changes
  }, [userLocation]);

  const fetchWeather = (location) => {
    const apiKey = 'e75e227ce6ef4d53a34132818241001'; // API key for Weather API
    axios
      .get(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=2`) // API call to fetch weather data for 2 days
      .then((response) => {
        setWeatherData(response.data); // Store fetched data in state
      })
      .catch((error) => {
        console.error('Error fetching the weather data:', error); // Log any errors
      });
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value); // Update location state with user input
  };

  const handleLocationSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    setUserLocation(location); // Set userLocation to the value entered by user
  };

  const getFilteredForecast = () => {
    if (!weatherData) return []; // Return empty array if no data

    const today = weatherData.forecast.forecastday[0].hour.filter(hour => {
      const hourTime = new Date(hour.time).getHours(); // Get the hour of the time
      return hourTime >= 18; // Filter for hours 6 PM and later
    });

    const tomorrow = weatherData.forecast.forecastday[1].hour.filter(hour => {
      const hourTime = new Date(hour.time).getHours(); // Get the hour of the time
      return hourTime < 6; // Filter for hours before 6 AM
    });

    return [...today, ...tomorrow]; // Combine today's and tomorrow's filtered hours
  };

  const getVerticalForecast = () => {
    if (!weatherData) return []; // Return empty array if no data

    const forecastTimes = [12, 16, 20, 0]; // Times to filter: 12 PM, 4 PM, 8 PM, 12 AM
    const today = weatherData.forecast.forecastday[0].hour.filter(hour => forecastTimes.includes(new Date(hour.time).getHours())); // Filter today's forecast
    const tomorrow = weatherData.forecast.forecastday[1].hour.filter(hour => forecastTimes.includes(new Date(hour.time).getHours())); // Filter tomorrow's forecast

    return [...today, ...tomorrow]; // Combine today's and tomorrow's filtered hours
  };

  const getDaySeparator = (date1, date2) => {
    return new Date(date1).toLocaleDateString() !== new Date(date2).toLocaleDateString(); // Check if two dates are different
  };

  return (
    <div className="container">
      <form onSubmit={handleLocationSubmit} className="search-form">
        <input
          className="search-bar"
          type="text"
          placeholder="Search for city.."
          value={location}
          onChange={handleLocationChange}
        />
      </form>
      {weatherData && (
        <>
          <div className="weather-info-container">
            <div className="weather-info">
              <h1>{weatherData.location.name}</h1>
              <h3>{weatherData.location.country}</h3>
              <h4>{weatherData.current.condition.text}</h4>
              <h1>{weatherData.current.temp_c}°C</h1>
            </div>
            <img
              src={weatherData.current.condition.icon}
              alt={weatherData.current.condition.text}
              className="weather-icon"
            />
          </div>

          <div className="forecast-title">Today's forecast</div>
          <div className="forecast-horizontal">
            {getFilteredForecast().map((hour, index) => (
              <div className="forecast-item" key={index}>
                <p>{new Date(hour.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                <p>{hour.temp_c}°C</p>
                <img src={hour.condition.icon} alt={hour.condition.text} />
              </div>
            ))}
          </div>

          <div className="daily-forecast-title">2 Days Forecast</div>
          <div className="forecast-columns">
            <div className="forecast-column">
              <h4>12 PM</h4>
              {getVerticalForecast().filter(hour => new Date(hour.time).getHours() === 12).map((hour, index, arr) => (
                <>
                  <div className="forecast-item" key={index}>
                    <p>{new Date(hour.time).toLocaleDateString()}</p>
                    <img src={hour.condition.icon} alt={hour.condition.text} />
                    <p>{hour.condition.text}</p>
                    <p>{hour.temp_c}°C</p>
                  </div>
                  {index < arr.length - 1 && getDaySeparator(hour.time, arr[index + 1].time) && <hr className="day-separator" />}
                </>
              ))}
            </div>
            <div className="forecast-column">
              <h4>4 PM</h4>
              {getVerticalForecast().filter(hour => new Date(hour.time).getHours() === 16).map((hour, index, arr) => (
                <>
                  <div className="forecast-item" key={index}>
                    <p>{new Date(hour.time).toLocaleDateString()}</p>
                    <img src={hour.condition.icon} alt={hour.condition.text} />
                    <p>{hour.condition.text}</p>
                    <p>{hour.temp_c}°C</p>
                  </div>
                  {index < arr.length - 1 && getDaySeparator(hour.time, arr[index + 1].time) && <hr className="day-separator" />}
                </>
              ))}
            </div>
            <div className="forecast-column">
              <h4>8 PM</h4>
              {getVerticalForecast().filter(hour => new Date(hour.time).getHours() === 20).map((hour, index, arr) => (
                <>
                  <div className="forecast-item" key={index}>
                    <p>{new Date(hour.time).toLocaleDateString()}</p>
                    <img src={hour.condition.icon} alt={hour.condition.text} />
                    <p>{hour.condition.text}</p>
                    <p>{hour.temp_c}°C</p>
                  </div>
                  {index < arr.length - 1 && getDaySeparator(hour.time, arr[index + 1].time) && <hr className="day-separator" />}
                </>
              ))}
            </div>
            <div className="forecast-column">
              <h4>12 AM</h4>
              {getVerticalForecast().filter(hour => new Date(hour.time).getHours() === 0).map((hour, index, arr) => (
                <>
                  <div className="forecast-item" key={index}>
                    <p>{new Date(hour.time).toLocaleDateString()}</p>
                    <img src={hour.condition.icon} alt={hour.condition.text} />
                    <p>{hour.condition.text}</p>
                    <p>{hour.temp_c}°C</p>
                  </div>
                  {index < arr.length - 1 && getDaySeparator(hour.time, arr[index + 1].time) && <hr className="day-separator" />}
                </>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
