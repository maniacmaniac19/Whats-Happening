const searchLocation=$("#searchArea");
const catDump=$("#catDump");
const myDump=$("#eventDump");
const myCats=[];
const catsIWant=[];
let myPosition,skipZip,myLat,myLong;

//default parameters
let myParam = {
    app_key: "LT5Q2szWsMzXGZpj",
    //   q: "music",
    // where: "32.929164799999995,-97.01022979999999",
    location:``,
    date: "Today",
    page_number: 1,
    page_size: 20,
    sort_order: "date",
    within: "25",
    units:"mi",
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

function eventExtras(eventData){
    // This returns the string to display additional data for the accordion events
    // Description, url, categories, image, venue address, Uber link 
    let retStr=`<div class="container"><div class='row'>`;
    let theseCats="";

    // If things exist, then ...
    retStr+=`<div class="col-8">`
    if(eventData.venue_address){
        retStr+=`${eventData.venue_address}`
    }
    retStr+=`</div><div class="col-4">`
    if(eventData.image){
        retStr+=`<img src=${eventData.image.thumb.url}>`
    }
    retStr+=`</div></div><div class="row"><div class="col-12">`
    if(eventData.description){
        retStr+=`${eventData.description}`
    }else{
        retStr+="No Description Provided."
    }
    retStr+=`</div></div><div class="row"><div class="col-6">`
    if(eventData.categories){
        for(let i=0;i<eventData.categories.category.length;i++){
            if(eventData.categories.category.length===1){
                theseCats=`${eventData.categories.category[0].name}`;
            }else{
                theseCats+=`${eventData.categories.category[i].name}, `
            }
        }
        retStr+=theseCats;
    }
    retStr+=`</div><div class="col-6">`
    if(eventData.latitude){
        retStr+=`<a href="https://m.uber.com/ul/?action=setPickup&setPickup&pickup[latitude]=${myLat}8&pickup[longitude]=${myLong}&dropoff[latitude]=${eventData.latitude}&dropoff[longitude]=${eventData.longitude}">Get a Ride with Uber</a>`

    }
    retStr+=`</div></div></div>`
    // console.log(retStr);
    return retStr;
}

// Grabs and displays events
function grabEvents(parameters) {
    // console.log(myParam);
    // This is how they want you calling the API
    EVDB.API.call("/events/search", parameters, function (res) {
        console.log(res);
        // console.log(res.events.event[0]);
        // Does something for each event in list
        let accordion = $(`<div class="accordion" id="accordionEvent">`)
        for (let i = 0; i < res.events.event.length; i++) {
            // console.log(res.events.event[i].image);
            //Checks to see if the event has an image
            let extras=eventExtras(res.events.event[i]);
            if (res.events.event[i].image!==null) {
                accordion.append(`
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
                    ${extras}
                    </div>
                  </div>
                </div>
                </div>
              </div>`)
    
            }
            else{                
                accordion.append(`<div class="accordion" id="accordionEvent">
                <div class="card">
                  <div class="card-header" id="headingOne">
                    <row>
                      <button class="btn eventBtn col-xs-12" type="button" data-toggle="collapse" data-target=".event${i}" >
                        ${res.events.event[i].title}<p>${res.events.event[i].start_time}</p>
                      </button>
                    </row>
                  </div>
              
                  <div class="collapse hide event${i}"  data-parent="#accordionEvent">
                    <div class="card-body">
                    ${extras}
                    </div>
                  </div>
                </div>
                </div>
              </div>`);
            }
        }
        myDump.append(accordion);
        // console.log(res.total_items,res.page_size);
        res.total_items=parseInt(res.total_items);
        res.page_size=parseInt(res.page_size);
        if(res.total_items>res.page_size){
            // console.log("There's more");
            $('#loadMoreBtn').removeClass('hidden');
        }else{
            $("#loadMoreBtn").addClass('hidden');
            // console.log("Thats all.");
        }
    });
}

// Gets categories in an array
const getCategories=function(){
    const queryUrl=`https://api.eventful.com/rest/categories/list?app_key=${myParam.app_key}`
    $.ajax({
        url:queryUrl,
        method:"GET",
        type:"JSONP"
    }).then(function(res){
        res=xmlToJson(res);
        // console.log(res);
        for(let i=0;i<res.categories.category.length;i++){
            // console.log(`${i}: ${res.categories.category[i].id}`);
            let myObj={id:res.categories.category[i].id,name:res.categories.category[i].name}
            myCats.push(myObj);
        }
        // console.log(myCats);
        showCats(myCats);
    })

}

// Dynamically generates category list in window
function showCats(categoryList){
    // console.log(categoryList);
    for(let i=0;i<categoryList.length;i++){
        // console.log(categoryList[i].name);
        catDump.append(`<input type="checkbox" class="catCheck" id="${categoryList[i].id}">${categoryList[i].name}<br>`);
    }
    // Adds event handler to check which cat is poked
    catDump.on('change','.catCheck',function(){
        let id = $(this).attr("id");
        // console.log(id);
        if(this.checked){
            // console.log("Check happen");
            catsIWant.push(id);
            // console.log(catsIWant);
        }
        else{
            // console.log('Uncheck');
            let index=catsIWant.indexOf(id);
            if(index > -1){
                catsIWant.splice(index,1);
            }
            // console.log(catsIWant);
        }
    })
}

// Update parameters based on user input
const updateParam = function () {
    if (!skipZip) {
        if (searchLocation.val()) {
            // console.log("valid");
            document.getElementById("searchArea").style.backgroundColor = "white";
            document.getElementById("searchArea").removeAttribute("placeholder");

            // Grab things
            myParam.location = searchLocation.val().trim();
            // console.log(myParam.where);
            myParam.within = `${$("#distanceSlider").val()}mi`;
            // console.log(myParam.within);
            let newCats = "";
            for (let i = 0; i < catsIWant.length; i++) {
                newCats += catsIWant[i] + ",";
            }
            myParam.category = newCats;
            console.log(myParam.category);

            // Now Do Things
            showMenu();
            $("#formModal").modal("hide");
            myDump.empty();
            grabEvents(myParam);
            searchLocation.val("");

        } else {
            // console.log("invalid");
            document.getElementById("searchArea").style.backgroundColor = "yellow";
            document.getElementById("searchArea").setAttribute("placeholder", "Enter a city or zipcode.");
        }
    }
    else{
        // Grab things
        myParam.within = `${$("#distanceSlider").val()}mi`;
        // console.log(myParam.within);
        let newCats = "";
        for (let i = 0; i < catsIWant.length; i++) {
            newCats += catsIWant[i] + ",";
        }
        myParam.category = newCats;
        // console.log(myParam.category);

        // Now Do Things
        showMenu();
        $("#formModal").modal("hide");
        myDump.empty();
        grabEvents(myParam);
        searchLocation.val("");}
}

// Asks user for location access
const getLocation=function(saveFunction) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(saveFunction);
        return true;
    } 
    // else {
    //     x.innerHTML = "Geolocation is not supported by this browser.";
    // }
}
// Updates user location data, calls the showMenu and makes initial API call
const savePosition=function(position){
    myLat=position.coords.latitude;
    myLong=position.coords.longitude;
    myParam.location=`${myLat},${myLong}`;
    // console.log(myParam.location);
}
const savePositionNow=function(position){
    myLat=position.coords.latitude;
    myLong=position.coords.longitude;
    myParam.location=`${myLat},${myLong}`;
    // console.log(myParam.location);
    showMenu();
    grabEvents(myParam);
}

function loadMore(){
    myParam.page_number+=1;
    grabEvents(myParam);
}

// function uberLink(myLat,myLong,destLat,destLong){
// let myURL=`https://m.uber.com/ul/?action=setPickup&setPickup&pickup[latitude]=${myLat}8&pickup[longitude]=${myLong}&dropoff[latitude]=${destLat}&dropoff[longitude]=${destLong}`

// }
//Jared's Code
//bring the menu back based upon clicking now
let showMenu = function (event) {
    //prevent the default event
    // event.preventDefault();
    //unhide navbar
    $('.navbar').removeClass('hidden');
    // Removed to allow unhide based on returned values
    // $('.loadMore').removeClass('hidden');
    //hide initial view of application
    $('.firstView').hide();
}

//Show navigation bar and filter button when you click on the Now button in initial view.
// $(".nowButton").on("click",showMenu);

let slider = document.getElementById("distanceSlider");
let output = document.getElementById("value");
output.innerHTML = slider.value;

slider.oninput = function () {
    output.innerHTML = this.value;
}
//End Jared's code


// Asks for geolocation permission, then runs the now section
$(".nowButton").on('click',function(){getLocation(savePositionNow)});

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
// Updates parameters based on user input
$("#findEventBtn").on('click',updateParam);

// When user clicks use my location it runs location grabbing function
$("#useMyLoc").change(function(){
    if(this.checked){
        skipZip=true;
        // console.log(skipZip);
        getLocation(savePosition);
    }
    else{
        skipZip=false;
        // console.log(skipZip);
    }
});

$("#loadMoreBtn").click(loadMore);

// Runs automatically to gather available categories
getCategories();
