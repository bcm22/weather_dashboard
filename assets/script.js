$(function () {// setting up jquery
    //declaring globals
    var APIKey = '73864aa08bb0fe712a58cb3ffefbb391';
    var search = $('#search-button');
    var city = "";
    var handleCityHistory = $('#city-history');
    var todayJS = dayjs().format('M/D/YYYY');

function handleCityHistory(event){
    //when saved city button is clicked this will pull id from the button which is the city name. Then it will use that to query the api
    var btnClicked = $(event.target);
    city  = btnClicked.attr('id');
    //setting up api query urls
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey+"&units=imperial";
    var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIKey +"&units=imperial";
    var icon = "";

    fetch(queryURL)
        .then(function(response){
        if (response.status === 200){ 
            return response.json();
        }
        })
        .then(function (data){
            $('#city-name').text(city + "   "+todayJS);//set today city
            $('#today-temp').text(data.main.temp);//set today temp
            $('#today-wind').text(data.wind.speed);//set today wind speed
            $('#today-humidity').text(data.main.humidity);//set today humidity
            icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;//set today icon
            $('#today-icon').attr('src', icon);
        })
  
        fetch(forecastURL)
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            var forecast = document.getElementById('fiveday-forecast');//get five day forecast section
            forecast.innerHTML = ""; //clear forecast if anything was alredy in there
            for (var i = 1; i < 35; i++)//loop through array of data to pull
            {
                var day = data.list[i];
                if (i === 2 || i === 10 || i === 18 || i === 26 || i === 34){//the api returns multiple different hours per day. this is used to make sure we get 
                icon = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`; //getting icon
                var formatDate = dayjs(day.dt_txt).format('M/D/YYYY'); //formatting date
                    //this creates a new day
                    var newDay = `<div id="day-of-week" class="col-2 me-4">
                    <p id="future-day">${formatDate}</p>
                    <img src="${icon}" alt="" id="future-icon">
                    <p>Temp: <span id="future-temp">${day.main.temp}</span><span>F</span></p>
                    <p>Wind: <span id="future-wind">${day.wind.speed}</span><span>MPH</span></p>
                    <p>Humidity: <span id="future-humidity">${day.main.humidity}</span><span>%</span></p>
                </div>`;
                forecast.innerHTML += newDay;//adds the new day onto forecast
                }
            }
        })
}

//function to create a new button
function createNewButton(cityName){
    return `<button class="btn btn-secondary mt-1 savedCity" id="${cityName}">${cityName}</button>`;
}

//function to load cities from the local storage
function loadCityHistory() {
    var cityHistory = JSON.parse(localStorage.getItem('CityHistory'));
    var cityHistoryHTML = document.getElementById('city-history');
    
    if (localStorage.getItem('CityHistory') === null)// wont run if there is nothing in local storage
    {
        return
    }

    for (var i = 0; i < cityHistory.length; i++) //make buttons and appened to html for all items within local storage
    {
        cityHistoryHTML.innerHTML += cityHistory[i];
    }
}

//
function findCity (){//most of this is the same as the function above reference that for comments. anything different between the two will have corresponding comments
    city  = $('#search-bar').val();//get value of search bar for city
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey+"&units=imperial";
    var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIKey +"&units=imperial";
    var icon = "";
    var cityHistoryHTML = document.getElementById('city-history');

    $('#search-bar').val("");//clear search bar

    fetch(queryURL)
        .then(function(response){
        if (response.status === 200){ 
            return response.json();
        }
        })
        .then(function (data){
            $('#city-name').text(city  + "   "+todayJS);
            $('#today-temp').text(data.main.temp);
            $('#today-wind').text(data.wind.speed);
            $('#today-humidity').text(data.main.humidity);
            icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
            $('#today-icon').attr('src', icon);
        })
  
        fetch(forecastURL)
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            var forecast = document.getElementById('fiveday-forecast');

            forecast.innerHTML = "";
            for (var i = 1; i < 35; i++)
            {
                var day = data.list[i];
                if (i === 2 || i === 10 || i === 18 || i === 26 || i === 34){
                icon = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;
                var formatDate = dayjs(day.dt_txt).format('M/D/YYYY');

                    var newDay = `<div id="day-of-week" class="col-2 me-4">
                    <p id="future-day">${formatDate}</p>
                    <img src="${icon}" alt="" id="future-icon">
                    <p>Temp: <span id="future-temp">${day.main.temp}</span><span>F</span></p>
                    <p>Wind: <span id="future-wind">${day.wind.speed}</span><span>MPH</span></p>
                    <p>Humidity: <span id="future-humidity">${day.main.humidity}</span><span>%</span></p>
                </div>`;
                forecast.innerHTML += newDay;
                }
            }
        })

        savedCitiesHTML.innerHTML += createNewButton(city);// create button and appened to list of cities stored

        //add the city to local storage
        if (localStorage.getItem('SavedCities') === null)
        {
            var cities = [];
            cities.push(createNewButton(city));
            var citiesTemp = JSON.stringify(cities)
            localStorage.setItem('SavedCities', citiesTemp);
        }
        else {
            var cities = JSON.parse(localStorage.getItem('SavedCities'));
            cities.push(createNewButton(city));
            var citiesTemp = JSON.stringify(cities);
            localStorage.setItem('SavedCities', citiesTemp);
        }

}
//function decleration for use
search.on('click', findCity)
loadSavedCities();
savedCityBlock.on('click', '.savedCity', handleSavedCity);

});