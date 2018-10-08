const searchLocation=$("#searchArea");
const catDump=$("#catDump");
const myDump=$("#eventDump");
const myCats=[];
const catsIWant=[];
let myPosition,skipZip;

//default parameters
let myParam = {
    app_key: "LT5Q2szWsMzXGZpj",
    //   q: "music",
    // where: "32.929164799999995,-97.01022979999999",
    where:``,
    date: "Today",
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

// Grabs and displays events
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
                myDump.append(`<div class="accordion" id="accordionEvent">
                <div class="card">
                  <div class="card-header" id="headingOne">
                    <h2>
                      <button class="btn eventBtn" type="button" data-toggle="collapse" data-target=".event${i} " >
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
            myParam.where = searchLocation.val().trim();
            // console.log(myParam.where);
            myParam.within = $("#distanceSlider").val();
            // console.log(myParam.within);
            let newCats = "";
            for (let i = 0; i < catsIWant.length; i++) {
                newCats += catsIWant[i] + ",";
            }
            myParam.category = newCats;
            console.log(myParam.category);

            // Now Do Things
            showMenu();
            $("#exampleModal").modal("hide");
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
        myParam.within = $("#distanceSlider").val();
        // console.log(myParam.within);
        let newCats = "";
        for (let i = 0; i < catsIWant.length; i++) {
            newCats += catsIWant[i] + ",";
        }
        myParam.category = newCats;
        console.log(myParam.category);

        // Now Do Things
        showMenu();
        $("#exampleModal").modal("hide");
        myDump.empty();
        grabEvents(myParam);
        searchLocation.val("");}
}

// Asks user for location access
const getLocation=function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(savePosition);
        return true;
    } 
    // else {
    //     x.innerHTML = "Geolocation is not supported by this browser.";
    // }
}
// Updates user location data, calls the showMenu and makes initial API call
const savePosition=function(position){
    myParam.where=`${position.coords.latitude},${position.coords.longitude}`
    // console.log(myParam.where);
}

function now(){
    let location=getLocation();
    if(location){
    showMenu();
    grabEvents(myParam);
    }
    
}
function loadMore(){
    myParam.page_number+=1;
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

let slider = document.getElementById("distanceSlider");
let output = document.getElementById("value");
output.innerHTML = slider.value;

slider.oninput = function () {
    output.innerHTML = this.value;
}
//End Jared's code


// Asks for geolocation permission, then runs the now section
$(".nowButton").on('click',now);

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
        getLocation();
    }
    else{
        skipZip=false;
        // console.log(skipZip);
    }
});
$("#loadMoreBtn").click(loadMore);

// Runs automatically to gather available categories
getCategories();
