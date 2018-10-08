let lat=32.7767,long=-96.7970;

let queryURL=`https://m.uber.com/ul/?action=setPickup&setPickup&pickup[latitude]=${lat}8&pickup[longitude]=${long}&dropoff[latitude]=37.802374&dropoff[longitude]=-122.405818`


$("#myLink").append(`<a href="${queryURL}">Open Uber</a>`);
// var x = document.getElementById("demo");
// const eventsDisp = $("#content");
// let myLat=35.6895;
// let myLong=139.6917;

// function getLocation() {
//     if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(savePosition, showError);
//     } else {
//         x.innerHTML = "Geolocation is not supported by this browser.";
//     }
// }

// function savePosition(position) {
//     myLat=position.coords.latitude;
//     myLong=position.coords.longitude;
//     // console.log(myLat,myLong);
//     grabEvents();
//     x.innerHTML = "Latitude: " + myLat +
//         "<br>Longitude: " + myLong;
// }

// function showError(error) {
//     switch (error.code) {
//         case error.PERMISSION_DENIED:
//             x.innerHTML = "User denied the request for Geolocation."
//             break;
//         case error.POSITION_UNAVAILABLE:
//             x.innerHTML = "Location information is unavailable."
//             break;
//         case error.TIMEOUT:
//             x.innerHTML = "The request to get user location timed out."
//             break;
//         case error.UNKNOWN_ERROR:
//             x.innerHTML = "An unknown error occurred."
//             break;
//     }
// }

// function grabEvents() {

//     var parameters = {

//         app_key: "LT5Q2szWsMzXGZpj",

//         //   q: "music",

//         // where: "32.929164799999995,-97.01022979999999",
//         where:`${myLat},${myLong}`,
//         "date": "Future",
//         page_number: 1,
//         page_size: 15,
//         sort_order: "date",
//         within: "25 miles",
//         include:'categories,subcategories,price,popularity,links'

//     };

//     EVDB.API.call("/events/search", parameters, function (res) {

//         // Note: this relies on the custom toString() methods below
//         console.log(res);
//         // console.log(res.events.event[0]);
//         for (let i = 0; i < res.events.event.length; i++) {
//             // console.log(res.events.event[i].image);
//             if (res.events.event[i].image!==null) {
//                 eventsDisp.append(`<div id="wrapper event${i}">
//                 ${i} ${res.events.event[i].title} 
//                 Starting: ${res.events.event[i].start_time} 
//                 <img src="${res.events.event[i].image.thumb.url}">
//                 </div><br>`);
//             }else{
//                 eventsDisp.append(`<div id="wrapper">${res.events.event[i].title} Starting: ${res.events.event[i].start_time} No Image</div><br>`);
//             }
//         }
//     });
// }

// $("#locationBtn").on('click',getLocation);
// $("#pullBtn").on('click',grabEvents)