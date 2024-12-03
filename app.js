// api key I generated for the api the prof provided to us
// https://www.weatherapi.com/docs/
let apiKey = "eb5290ba6b4a4b7b93660906241711";
let searchBox = document.getElementById("search-box");
let form = document.getElementById("form1");
let main_data;
let defaultLoc = ["Flagstaff", "Seattle", "Tokyo", "Melbourne"];

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
//update main body with initial location (flagstaff)
(async () => {
  main_data = await apiCall(apiKey, "Flagstaff");
  fetchWeatherData(main_data.location.name); 
})();

let darkModeToggle = document.getElementById("dark-mode");

// dark mode toggle function
darkModeToggle.addEventListener("click", function () {
    document.getElementById("app-container-sidebar").classList.toggle("dark-mode");
    if (main_data.current.is_day === 0)
    {} else {
      document.body.classList.toggle("dark-mode");  
    }
    document.getElementById("sun-icon").classList.toggle("dark-mode");
    document.getElementById("header-hr").classList.toggle("dark-mode");
    document.getElementById("submit-placeholder").classList.toggle("dark-mode");
    document.getElementById("welcome-area").classList.toggle("dark-mode");
    let sunIcon = document.getElementById("sun-icon");
    if (sunIcon.style.fill === 'white'){
      sunIcon.style.fill='black';
    } else {
      sunIcon.style.fill='white';
    }
});

// Update the main content area with the fetched weather data
const updateWeatherUI = (main_data) => {
    const city = `${main_data.location.name}, ${main_data.location.region}`;
    const temperature = `${main_data.current.temp_f}°`;
    const condition = main_data.current.condition.text;
    // Extract relevant data from API response
    const humidity = main_data.current.humidity; // Example: API returns humidity
    const windSpeed = main_data.current.wind_mph; // Wind speed in miles per hour
    const feelsLike = main_data.current.feelslike_f; // Feels like temperature in Fahrenheit

    //added conditions when updating CSS to only update when necessary
    //as in update when city is in nightime
    if (main_data.current.is_day === 0) {
      document.body.classList.add("dark-mode");
      document.getElementById("weather-grid").classList.add("dark-mode");
    }
    else {
        document.body.classList.remove("dark-mode");
        document.getElementById("weather-grid").classList.remove("dark-mode");
    }

    console.log(main_data.current.is_day);

    document.getElementById('current-city').innerHTML = city;
    document.getElementById('current-temp').innerHTML = temperature;
    document.getElementById('condition-icon').innerHTML = `<img src="https:${main_data.current.condition.icon}" alt="${main_data.current.condition.text}" style="width: 50px; height: 50px; margin-right: 10px; margin-left: -10px; margin-top: 5px;">`;
    document.getElementById('current-condition').innerHTML = `${condition}`;
    
    // Update the grid elements dynamically
    document.getElementById('humidity').textContent = `Humidity: ${humidity}%`;
    document.getElementById('wind-speed').textContent = `Wind Speed: ${windSpeed} mph`;
    document.getElementById('feels-like').textContent = `Feels Like: ${feelsLike}°F`;
};

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

//Turned apiCall into a function
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
//Add weather cards for default location
renderDefaultLoc(defaultLoc, apiKey);

//function to create weather card elements for every default city and newly searched city
async function renderDefaultLoc(defaultLoc, apiKey){
  let sidebarContainer = document.querySelector(".city-menu");

  // function to remove all cards if desired
  function removeCards() {
    const allCards = document.querySelectorAll('#nav-item');
    allCards.forEach(card => card.remove());
  }

  // adding event listener for card removal
  let clearButton = document.getElementById("clear-city");
  clearButton.addEventListener('click', removeCards);

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
            <h2 id="card-titles" class="text-light" data-location="LocationName" style="font-size: 25px; width: 225px; font-weight:300; letter-spacing:0.4px; margin:1px; margin-left:20px; margin-top:20px; font-weight: 375;">
              ${locData.location.name}, ${locData.location.region}
            </h2>
            <div style="display:inline-flex;">
              <h2 class="text-light" style="font-weight:300; margin:5px; margin-left:20px; margin-bottom:20px; margin-top:4px; font-weight: 300;">
                ${locData.current.temp_f}°
              </h2>
              <div style="display:flex; flex-direction:column; margin-left:10px; margin-top: 5px;">
                <p class="text-light">High: ${forecastInfo.day.maxtemp_f}°</p>
                <p class="text-light">Low: ${forecastInfo.day.mintemp_f}°</p> 
              </div>
            </div>
          </div>
          <img src="https:${locData.current.condition.icon}" alt="${locData.current.condition.text}" style="width: 50px; height: 50px; margin-right: 45px; margin-left: -10px; margin-top: 5px;">
        </div>
      `;
      
      sidebarContainer.appendChild(card);
      //added conditions when updating CSS to only update when necessary
      //as in update when city is in nightime
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

//Listener for clicks on weather cards to populate the main body
document.querySelector('.city-menu').addEventListener('click', (event)=>{
  //get the closest card to click on the sidebar menu
  let card = event.target.closest('#cards');
  //card was retrieved successfully
  if(card){
    //grab card city
    let cardTitle = card.querySelector('#card-titles');
    //city was successfully grabbed
    if(cardTitle){
      //save city
      let location =cardTitle.textContent;
      //send city to update body
      fetchWeatherData(location);
    }
    else{
      //failed to get city name
      console.log("Unable to retrieve card title");
    }
  }
  else{
    //failed to get clicked card
    console.log("Unable to retrieve card");
  }
});