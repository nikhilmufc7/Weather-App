$(function() {
  
  // OpenWeather API Key
  var owAppId = "0467bbad2230162c7dc089ff287cdc7f";
  
  // displayWeather is the primary function of this app.
  // After getting the location information, it calls
  // the getWeather function to retrieve and display the weather.
  // Accepts a unit type of "metric" or "imperial" only.
  function displayWeather(unitType) {
    
    // get location info from IP-API.com (navigator.geolocation is depricated)
    $.getJSON('http://ip-api.com/json', success).fail(error);
     
    function success(ipINFO) {
      var lat = ipINFO.lat,
      long = ipINFO.lon,
      city = ipINFO.city + ", " + ipINFO.region,
      owApiUrl = "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + long + "&units=" + unitType + "&appid=" + owAppId;
      
      // Call getWeather to retrieve and display the data.
      // Additionally, pass the city string as it contains
      // the US state information as well. getWeather will
      // use this string if provided to set the city name.
      getWeather(owApiUrl, unitType, city);
    }
    
    function error() {
      alert("Error retrieving location information. Please reload the page or try again later.");
    }
    
  }
  
  // getWeather function retrieves data from the
  // OpenWeather API and displays it
  // optional 3rd param: city name string
  function getWeather(url, unitType) {
    var location;  
    // set location if provided
    if (arguments.length > 2) location = arguments[2];
    
    // access the OpenWeather API
    $.getJSON(url, function(data) {
      var current = new Weather(data, location, unitType);
      // call dayNight to set the background color
      dayNight(current.sunrise, current.sunset);
      // call modifyDOM to place the data into the DOM
      modifyDOM(current);
    });
  }
  
  // dayNight function sets the body background based on time of day
  function dayNight(sunrise, sunset) {
    var dateTime = Math.floor((new Date()).getTime() / 1000);
    if ( dateTime >= sunrise && dateTime < sunset ) {
      // day
      $("body").removeClass("night");
      $("body").addClass("day");
    } else {
      // night
      $("body").removeClass("day");
      $("body").addClass("night");
    }
  }
  
  // modifyDOM inserts the data into the document
  // accepts a Weather object as parameter
  function modifyDOM(current) {
    var city = "<p>" + current.city + "</p>",
    date = "<p>" + current.date + "</p>",
    icon = "<img src='" + current.icon + "'>",
    desc = "<p>" + current.condition + "</p>",
    temp = "<p class='small'>temp</p><p>" + current.temp + " <span>" + getTempSymbol(current.unitType) + "</span></p>",
    hum = "<p class='small'>humidity</p><p>" + current.humidity + "<span>&#37;</span></p>",
    windspeed = "<p class='small'>wind</p><p>" + current.windSpeed + " <span>" + getSpeedSymbol(current.unitType) + "</span></p>",
    winddir = "<span class='glyphicon glyphicon-circle-arrow-up' aria-hidden='true'></span>";
    
    $(".city").html(city);
    $(".date").html(date);
    $(".icon").html(icon);
    $(".desc").html(desc);
    $(".temp").html(temp);
    $(".humidity").html(hum);
    $(".windspeed").html(windspeed);
    $(".winddir").html(winddir);
    $(".winddir .glyphicon").css({"transform": "rotate(-" + current.windDir + "deg)", "-ms-transform": "rotate(-" + current.windDir + "deg)", "-webkit-transform": "rotate(-" + current.windDir + "deg)"});
    
    centerContent();
    $(".container").animate({opacity: 1}, 800, function() {
      $(this).css({"opacity": 1});
    })
    
    function getTempSymbol(unitType) {
      if (unitType == "metric") {
        return "&deg;C"
      } else if (unitType == "imperial") {
        return "&deg;F";
      } else {
        return "unknown unit type";
      }
    }
    
    function getSpeedSymbol(unitType) {
      if (unitType == "metric") {
        return "kmh"
      } else if (unitType == "imperial") {
        return "mph"
      } else {
        return "unknown unit type";
      }
    }
  }
  
  // Weather object stores the data returned
  // from the OpenWeather API call
  function Weather(data, location, unitType) {
    var d = new Date();
    this.city = location || (data.name + ", " + data.sys.country);
    this.icon = "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
    this.condition = data.weather[0].description;
    this.temp = Math.round(data.main.temp);
    this.humidity = data.main.humidity;
    this.windDir = data.wind.deg;
    this.sunrise = data.sys.sunrise;
    this.sunset = data.sys.sunset;
    this.unitType = unitType;
    this.date = d.toDateString();
    if (unitType == "metric") {
      this.windSpeed = Math.round(data.wind.speed * 3.6);
    } else {
      this.windSpeed = Math.round(data.wind.speed);
    }
  }
  
  // centerContent centers the content vertically
  // if content is smaller than viewport
  function centerContent() {
    var padding;
    var naturalHeight = $(".container").height() + 20;
    var windowHeight = $(window).height();
    if (naturalHeight < windowHeight) {
      padding = (windowHeight - naturalHeight) / 2;
      $(".container").css({"padding-top": padding + "px"});
    } else {
      $(".container").css({"padding-top": 20})
    }
  }
  
  displayWeather("imperial");
  
  $(".btn").click(function() {
    if ($(this).hasClass("metric")) {
      $(this).removeClass("metric");
      $(this).addClass("imperial");
      $(this).text("US / Imperial");
      displayWeather("metric");
    } else {
      $(this).removeClass("imperial");
      $(this).addClass("metric");
      $(this).text("Metric");
      displayWeather("imperial");
    }
  });
  
  $(window).resize(function() {
    centerContent();
  });
  
});
