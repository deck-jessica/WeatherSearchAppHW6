// on page loading, these functions are ready to go
$(document).ready(function() {
var searchLat = '';
var searchLon = '';
// function to save to local storage for search history
function saveToStorage (newCity) {
  var currentData = JSON.parse(localStorage.getItem("saved-cities")) || [];
  currentData.push(newCity);
  localStorage.setItem("saved-cities", JSON.stringify(currentData));
}
// function to make a button for the search history cities
function renderSaveCityBtns () {
  var currentData = JSON.parse(localStorage.getItem("saved-cities")) || [];
  currentData.forEach(function (cityData){
   var btnCity =  $("<button>"); 
   console.log(btnCity);
   btnCity.addClass("btn btn-secondary search-history-btn");
   btnCity.text(cityData);
   $(".searchHistory").prepend(btnCity);

  })
}

renderSaveCityBtns();
// executes the same search function as initial search
$(".search-history-btn").on("click", function(){
  var searchHistoryCity = $(this).text();
  submitSearch(searchHistoryCity);
})
// function to take user input, convert city name into lat lon coordinates, and then search for weather results to render to page
function submitSearch(cityName) {

// first api call that uses input from user to get the lat lon coordinates
var cityURL = 'https://api.opencagedata.com/geocode/v1/json?q=' + cityName + '&key=f208ee39889e4e2bb2b22d72f20c80e4';
$.ajax({
  url: cityURL, 
  method: "GET",
  success: (function(response){
  console.log(response);
  searchLat = response.results[0].geometry.lat;
  searchLon = response.results[0].geometry.lng;

//based on the success of the first api call, this openweather API will find the city's weather and forecast info in one call
var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + searchLat + "&lon=" + searchLon + "&units=imperial&appid=480467fcc74de595a5fe8d4f0216c279";

$.ajax({
    url: queryURL,
    method:"GET"
}).then(function(response2){
console.log(response2);
// building the div to house the search results
var weatherResults = $("<div class='weather-results'>");
// taking search results and appending to the page
var cityDisp = $("<h2>").text(cityName);
// use moment.js to convert onecall unix into human readable date
var cityDateToStandard = moment.unix(response2.current.dt).format("MM/DD/YY");
var cityDate = $("<p>").text("Date: " + cityDateToStandard);
// takes weather icon and description from onecall to render an image
var cityIcon = response2.current.weather[0].icon;
var cityImg = $("<img>").attr({src: "https://openweathermap.org/img/wn/" + cityIcon + "@2x.png",
                                alt: response2.current.weather[0].description});
var tempToF = response2.current.temp;
var cityTemp = $("<p>").text("Temp(F): " + tempToF + " F");
var humidityRes = (response2.current.humidity);
var cityHumidity = $("<p>").text("Humidity: " + humidityRes +"%");
var windRes = (response2.current.wind_speed);
var cityWind = $("<p>").text("Wind Speed: " + windRes +" MPH");
var uvRes = (response2.current.uvi);
var cityUV = $("<span>").html("UV Index: " + uvRes);
  if (uvRes <= 2) {
    cityUV.addClass("badge badge-success");
  } else if (uvRes > 2 && uvRes <= 5) {
    cityUV.addClass("badge badge-warning");
  } else if (uvRes > 5) {
    cityUV.addClass("badge badge-danger");
  }
  

$(".card-text").empty();

weatherResults.append(cityDisp, cityDate, cityImg, cityTemp, cityHumidity, cityWind, cityUV);


$(".card-text").append(weatherResults);
// similar to the daily conditions, this renders the onecall info into a daily card with an image
var forecastEls = $('.forecast');
$('.forecast').empty();
for (var i=0; i < forecastEls.length; i++) {
  var j = i+1;
  var forecastEl = $(forecastEls[i]);
  console.log(forecastEl);
var forecastDateToStandard = moment.unix(response2.daily[j].dt).format(" ddd MM/DD");
var forecastDate = $("<p>").text(forecastDateToStandard);
var forecastIcon = response2.daily[j].weather[0].icon;
var forecastImg = $("<img>").attr({src: "https://openweathermap.org/img/wn/" + forecastIcon + "@2x.png",
                                alt: response2.daily[j].weather[0].description});
var forecastHighTemp = response2.daily[j].temp.max;
var forecastHTemp = $("<p>").text("High Temp(F): " + forecastHighTemp + " F");
var forecastLowTemp = response2.daily[j].temp.min;
var forecastLTemp = $("<p>").text("Low Temp(F): " + forecastLowTemp + " F");
var forecastHumidityRes = (response2.daily[j].humidity);
var forecastHumidity = $("<p>").text("Humidity: " + forecastHumidityRes +"%");
forecastEl.append(forecastDate, forecastImg, forecastHTemp, forecastLTemp, forecastHumidity);
}

})
})
})   
}
// function to execute the api calls to get the data on click
$('#searchBtn').on('click', function(event) {
  event.preventDefault();
  var searchCity = $("#searchCity").val();
  saveToStorage(searchCity);
  submitSearch(searchCity);
  $("#searchCity").val('');
});







})
