window.onload = function(){
	var Bubble = document.getElementById("bubbleMap")
	Bubble.style.visibility = "hidden";
	Bubble.style.zIndex = "0";
	var Map = document.getElementById("USMap")
	Map.style.visibility = "visible";
	Map.style.zIndex = "1";
	
	//service selector
	
	var service;
	var dataset = getData();
	service = '<option value="" disabled selected>Select a service</option>'
	for(var i=0; i<dataset.serviceTypes.length; i++){
		service+='<option value="'+i+'">'+dataset.serviceTypes[i]+'</option>'
	}
	$("#serviceSelect").html(service);
	
	$("#serviceSelect").change(function () {
		$( "#serviceSelect option:selected" ).each(function() {
		  changeScatterData(0,$( this ).val());
		});
	}).change();
}



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
}