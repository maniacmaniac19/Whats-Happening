let showFilter = function(event){
    event.preventDefault(); 
    console.log("yes")
    $('.filter').toggleClass('hidden')
    
}


$(".showFilter").on("click",showFilter);