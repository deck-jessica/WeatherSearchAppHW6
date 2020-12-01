$(document).ready(function() {
var searchLat = '';
var searchLon = '';



function submitSearch(event) {
    event.preventDefault();
    var searchCity = $("#searchCity").val();

var cityURL = 'https://api.opencagedata.com/geocode/v1/json?q=' + searchCity + '&key=f208ee39889e4e2bb2b22d72f20c80e4';
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
var weatherResults = $("<div class='weather-results'>");
var cityDisp = $("<h2>").text("City: " + searchCity);
weatherResults.append(cityDisp);
var tempToF = (response2.current.temp - 273.15) *1.80 + 32;
var cityTemp = $("<p>").text("Temp(F): " + tempToF);
weatherResults.append(cityTemp);
var humidtyRes = (response2.current.humidty);
var cityHumidity = $("<p>").text("Humidity: " + humidtyRes +"%");

$(".card-text").append(weatherResults);
})
})
})   
}

$('#searchBtn').on('click', submitSearch);







})
