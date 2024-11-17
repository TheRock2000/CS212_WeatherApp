// api key I generated for the api the prof provided to us
// https://www.weatherapi.com/docs/
let apiKey = "eb5290ba6b4a4b7b93660906241711";

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