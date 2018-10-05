const searchLocation=$("#searchArea");
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
    within: "25",
    include:'categories,subcategories,price,popularity,links',
    mature:"all"
};

// XML Converstion Code Snippets
// Changes XML to JSON https://gist.github.com/chinchang/8106a82c56ad007e27b1
// Modified version from here: http://davidwalsh.name/convert-xml-json
function xmlToJson(xml) {

	// Create the return object
	var obj = {};

	if (xml.nodeType == 1) { // element
		// do attributes
		if (xml.attributes.length > 0) {
		obj["@attributes"] = {};
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
			}
		}
	} else if (xml.nodeType == 3) { // text
		obj = xml.nodeValue;
	}

	// do children
	// If just one text node inside
	if (xml.hasChildNodes() && xml.childNodes.length === 1 && xml.childNodes[0].nodeType === 3) {
		obj = xml.childNodes[0].nodeValue;
	}
	else if (xml.hasChildNodes()) {
		for(var i = 0; i < xml.childNodes.length; i++) {
			var item = xml.childNodes.item(i);
			var nodeName = item.nodeName;
			if (typeof(obj[nodeName]) == "undefined") {
				obj[nodeName] = xmlToJson(item);
			} else {
				if (typeof(obj[nodeName].push) == "undefined") {
					var old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(xmlToJson(item));
			}
		}
	}
	return obj;
}


// RESUME CODE

// Gets categories in an array
let myCats=[];
const getCategories=function(){
    const queryUrl=`https://api.eventful.com/rest/categories/list?app_key=${myParam.app_key}`
    $.ajax({
        url:queryUrl,
        method:"GET",
        type:"JSONP"
    }).then(function(res){
        res=xmlToJson(res);
        console.log(res);
        for(let i=0;i<res.categories.category.length;i++){
            // console.log(`${i}: ${res.categories.category[i].id}`);
            let myObj={id:res.categories.category[i].id,name:res.categories.category[i].name}
            myCats.push(myObj);
        }
        console.log(myCats);
    })

}

// Update parameters based on user input
const updateParam=function(){
    if(searchLocation.val()){
        // console.log("valid");
        document.getElementById("searchArea").style.backgroundColor="white";
        document.getElementById("searchArea").removeAttribute("placeholder");
        myParam.where=searchLocation.val().trim();
        // console.log(myParam.where);
        myParam.within=$("#distanceSlider").val();
        // console.log(myParam.within);
        showMenu();
        $("#exampleModal").modal("hide");
        myDump.empty();
        grabEvents(myParam);
        searchLocation.val("");

    }else{
        // console.log("invalid");
        document.getElementById("searchArea").style.backgroundColor="yellow";
        document.getElementById("searchArea").setAttribute("placeholder","Enter a city or zipcode.");
    }
}

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
//bring the menu back based upon clicking now
let showMenu = function (event) {
    //prevent the default event
    // event.preventDefault();
    //unhide navbar
    $('.navbar').removeClass('hidden');
    $('.loadMore').removeClass('hidden');
    //hide initial view of application
    $('.firstView').hide();
}

//Show navigation bar and filter button when you click on the Now button in initial view.
// $(".nowButton").on("click",showMenu);
//Show navigation bar and filter button when you click on the Now button in initial view.

var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value;

slider.oninput = function () {
    output.innerHTML = this.value;
}
//End Jared's code


function grabEvents(parameters) {
    console.log(myParam);
    // This is how they want you calling the API
    EVDB.API.call("/events/search", parameters, function (res) {
        console.log(res);
        // console.log(res.events.event[0]);
        // Does something for each event in list
        for (let i = 0; i < res.events.event.length; i++) {
            // console.log(res.events.event[i].image);
            //Checks to see if the event has an image
            if (res.events.event[i].image!==null) {
                myDump.append(`<div class="accordion" id="accordionEvent">
                <div class="card">
                  <div class="card-header" id="headingOne">
                    <h2>
                      <button class="btn eventBtn" type="button" data-toggle="collapse" data-target=".event${i}" >
                        ${res.events.event[i].title}<p>${res.events.event[i].start_time}</p>
                      </button>
                    </h2>
                  </div>
              
                  <div class="collapse hide event${i}"  data-parent="#accordionEvent">
                    <div class="card-body">
                    <img src = ${res.events.event[i].image.thumb.url}>${res.events.event[i].description}
                    </div>
                  </div>
                </div>
                </div>
              </div>`)
    
            }
            else{                
                myDump.append(`<div class="accordion" id="accordionEvent">
                <div class="card">
                  <div class="card-header" id="headingOne">
                    <h2>
                      <button class="btn eventBtn" type="button" data-toggle="collapse" data-target=".event${i}" >
                        ${res.events.event[i].title}<p>${res.events.event[i].start_time}</p>
                      </button>
                    </h2>
                  </div>
              
                  <div class="collapse hide event${i}"  data-parent="#accordionEvent">
                    <div class="card-body">
                    ${res.events.event[i].description}
                    </div>
                  </div>
                </div>
                </div>
              </div>`);
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
$("#findEventBtn").on('click',updateParam);

// Runs automatically to gather available categories
getCategories();
