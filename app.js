let hello = "Hello world";

// display user time in the side bar header
let time = new Date().toLocaleString([], {timeStyle: 'short'});
document.getElementById('app-time').innerHTML = time;
