// set the global variable
var Data;
var reducedData= {data:[]};

<<<<<<< HEAD
$.getJSON('https://drive.google.com/open?id=0B1b042ds2aI9WWE0ajBES3B3Tms', function(data){
=======
$.getJSON('http://joannenbruno.github.io/sickbay-viz/health.json', function(data){
>>>>>>> 240ada00f5f108f879602c2e4108724cf3f08ea8
	Data = data;
	//reducedData = Data.data[1];
	//[17] for total cost column
	//40170
	//alert(Data.data[40169][17]);
	var highestCost = 0;
	for (var i=0,  tot=Data.data.length; i < tot; i++) {
		if (parseInt(Data.data[i][17]) > parseInt(highestCost) ){
			console.log(Data.data[i][17] + ">?" + highestCost);
			reducedData.data = Data.data[i];
			highestCost = reducedData.data[17];
		}
	}
	$('#content').html(JSON.stringify(reducedData));
});

