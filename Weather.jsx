import React, { useState, useEffect } from 'react';
import './Weather.css';

const api = {
    key: "188f5e41fdd0e2ed97eae19454ed363c",
    base: "https://api.openweathermap.org/data/2.5/"
};

const Weather = () => {
    const [query, setQuery] = useState('');
    const [weather, setWeather] = useState({});
    const [uvIndex, setUvIndex] = useState(null);
    const [date, setDate] = useState(new Date());
    const [background, setBackground] = useState('#00c6ff'); // Default background color
    const [error, setError] = useState(null); // Error state

    useEffect(() => {
        const timer = setInterval(() => {
            setDate(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const search = event => {
        if (event.key === "Enter") {
            setError(null); // Reset error state
            fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
                .then(res => {
                    if (!res.ok) {
                        throw new Error('Location not found');
                    }
                    return res.json();
                })
                .then(result => {
                    setWeather(result);
                    setQuery('');
                    if (result.coord) {
                        fetch(`${api.base}uvi?lat=${result.coord.lat}&lon=${result.coord.lon}&appid=${api.key}`)
                            .then(res => res.json())
                            .then(data => setUvIndex(data.value));
                    }
                    setBackground(getBackgroundColor(result.weather[0].main)); // Update background color
                    console.log(result);
                })
                .catch(error => {
                    setError('Location not found'); // Set error message
                    console.error('Error fetching weather data:', error);
                });
        }
    };

    const formatDate = (date) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        return date.toLocaleDateString(undefined, options);
    };

    const getBackgroundColor = (weather) => {
        switch (weather) {
            case 'Thunderstorm':
                return '#535353'; // Dark gray for thunderstorm
            case 'Drizzle':
            case 'Rain':
                return '#6187ff'; // Blue for rain
            case 'Snow':
                return '#ffffff'; // White for snow
            case 'Clear':
                return '#ffcc00'; // Yellow for clear sky
            case 'Clouds':
                return '#aec9ff'; // Light blue for clouds
            default:
                return '#00c6ff'; // Default background color
        }
    };

    return (
        <div style={{ background }}>
            <main>
                <div className='search-bar'>
                    <input
                        type='text'
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder='Enter city'
                        onKeyDown={search}
                    />
                </div>
                {error && <div className='error'>{error}</div>} 
                {(typeof weather.main != "undefined") ? (
                    <div>
                        <div className='location'>
                            {weather.name}, {weather.sys.country}
                        </div>
                        <div className='date'>
                            {formatDate(date)}
                        </div>
                        <div className='weather-box'>
                            <div className='temp'>{Math.round(weather.main.temp)}°C</div>
                            <div className='min-max'>
                                <div>Min: {Math.round(weather.main.temp_min)}°C</div>
                                <div>Max: {Math.round(weather.main.temp_max)}°C</div>
                            </div>
                            <div className='uv-index'>
                                UV Index: {uvIndex !== null ? uvIndex : 'Loading...'}
                            </div>
                        </div>
                        <div className='weather'>
                            {weather.weather[0].main}
                        </div>
                    </div>
                ) : (' ')}
            </main>
        </div>
    );
};

export default Weather;
