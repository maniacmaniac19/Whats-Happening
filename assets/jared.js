let showFilter = function(event){
    event.preventDefault(); 
    console.log("yes")
    $('.filter').toggleClass('hidden')
    
}


$(".showFilter").on("click",showFilter);

//bring the menu back based upon clicking now
let showMenu = function(event){
    //prevent the default event
    event.preventDefault();
    //unhide navbar
    $('.navbar').toggleClass('hidden');
    //hide initial view of application
    $('.firstView').hide();
}

//Show navigation bar and filter button when you click on the Now button in initial view.
$(".nowButton").on("click",showMenu)

// // $(function() {
// //    $( "#slider-range-s1" ).slider({
// //        range: true,
// //        min: 0,
// //        max: 500,
// //        value: [ 0, 500 ]
// //    });
// });