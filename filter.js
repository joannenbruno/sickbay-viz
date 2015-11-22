// set the global variable
var Data;
var reducedData= {highestCosting:[]};

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
			reducedData.highestCosting[0] = Data.data[i];
			highestCost = reducedData.highestCosting[0][17];
		}
	}
	$('h3').hide();
	$('textarea').show();
	$('textarea').html(JSON.stringify(reducedData, null, 4));
});
