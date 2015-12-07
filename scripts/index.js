window.onload = function(){
	document.getElementById("bubbleMap").style.visibility = "hidden";
	document.getElementById("USMap").style.visibility = "visible";
}

function show(map){
	if(map == 'bubble'){
		document.getElementById("bubbleMap").style.visibility = "visible";
		document.getElementById("USMap").style.visibility = "hidden";
	}
	if(map == 'map'){
		document.getElementById("bubbleMap").style.visibility = "hidden";
		document.getElementById("USMap").style.visibility = "visible";
	}
}