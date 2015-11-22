// set the global variable
var Data;
var reducedData= {data:[]};

$.getJSON('http://abbottmb12.github.io/health.json', function(data){
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

