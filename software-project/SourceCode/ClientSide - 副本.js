document.addEventListener('keydown', function(event) {//press enter can also search
    if (event.key === 'Enter') {
        searchWeather();
    }
});

getLocation().then(coords => {
    return getCityName(coords.latitude, coords.longitude);
}).then(city => { //Get current weather information based on the location city
    displayWeather(city);//then autoly search
    displayFutureWeather(city);
    
}).catch(error => {
    console.error(error);
});