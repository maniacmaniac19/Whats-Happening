var map;

function initMap() {
    var location = {
        lat: 38.7578,
        lng: 8.9806,
    };
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 4,
        center: location

       
        
    });
    var marker = new google.maps.Marker({position: location, map: map});
}

function moveToLocation(lat, lng) {
    var center = new google.maps.LatLng(lat, lng);
    // using global variable:
    var marker = new google.maps.Marker({position: center, map: map});
    map.panTo(center);
}

function runStuff() {
    console.log("runStuff");
    moveToLocation(38.7578, 8.9806);
}


$("#getLocation").on("click", function (event){

    event.preventDefault();

  let latitude = $("#latitude").val()
  let longitude = $("#longitude").val()
  moveToLocation(parseInt(latitude), parseInt(longitude));

});


