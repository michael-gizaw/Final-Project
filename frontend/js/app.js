const API_KEY = 'API_KEY';

// DOM Elements
const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const weatherDisplay = document.getElementById('weatherDisplay');
const pinnedCitiesList = document.getElementById('pinnedCitiesList');

// Event Listeners
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeather(city);
    }
});

// Fetch weather data from OpenWeatherMap API
async function fetchWeather(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
        );

        if (!response.ok) {
            throw new Error('City not found');
        }

        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        alert(error.message);
    }
}

// Display weather data on the page
function displayWeather(data) {
    weatherDisplay.innerHTML = `
        <h2>${data.name}</h2>
        <p><strong>Temperature:</strong> ${data.main.temp}°C</p>
        <p><strong>Weather:</strong> ${data.weather[0].description}</p>
        <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
        <button id="pinCityBtn">Pin this City</button>
    `;
    const pinCityBtn = document.getElementById('pinCityBtn');
    pinCityBtn.addEventListener('click', () => pinCity(data.name));
}

function pinCity(city) {
    let pinnedCities = JSON.parse(localStorage.getItem('pinnedCities')) || [];

    if (pinnedCities.includes(city)) {
        alert(`${city} is already pinned.`);
        return;
    }

    pinnedCities.push(city);
    localStorage.setItem('pinnedCities', JSON.stringify(pinnedCities));
    addCityToList(city);
    
    alert(`${city} has been pinned.`);
}

// Load pinned cities from localStorage on page load
window.addEventListener('DOMContentLoaded', () => {
    loadPinnedCities();
});

// Load and display pinned cities
function loadPinnedCities() {
    const pinnedCities = JSON.parse(localStorage.getItem('pinnedCities')) || [];

    pinnedCities.forEach(city => {
        addCityToList(city);
    });
}

// Add a city to the pinned cities list in the DOM
function addCityToList(city) {
    const li = document.createElement('li');
    li.textContent = city;

    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.addEventListener('click', () => removeCity(city, li));

    li.appendChild(removeBtn);
    pinnedCitiesList.appendChild(li);
}

// Remove a city from pinned cities
function removeCity(city, listItem) {
    let pinnedCities = JSON.parse(localStorage.getItem('pinnedCities')) || [];
    pinnedCities = pinnedCities.filter(c => c !== city);
    localStorage.setItem('pinnedCities', JSON.stringify(pinnedCities));
    pinnedCitiesList.removeChild(listItem);
    alert(`${city} has been removed from pinned cities.`);
}