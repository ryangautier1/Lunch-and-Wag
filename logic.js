// Click handler for share location button
$("#share-location").on("click", getLocation());

// gets the users gps location. This code was taken from google maps api page
function getLocation() {
    var startPos;
    var geoSuccess = function(position) {
      startPos = position;
      document.getElementById('startLat').innerHTML = startPos.coords.latitude;
      document.getElementById('startLon').innerHTML = startPos.coords.longitude;
    };
    navigator.geolocation.getCurrentPosition(geoSuccess);
  };

// check for Geolocation support. This code was taken from google maps api page
if (navigator.geolocation) {
    console.log('Geolocation is supported!');
}
else {
    console.log('Geolocation is not supported for this Browser/OS.');
}

// display map based on coordinates
var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: userLat, lng: userLng },
        zoom: 8
    });
}

// Portions of the weather api code were taken from the weather dashboard project
// query url for current weather
var weatherQueryUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + userLat + "&lon=" + userLng + "&appid=a07b059ae0ff859a91d785bcde02804c";

// call for current weather
$.ajax({
    url: weatherQueryUrl,
    method: "GET"
}).then(function (response) {

    // get current sky id
    var currentSky = response.weather[0].id;
    var iconCode = getSkyIcon(currentSky);
    $("#current-sky-icon").attr("src", "http://openweathermap.org/img/wn/" + iconCode + "@2x.png");

    // get current date
    var currentDate = moment().format('l');
    // add current date to heading of current city stats
    $("#current-city").append(currentDate);

    // get current temp
    var currentTemp = response.main.temp;
    // Convert from kelvin to farenheit
    currentTemp = (currentTemp - 273.15) * (9 / 5) + 32;
    currentTemp = Math.round(currentTemp);
    $("#current-temp").append("Temperature: " + currentTemp + " °F");
});

// gets current weather based on api response. The things currently being returned are codes for the weather icon
function getCurrentWeather(b) {
    var a = b.toString();
    // Thunderstorm
    if (a[0] == "2") {
        return "11d";
    }
    // Drizzle
    else if (a[0] == "3") {
        return "09d";
    }
    // 511 is freezing rain, 6xx is snow
    else if (a == 511 || a[0] == 6) {
        return "13d";
    }
    // Rain
    else if (a[0] == 5) {
        return "10d";
    }
    else if (a == 781) {
        return // TORNADO
    }
    // mist/fog/dust except 781 is tornado
    else if (a[0] == 7) {
        return "50d";
    }
    // clear
    else if (a == 800) {
        return "01d";
    }
    // clouds
    else if (a[0] == 8) {
        return "02d";
    }
}