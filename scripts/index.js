//dataset
var outputData;

// closure function to obtain JSON data
(function(){
  // get the output.json file
  d3.json("data/output.json", function(error, dataSet){
    if(error) return console.warn(error);
    outputData = dataSet;
    console.log(outputData);
	$( document ).ready(function() {
		drawGraph();
		populateServiceDropdown();
	});
  });
})();

function populateServiceDropdown(){
	//init bubble/map state
	/*var Bubble = document.getElementById("bubbleMap")
	Bubble.style.visibility = "hidden";
	Bubble.style.zIndex = "0";
	var Map = document.getElementById("USMap")
	Map.style.visibility = "visible";
	Map.style.zIndex = "1";*/
	
	//service selector
	var service = '';
	//var dataset = getData();
	//service = '<option value="" disabled selected>Select a service</option>'
	for(var i=0; i<outputData.serviceTypes.length; i++){
		service+='<option value="'+i+'">'+outputData.serviceTypes[i]+'</option>';
	}
	$("#serviceSelect").html(service);
	$("#serviceSelect").change(function () {
		  changeScatterData($( "#stateSelect option:selected" ).val(),$( "#serviceSelect option:selected" ).val());
	})
	//state
	
}

$(document).ready(function($){
	//state selector
	var stateList = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];
	var states = '';
	for(var i=0; i<stateList.length; i++){
		states+='<option value="'+i+'">'+stateList[i]+'</option>';
	}
	$("#stateSelect").html(states);
	
	$("#stateSelect").change(function () {
		changeScatterData($( "#stateSelect option:selected" ).val(),$( "#serviceSelect option:selected" ).val());
	})
});

//function for hiding and showing map/bubblegraph
/*
function show(map){
	if(map == 'bubble'){
		var Bubble = document.getElementById("bubbleMap")
		Bubble.style.visibility = "visible";
		Bubble.style.zIndex = "1";
		var Map = document.getElementById("USMap")
		Map.style.visibility = "hidden";
		Map.style.zIndex = "0";
	}
	if(map == 'map'){
		var Bubble = document.getElementById("bubbleMap")
		Bubble.style.visibility = "hidden";
		Bubble.style.zIndex = "0";
		var Map = document.getElementById("USMap")
		Map.style.visibility = "visible";
		Map.style.zIndex = "1";
	}
}*/