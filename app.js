// API key below
// https://www.weatherapi.com/docs/
let apiKey = "eb5290ba6b4a4b7b93660906241711";
let searchBox = document.getElementById("search-box");
let form = document.getElementById("form1");
let main_data;
let defaultLoc = ["Flagstaff", "Chicago", "Berlin", "Tokyo"];

// Display user time in the side bar header
let date = new Date();
let time = date.toLocaleString([], {timeStyle: 'short'});
document.getElementById('app-time').innerHTML = time;

// Display current date in the main content area
let dayOfWeek = date.toLocaleString([], {weekday: 'long'});
let dayOfMonth = date.getDate();
let month = date.toLocaleString([], {month: 'long'});
let fullDate = `${dayOfWeek}, ${month} ${dayOfMonth}`;
document.getElementById('current-date').innerHTML = fullDate;

// Ask user for name
//let username = prompt("Welcome! Please enter your name:")
//if (username != null && username != '') {
//  document.getElementById("app-welcome").innerHTML = "Welcome, " + username;
//}

// Creating dark mode variable
let darkModeToggle = document.getElementById("dark-mode");

// Dark mode toggle function
darkModeToggle.addEventListener("click", function () {
  document.getElementById("app-container-sidebar").classList.toggle("dark-mode");
  document.getElementById("sun-icon").classList.toggle("dark-mode");
  document.getElementById("header-hr").classList.toggle("dark-mode");
  document.getElementById("welcome-area").classList.toggle("dark-mode");
  document.getElementById("search-box").classList.toggle("dark-mode");
  let sunIcon = document.getElementById("sun-icon");
  if (sunIcon.style.fill === 'white'){
    sunIcon.style.fill='black';
  } else {
    sunIcon.style.fill='white';
  }
});

// Update main body with initial location (Flagstaff)
(async () => {
  main_data = await apiCall(apiKey, "Flagstaff");
  fetchWeatherData(main_data.location.name); 
})();

//Add weather cards for default location
renderDefaultLoc(defaultLoc, apiKey);

// Function to create weather card elements for every default city and newly searched city
async function renderDefaultLoc(defaultLoc, apiKey){
  let sidebarContainer = document.querySelector(".city-menu");

  // Function to remove all cards if desired
  function removeCards() {
    const allCards = document.querySelectorAll('#nav-item');
    allCards.forEach(card => card.remove());
  }

  // Adding event listener for card removal
  let clearButton = document.getElementById("clear-city");
  clearButton.addEventListener('click', removeCards);

  // Automating process of adding each weather card (nav-item) to the city-menu
  for(loc of defaultLoc){
    try{
      let locData = await apiCall(apiKey, loc);
      if (!locData) continue;
      let card = document.createElement('div');
      card.id = 'nav-item';
      console.log(locData);
      const forecastInfo = locData.forecast.forecastday[0];
      card.innerHTML = `
        <div id="cards" class="d-flex justify-content-between align-items-center">
          <div>
            <h2 id="card-titles" class="text-light" data-location="LocationName" style="width: 225px; font-weight:375; letter-spacing:0.4px; margin:1px; margin-left:20px; margin-top:20px;">
              ${locData.location.name}, ${locData.location.region}
            </h2>
            <div style="display:inline-flex;">
              <h2 id="card-temp" class="text-light" style="font-weight:300; margin:5px; margin-left:20px; margin-bottom:20px; margin-top:4px;">
                ${Math.round(locData.current.temp_f)}°
              </h2>
              <div id="high-low" style="display:flex; flex-direction:column; margin-left:10px; margin-top: 5px;">
                <p class="text-light">High: ${Math.round(forecastInfo.day.maxtemp_f)}°</p>
                <p class="text-light">Low: ${Math.round(forecastInfo.day.mintemp_f)}°</p>
              </div>
            </div>
          </div>
          <img id="card-icon" src="https:${locData.current.condition.icon}" alt="${locData.current.condition.text}">
        </div>
      `;

      sidebarContainer.appendChild(card);
      // Added conditions when updating CSS to only update when necessary
        // As in update when city is in nightime
      if (locData.current.is_day === 0){
        card.classList.add("dark-mode");
      }
      else{
          card.classList.remove("dark-mode");
      }
    } 
    catch (error){
      console.error("Error rendering location:", error);
    }
  }
}

// Handle search form submission
document.getElementById('form1').addEventListener('submit', (event) => {
  event.preventDefault();
  const query = document.getElementById('search-box').value.trim();
  if (query) {
      fetchWeatherData(query);
      arrQuery = [query];
      renderDefaultLoc(arrQuery, apiKey);
  } else {
      alert("Please enter a valid city or ZIP code.");
  }
});

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
const updateWeatherUI = (main_data) => {
    // Initialize variables for main display's city data
    const city = `${main_data.location.name}, ${main_data.location.region}`;
    const temperature = `${Math.round(main_data.current.temp_f)}°`;
    const condition = main_data.current.condition.text;

    // Extract relevant data from API response
    const humidity = main_data.current.humidity; // Example: API returns humidity
    const windSpeed = main_data.current.wind_mph; // Wind speed in miles per hour
    const feelsLike = main_data.current.feelslike_f; // Feels like temperature in Fahrenheit

    // Added conditions when updating CSS to only update when necessary
      // As in update when city is in nightime
    if (main_data.current.is_day === 0) {
      document.body.classList.add("dark-mode");
      document.getElementById("info-grid").classList.add("dark-mode");
    }
    else {
        document.body.classList.remove("dark-mode");
        document.getElementById("info-grid").classList.remove("dark-mode");
    }

    // Log is_day (testing purposes)
    console.log(main_data.current.is_day);

    // Inject API data into HTML
    document.getElementById('current-city').innerHTML = city;
    document.getElementById('current-temp').innerHTML = temperature;
    document.getElementById('condition-icon').innerHTML = `<img src="https:${main_data.current.condition.icon}" alt="${main_data.current.condition.text}" style="width: 50px; height: 50px; margin-right: 10px; margin-left: -10px; margin-top: 5px;">`;
    document.getElementById('current-condition').innerHTML = `${condition}`;
    
    // Update the grid elements dynamically
    document.getElementById('humidity').textContent = `Humidity: ${humidity}%`;
    document.getElementById('wind-speed').textContent = `Wind Speed: ${windSpeed} mph`;
    document.getElementById('feels-like').textContent = `Feels Like: ${feelsLike}°F`;
};


// Turned apiCall into a function
async function apiCall(apiKey, query){
  const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${query}&aqi=no`;
  const forecastUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${query}&aqi=no`;

   try {
      const response = await fetch(apiUrl);
      const responseForecast = await fetch(forecastUrl);
      if (!response.ok) {
          throw new Error("Failed to fetch weather data");
      }
      if (!responseForecast.ok) {
        throw new Error("Failed to fetch weather data");
      }
      const data = await response.json();
      const forecastData = await responseForecast.json();
      return data, forecastData;
  } catch (error) {
      console.error("Error fetching weather data:", error);
      alert("Unable to fetch weather data. Please check your input.");
      return null;
  }
}

// Listener for clicks on weather cards to populate the main body
document.querySelector('.city-menu').addEventListener('click', (event)=>{
  // Get the closest card to click on the sidebar menu
  let card = event.target.closest('#cards');
  // Card was retrieved successfully
  if(card){
    // Grab card city
    let cardTitle = card.querySelector('#card-titles');
    // City was successfully grabbed
    if(cardTitle){
      // Save city
      let location =cardTitle.textContent;
      // Send city to update body
      fetchWeatherData(location);
    }
    else{
      // Failed to get city name
      console.log("Unable to retrieve card title");
    }
  }
  else{
    // Failed to get clicked card
    console.log("Unable to retrieve card");
  }
});

// Initialize saveCity variables
const savedCitiesList = document.getElementById("savedCitiesList");
const saveCityButton = document.getElementById("saveCity");

// Function to save a city that the user searches
function saveCity() {
  const cityInput = document.getElementById("search-box");
  const city = cityInput.value.trim();
  let username = localStorage.getItem("username");

  if(!username){
    username = prompt("Welcome! Please enter your name:");
    if(username){
      localStorage.setItem("username",username);
    }
    else{
      return alert("Name is required");
    }
  }

  if (!city) return alert("Please enter a city name.");
  let cities = JSON.parse(localStorage.getItem("savedCities")) || [];
  if (!cities.includes(city)) {
      cities.push(city);
      localStorage.setItem("savedCities", JSON.stringify(cities));
      updateSavedCitiesUI();
      alert(`${city} saved!`);
  } else {
      alert(`${city} is already saved.`);
  }
}
function deleteCity(city) {
  let cities = JSON.parse(localStorage.getItem("savedCities")) || [];
  cities = cities.filter(savedCity => savedCity !== city);
  localStorage.setItem("savedCities", JSON.stringify(cities));
  updateSavedCitiesUI();
}
function loadSavedCities() {
  let username  = localStorage.getItem("username");
  if(username){
    document.getElementById("app-welcome").textContent = `Welcome, ${username}`;
  }
  else{
    document.getElementById("app-welcome").textContent = 'Welcome, Guest';
  }
  const cities = JSON.parse(localStorage.getItem("savedCities")) || [];
  updateSavedCitiesUI();
}

function updateSavedCitiesUI() {
  const cities = JSON.parse(localStorage.getItem("savedCities")) || [];
  savedCitiesList.innerHTML = "";
  cities.forEach(city => {
      const li = document.createElement("li");
      li.textContent = city;
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.style.marginLeft = "10px";
      deleteButton.addEventListener("click", () => deleteCity(city));
      li.appendChild(deleteButton);
      savedCitiesList.appendChild(li);
  });
}

saveCityButton.addEventListener("click", saveCity);
window.addEventListener("load", loadSavedCities);






