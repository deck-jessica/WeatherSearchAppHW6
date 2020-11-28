$(document).ready(function() {
var searchLat = '';
var searchLon = '';



function submitSearch(event) {
    event.preventDefault();
    var searchCity = $(this).siblings(".form-group").children("#searchCity").val();
    console.log(searchCity);
}

$('btn').on('click', submitSearch);

function convertCitytoLatLon () {
    
    $.ajax({
        url: 'https://geocode.xyz',
        data: {
          auth: '898433989651038822474x14465',
          locate: searchCity,
          json: '1'
        }
      }).done(function(data) {
        console.log(data);
      });
}



var APIkey = "480467fcc74de595a5fe8d4f0216c279";
var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + searchLat + "&lon=" + searchLon + "&appid=" + APIkey;
function displayWeatherInfo (){
$.ajax({
    url: queryURL,
    method:"GET"
}).then(function(response){

})
}
})