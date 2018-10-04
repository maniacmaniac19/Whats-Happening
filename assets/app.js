// Where I Dump
const myDump=$("#eventDump");

//default parameters
let myParam = {
    app_key: "LT5Q2szWsMzXGZpj",
    //   q: "music",
    // where: "32.929164799999995,-97.01022979999999",
    where:``,
    date: "Future",
    page_number: 1,
    page_size: 15,
    sort_order: "date",
    within: "25 miles",
    include:'categories,subcategories,price,popularity,links',
    mature:"all"
};

// Update parameters based on user input
// const updateParam=function(){
    
// }

// Asks user for location access
const getLocation=function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(savePosition);
    } 
    // else {
    //     x.innerHTML = "Geolocation is not supported by this browser.";
    // }
}
// Updates user location data, calls the showMenu and makes initial API call
const savePosition=function(position){
    myParam.where=`${position.coords.latitude},${position.coords.longitude}`
    // console.log(myParam.where);
    showMenu();
    grabEvents(myParam);
}

//Jared's Code
    let showFilter = function(event){
        event.preventDefault(); 
        console.log("yes")
        $('.filter').toggleClass('hidden')
        
    }


    $(".showFilter").on("click",showFilter);

    //bring the menu back based upon clicking now
    let showMenu = function(event){
        //prevent the default event
        // event.preventDefault();
        //unhide navbar
        $('.navbar').toggleClass('hidden');
        //hide initial view of application
        $('.firstView').hide();
    }

    //Show navigation bar and filter button when you click on the Now button in initial view.
    // $(".nowButton").on("click",showMenu);
//End Jared's code


function grabEvents(parameters) {
    // console.log(myParam);
    // This is how they want you calling the API
    EVDB.API.call("/events/search", parameters, function (res) {
        console.log(res);
        // console.log(res.events.event[0]);
        // Does something for each event in list
        for (let i = 0; i < res.events.event.length; i++) {
            // console.log(res.events.event[i].image);
            //Checks to see if the event has an image
            if (res.events.event[i].image!==null) {
                myDump.append(`<div class="event${i}"><h2>${res.events.event[i].title}</h2><p>${res.events.event[i].start_time}</p></div>`);
            }
            else{                
                myDump.append(`<div class="event${i}"><h2>${res.events.event[i].title}</h2><p>${res.events.event[i].start_time}</p></div>`);
            }
        }
    });
}

// Asks for geolocation permission, then runs the now section
$(".nowButton").on('click',getLocation);

//Pressing these changes the date parameter
$("#todayBtn").on('click',function(){
    myParam.date="Today";
    // console.log(myParam.date);
});
$("#thisweekBtn").on('click',function(){
    myParam.date="This Week";
    // console.log(myParam.date);
});
$("#nextweekBtn").on('click',function(){
    myParam.date="Next Week";
    // console.log(myParam.date);
});
$("#allBtn").on('click',function(){
    myParam.date="Future";
    // console.log(myParam.date);
});
