/* earthquakes.js
Script file for the INFO 343 Lab 7 Earthquake plotting page

SODA data source URL: https://soda.demo.socrata.com/resource/earthquakes.json
app token (pass as "$$app_token" query string param): Hwu90cjqyFghuAWQgannew7Oi
*/

//create a global variable namespace based on usgs.gov
var gov = gov || {};
gov.usgs = gov.usgs || {};
gov.usgs.quakesUrl = "https://soda.demo.socrata.com/resource/earthquakes.json?$$app_token=Hwu90cjqyFghuAWQgannew7Oi";
gov.usgs.quakes
gov.usgs.quakesMap

//AJAX Error event handler
//just alerts the user of the error
$(document).ajaxError(function(event, jqXHR, err) {
    alert("Problem obtaining data: " + jqXHR.statusText);
});

$(function() {
    getQuakes();
});

// Get earthquakes data
function getQuakes() {
    $.getJSON(gov.usgs.quakesUrl, function(quakes) {
        gov.usgs.quakes = quakes;
        $(".message").html("Displaying " + quakes.length + " earthquakes");

        gov.usgs.quakesMap = new google.maps.Map($(".map-container")[0], {
            center : new google.maps.LatLng(0, 0),
            zoom : 2,
            mapTypeId : google.maps.MapTypeId.TERRAIN,
            streetViewControl : false
        });

        addQuakeMarkers(quakes, gov.usgs.quakesMap);
    });

    // Add loading message
    $(".message").html("Loading... <img src=\"img/loading.gif\">");
}

//loop over the quakes array and add a marker for each quake
function addQuakeMarkers(quakes, map) {
    //loop over the quakes array and add a marker for each quake
    var quake;

    for (var i = 0; i < quakes.length; i++) {
        quake = quakes[i];
        quake.mapMarker = new google.maps.Marker({
            map : map,
            position : new google.maps.LatLng(quake.location.latitude, quake.location.longitude)
        });

        google.maps.event.addListener(quake.mapMarker, "click", function() {
            // Automatically close
            if (gov.usgs.iw) {
                gov.usgs.iw.close();
            }

            //create an info window with the quake info
            gov.usgs.iw = new google.maps.InfoWindow({
                content : new Date(quake.datetime).toLocaleString() + ": magnitude " + quake.magnitude + " at depth of " + quake.depth + " meters"
            });

            //open the info window
            gov.usgs.iw.open(map, this);
        });
    }
}