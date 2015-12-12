window.onload = function(){
	var Bubble = document.getElementById("bubbleMap")
	Bubble.style.visibility = "hidden";
	Bubble.style.zIndex = "0";
	var Map = document.getElementById("USMap")
	Map.style.visibility = "visible";
	Map.style.zIndex = "1";

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