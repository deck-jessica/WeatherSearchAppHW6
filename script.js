$(document).ready(function() {
var searchLat = '';
var searchLon = '';

function saveToStorage (newCity) {
  var currentData = JSON.parse(localStorage.getItem("saved-cities")) || [];
  currentData.push(newCity);
  localStorage.setItem("saved-cities", JSON.stringify(currentData));
}
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

$(".search-history-btn").on("click", function(){
  var searchHistoryCity = $(this).text();
  submitSearch(searchHistoryCity);
})

function submitSearch(cityName) {


var cityURL = 'https://api.opencagedata.com/geocode/v1/json?q=' + cityName + '&key=f208ee39889e4e2bb2b22d72f20c80e4';
$.ajax({
  url: cityURL, 
  method: "GET",
  success: (function(response){
  console.log(response);
  searchLat = response.results[0].geometry.lat;
  searchLon = response.results[0].geometry.lng;


var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + searchLat + "&lon=" + searchLon + "&appid=480467fcc74de595a5fe8d4f0216c279";

$.ajax({
    url: queryURL,
    method:"GET"
}).then(function(response2){
console.log(response2);
// building the div to house the search results
var weatherResults = $("<div class='weather-results'>");
// taking search results and appending to the page
var cityDisp = $("<h2>").text("City: " + cityName);
var cityIcon = response2.current.weather[0].icon;
var cityImg = $("<img>").attr({src: "https://openweathermap.org/img/wn/" + cityIcon + "@2x.png",
                                alt: response2.current.weather[0].description});
var tempToF = (response2.current.temp - 273.15) *1.80 + 32;
var cityTemp = $("<p>").text("Temp(F): " + tempToF.toFixed(2) + " &#176F");
var humidityRes = (response2.current.humidity);
var cityHumidity = $("<p>").text("Humidity: " + humidityRes +"%");
var windRes = (response2.current.wind_speed);
var cityWind = $("<p>").text("Wind Speed: " + windRes +"MPH");
var uvRes = (response2.current.uvi);
  if (uvRes <= 2) {
    $(uvRes).addClass("badge badge-success");
  } else if (uvRes > 2 && uvRes <= 5) {
    $(uvRes).addClass("badge badge-warning");
  } else if (uvRes > 5) {
    $(uvRes).addClass("badge badge-danger");
  }
 var cityUV = $("<span>").html("UV Index: " + uvRes); 

$(".card-text").empty();

weatherResults.append(cityDisp, cityImg, cityTemp, cityHumidity, cityWind, cityUV);


$(".card-text").append(weatherResults);
})
})
})   
}

$('#searchBtn').on('click', function(event) {
  event.preventDefault();
  var searchCity = $("#searchCity").val();
  saveToStorage(searchCity);
  submitSearch(searchCity);
  $("#searchCity").val('');
});







})
