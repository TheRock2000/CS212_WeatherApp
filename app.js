// api key I generated for the api the prof provided to us
// https://www.weatherapi.com/docs/
let apiKey = "eb5290ba6b4a4b7b93660906241711";
let searchBox = document.getElementById("search-box");
let form = document.getElementById("form1");

// Function to fetch weather data based on city or ZIP code
const fetchWeatherData = async (query) => {
    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${query}&aqi=no`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error("Failed to fetch weather data");
        }
        const data = await response.json();
        updateWeatherUI(data);
    } catch (error) {
        console.error("Error fetching weather data:", error);
        alert("Unable to fetch weather data. Please check your input.");
    }
};
// Update the main content area with the fetched weather data
const updateWeatherUI = (data) => {
    const city = `${data.location.name}, ${data.location.region}`;
    const temperature = `${data.current.temp_f}°`;
    const condition = data.current.condition.text;
    // Extract relevant data from API response
    const humidity = data.current.humidity; // Example: API returns humidity
    const windSpeed = data.current.wind_kph; // Wind speed in kilometers per hour
    const feelsLike = data.current.feelslike_c; // Feels like temperature in Celsius

    document.getElementById('current-city').innerHTML = city;
    document.getElementById('current-temp').innerHTML = temperature;
    document.getElementById('current-condition').innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="#f7d12a" class="bi bi-sun-fill" viewBox="0 0 16 16">
            <path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708"/>
        </svg> ${condition}`;
    // Update the grid elements dynamically
    document.getElementById('humidity').textContent = `Humidity: ${humidity}%`;
    document.getElementById('wind-speed').textContent = `Wind Speed: ${windSpeed} km/h`;
    document.getElementById('feels-like').textContent = `Feels Like: ${feelsLike}°C`;
};

// Handle search form submission
document.getElementById('form1').addEventListener('submit', (event) => {
    event.preventDefault();
    const query = document.getElementById('search-box').value.trim();
    if (query) {
        fetchWeatherData(query);
    } else {
        alert("Please enter a valid city or ZIP code.");
    }
});

// display user time in the side bar header
let date = new Date();
let time = date.toLocaleString([], {timeStyle: 'short'});
document.getElementById('app-time').innerHTML = time;

// display current date in the main content area
let dayOfWeek = date.toLocaleString([], {weekday: 'long'});
let dayOfMonth = date.getDate();
let month = date.toLocaleString([], {month: 'long'});
let fullDate = `${dayOfWeek}, ${month} ${dayOfMonth}`;
document.getElementById('current-date').innerHTML = fullDate;

// placeholder data for tweaking the main content area (font size, thickness, etc)
message1 = 'Flagstaff, AZ';
message2 = '73°';
document.getElementById('current-city').innerHTML = message1;
document.getElementById('current-temp').innerHTML = message2;

let darkModeToggle = document.createElement("button");
darkModeToggle.innerHTML = "🌙";
darkModeToggle.style.position = "absolute";
darkModeToggle.style.top = "20px";
darkModeToggle.style.right = "20px";
document.body.appendChild(darkModeToggle);

darkModeToggle.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
    document.getElementById("app-container-sidebar").classList.toggle("dark-mode");
    document.getElementById("nav-item1").classList.toggle("dark-mode");
});
