let myLat,myLong;

const getLocation=function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(savePosition);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}
const savePosition=function(position){
    myLat=position.coords.latitude;
    myLong=position.coords.longitude;
    console.log(myLat,myLong);
    // grabEvents();
    showMenu();
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

$(".nowButton").on('click',getLocation);