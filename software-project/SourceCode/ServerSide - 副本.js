const key = 'dccc53c4b6e4bacf5ac14ae1a639aedb'; //api key

var unit = 'Celsius'; // defult temperature unit: metric

var futuretemp; //the canvas

document.write('<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>');

currentdata = null

futuredata = null

function switchUnit(selectedValue) { //Send request based on temperature unit
 
    unit = selectedValue;
    futuretemp.destroy();
    
    displaycurrentcondition(currentdata)
    displayCanvas(futuredata)
}

function ChangeUnit(c){
    f = c * 1.8 + 32
    return f.toFixed(2);
}

const getWeather = async (city) => {
    const base = "https://api.openweathermap.org/data/2.5/weather";//url
    const query = `?q=${city}&appid=${key}&units=metric`;//parameter
    try {
        const response = await fetch(base + query);
        if (!response.ok) {
            throw new Error('Failed to fetch weather data. Please check your city name.');
        }
        const data = await response.json();//Convert to json format
        return data;
    } catch (error) {
        // Generate a popup to inform the user about the error
        alert(error.message);
    }
}

const getFutureWeather = async (city) => {//Same as above
    const base = "https://api.openweathermap.org/data/2.5/forecast";
    const query = `?q=${city}&appid=${key}&units=metric`;
    const response = await fetch(base + query);
    const data = await response.json();
    return data;
}
// display currrent weather
function displayWeather(currentcity){

    let weatherdata = null; //variable that carry weather information
    if(currentcity){
        weatherdata = getWeather(currentcity); //get weather data
    } else {
        console.error("City is not defined.");
        return;
    }
    
    //Data processing
    weatherdata.then(data => {
        currentdata = data
        backgroundweather = data.weather[0].main
        console.log(backgroundweather)
        switch(backgroundweather){
            case('Clear'):                
                document.body.style.backgroundImage = "url(https://cdn.pixabay.com/photo/2016/01/02/01/51/clouds-1117584_1280.jpg)";
                break;
            case('Clouds'):
                document.body.style.backgroundImage = "url(https://i.weather.com.cn/images/guangxi/gxsy/mrjs/mr/2021/09/22/1632276766535057809.jpg)";
                break;
            case('Rain'):
                document.body.style.backgroundImage = "url(https://img2.baidu.com/it/u=2272044105,1673572502&fm=253&fmt=auto&app=138&f=JPEG?w=756&h=500)";
                break;
            case('Thunderstorm'):
                document.body.style.backgroundImage = "url(https://cdn.pixabay.com/photo/2014/07/23/02/41/lightning-399853_1280.jpg)";
                break;
            case('Snow'):
                document.body.style.backgroundImage = "url(https://cdn.pixabay.com/photo/2023/12/06/08/53/winter-8433257_1280.jpg)";
                break;
            case('Mist'):
                document.body.style.backgroundImage = "url(https://cdn.pixabay.com/photo/2020/09/13/09/47/morning-fog-5567840_1280.jpg)";
                break;
            case('Drizzle'):
                document.body.style.backgroundImage = "url(https://pic1.zhimg.com/80/v2-079ee7711d841e041d50782e596298c0_1440w.webp)";
                break;
            case('Drizzl'):
                document.body.style.backgroundImage = "url(https://cdn.pixabay.com/photo/2020/09/13/09/47/morning-fog-5567840_1280.jpg)";
                break;
            default:
                document.body.style.backgroundColor = white;
                break;
        }
        displaycurrentcondition(data)
        const obj = document.getElementById("weatherIcon"); //connect to html img to display weather icons
        obj.setAttribute("src", `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`); //get weather icon from website

        const latitude = data.coord.lat;
        const longitude = data.coord.lon;
        const map = document.getElementById("map")
        map.innerHTML = `<iframe width="100%" height="100%" frameborder="0" style="border:0" src="https://maps.google.com/maps?q=${latitude},${longitude}&z=12&output=embed"></iframe>`;
    });
}

function displaycurrentcondition(data){
    const currentweather = document.getElementById('weather');//connect to html to display city and weather
        const currentcity = document.getElementById('city');
        const currenttemp = document.getElementById('temp');
        const other = document.getElementById('other');
        var Unit = ''
        if(unit == 'Celsius'){ //show units by 'C' and 'F'
            Unit = "°C";
            currenttemp.innerHTML = `
                <span><b>Temperature:</b> ${data.main.temp}${Unit}</span>`
        }
        else if(unit == 'Fahrenheit'){
            Unit = '°F';
            const f = ChangeUnit(data.main.temp)
            currenttemp.innerHTML = `
                <span><b>Temperature:</b> ${f}${Unit}</span>`
        }
        currentcity.innerHTML = `
            <h2><b>Current City:</b> ${data.name}</h2>
        `
        currentweather.innerHTML = `
            <span><b>Weather:</b> ${data.weather[0].description}</span>
            `
        

        other.innerHTML = `
            <p><b>Wind Direction:</b> ${toDirStr(data.wind.deg)}</p>
            <p><b>Wind Speed:</b> ${data.wind.speed}</p>
            <p><b>Humidity:</b> ${data.main.humidity}</p>
            `;
}
// display future weather
function displayFutureWeather(currentcity){
    
    let weatherdata = null;
    if(currentcity){// get the future weather data
        weatherdata = getFutureWeather(currentcity);
    } else {
        console.error("City is not defined.");
        return;
    }
    
    //Data processing
    weatherdata.then(data => {
        futuredata = data
        const Reminder = document.getElementById('Reminder'); //connect to html img to display current time
        displayCanvas(data)
        Reminder.innerHTML =  ``//Clear when updating
        for (i = 0; i < 4; i++){ //judge if it will rain future 4 * 3 = 12 hours
            if (data.list[i].weather[0].main == 'Rain' || data.list[i].weather[0].main == 'Thunderstorm'){
                Reminder.innerHTML =  `
                    Reminder: It will rain in the next 12 hours, remember to bring an umbrella
                `//if rain, post this reminder
            }
        }

        
    });
}
function displayCanvas(data){
    const currenttimetext = document.getElementById('time'); //connect to html img to display raining reminder
    const timezoneOffset = data.city.timezone; // Get time zone offset
        const currentTimestamp = Math.floor(Date.now() / 1000); //Get the current timestamp in seconds
        const utcTimestamp = currentTimestamp + timezoneOffset; // Apply time zone offset to timestamp
        const utcDate = new Date(utcTimestamp * 1000); // Convert to milliseconds
        const year = utcDate.getFullYear();
        const month = utcDate.getUTCMonth() + 1;
        var day = utcDate.getUTCDate();
        const hoursString = utcDate.getUTCHours(); // get hour
        var minutesString = utcDate.getUTCMinutes(); // get minute
        if(minutesString <= 9){//Add 0 to the tens digit
            minutesString = '0' + minutesString
        }
        currenttimetext.innerHTML = `<b>Local time:</b> ${year}/${month}/${day}  ${hoursString}:${minutesString}`;//show current time
        var currentDate = new Date(); //Get the current international standard time
        const standerdhourString = currentDate.getUTCHours();//get stander dhour
        Difference = hoursString - standerdhourString//Calculate the difference from international standard time
        var temp = new Array(24)//future temperature
        var threehour = new Array(24)//Determine the display time according to the forecast node (three hours apart)
        for(i = 0; i < 24; i++){//future 12 * 3 = 36 hour data
            if(unit == 'Celsius'){
                temp[i] = data.list[i].main.temp //get temperature
            }
            else{
                temp[i] = ChangeUnit(data.list[i].main.temp)
            }
            var time = data.list[i].dt_txt.split(" ")[1].split(":")[0] //get time
            var inttime = parseInt(time) //Convert time to int type
            if(parseInt(inttime + Difference) >= 24){ //Adapt to the day before or the day next
                inttime = inttime - 24
            }else if(parseInt(inttime + Difference) < 0){
                inttime = inttime + 24
            }
            if(inttime + Difference < 3){
                day += 1
            }
            threehour[i] = `${month}/${day} ` + (inttime + Difference) + ":00" //Find final time, add minutes
        }
        
        var displaytemp = document.getElementById('weatherChart').getContext('2d');//connect to html img to display canvas

        var data = {
            labels: threehour,
            datasets: [{
                label: 'Temperature',
                data: temp,
                borderColor: 'blue',
                backgroundColor: 'lightblue'
            }]
        };

        futuretemp = new Chart(displaytemp, {//create canvas
            type: 'line',
            data: data,
        });
}

async function searchWeather() {//when click the button
    futuretemp.destroy();//recreate the canvas
    try{
        const cityInput = document.getElementById("searchCity").value;//get the input info
        if(cityInput == ''){
            throw new Error('Please type in city name!')
        }
        const result = await translateCityName(cityInput);
        displayWeather(result);
        displayFutureWeather(result);
    }
    catch (error) {
        // Generate a popup to inform the user about the error
        alert(error.message);
    }
}

function toDirStr(num){//Convert angle to wind direction
    num = parseInt(num);
    let dir = '';
    if(num === 0 || num === 360){
        dir = 'North';
    } else if(num > 0 && num < 90){
        dir = 'North East';
    } else if(num === 90){
        dir = 'East';
    } else if(num > 90 && num < 180){
        dir = 'South East';
    } else if(num === 180){
        dir = 'South';
    } else if(num > 180 && num < 270){
        dir = 'South West';
    } else if(num === 270){
        dir = 'West';
    } else if(num > 270 && num < 360){
        dir = 'North West';
    } else {
        dir = 'Error';
    }
    return dir;
}

// Call the getLocation function to get the user's location
function getLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                resolve(position.coords);
            }, error => {
                reject(error);
            });
        } else {
            reject("Geolocation is not supported by this browser.");
        }
    });
}

function getCityName(latitude, longitude) {// Get the current city based on latitude and longitude coordinates
    return fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`)
        .then(response => response.json())
        .then(data => {
            const city = data.name;
            return city;
        });
}

async function translateCityName(cityInput) {
    if (/^[A-Za-z\s]+$/.test(cityInput)) {
        return cityInput; // Enter the Chinese city name and return directly
    } else {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=zh-CN&tl=en&dt=t&q=${cityInput}`;
        
        try {
            const response = await $.ajax({ url: url });
            const englishCityName = response[0][0][0];
            return englishCityName; // Returns the translated English city name
        } catch (error) {
            console.error("Translation error:", error);
            return null; // Returns null if translation fails
        }
    }
}


// show matching results
function showResults() {
    
    const searchInput = document.getElementById("searchCity");
    const searchResults = document.getElementById("searchResults"); // Get the search input and search results elements
    
    const userInput = searchInput.value.toLowerCase(); // Get user input and convert to lowercase
    
    searchResults.innerHTML = ""; // Clear the search results element
    
    
    if (userInput) { // If user input is not empty
        // Filter the city list based on user input
        const filteredResults = cityList.filter(city => city.name.toLowerCase().includes(userInput));
        // Iterate through the filtered results
        filteredResults.forEach(result => {
            // Create a new result element
            const resultElement = document.createElement("div");
            resultElement.classList.add("result");
            resultElement.textContent = result.name + "," + result.country;
            // When the result element is clicked, set the city name as the value of the search input and call the searchWeather function
            resultElement.addEventListener("click", () => {
                searchInput.value = result.name + "," + result.country;
                searchResults.style.display = "none";
                searchWeather();
            });
            
            searchResults.appendChild(resultElement); // Append the result element to the search results
        });
    
        searchResults.style.display = "block";  // Display the search results
        
    } else {
        // If user input is empty, hide the search results
        searchResults.style.display = "none";
    }
}