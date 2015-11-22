// set the global variable
var Data;
var states = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];
var reducedData= {highestCosting:[], lowestCosting:[], states:[]};


function download(formatted) {
	$.getJSON('http://abbottmb12.github.io/health.json', function(data){
		Data = data;

		//initial 5;
		reducedData.highestCosting[0] = Data.data[0];
		for (var i=1; i < 5; i++) {
			for (var j=0; j < reducedData.highestCosting.length && j < 5; j++) {
				if (parseInt(Data.data[i][17]) > parseInt(reducedData.highestCosting[j][17]) ){
					reducedData.highestCosting.splice(j,0,reducedData.highestCosting[j]);
					reducedData.highestCosting[j] = Data.data[i];
					j = 5;
				}
				else if (j == reducedData.highestCosting.length - 1){
					reducedData.highestCosting.push(Data.data[i]);
					j = 5;
				}
			}
		}
		reducedData.lowestCosting[4] = reducedData.highestCosting[0];
		reducedData.lowestCosting[3] = reducedData.highestCosting[1];
		reducedData.lowestCosting[2] = reducedData.highestCosting[2];
		reducedData.lowestCosting[1] = reducedData.highestCosting[3];
		reducedData.lowestCosting[0] = reducedData.highestCosting[4];
		//full list highest and lowest costing
		for (var i=5,  tot=Data.data.length; i < tot; i++) {
			for (var j=0; j < 5; j++) {
				if (parseInt(Data.data[i][17]) > parseInt(reducedData.highestCosting[j][17]) ){
					reducedData.highestCosting.splice(j,0,reducedData.highestCosting[j]);
					reducedData.highestCosting[j] = Data.data[i];
					reducedData.highestCosting.splice(5,1);
					j=5;
				}
			}
			for (var j=0; j < 5; j++) {
				if (parseInt(Data.data[i][17]) < parseInt(reducedData.lowestCosting[j][17]) ){
					reducedData.lowestCosting.splice(j,0,reducedData.lowestCosting[j]);
					reducedData.lowestCosting[j] = Data.data[i];
					reducedData.lowestCosting.splice(5,1);
					j=5;
				}
			}
		}
		//change k<50 based on how many states you want to filter for testing;
		for (var k=0; k < 5; k++) {
			var tempHighLowData = {stateName : states[k] , highestCosting:[], lowestCosting:[], data:[]}
			reducedData.states[k] = tempHighLowData;
			
			for (var i=0,  tot=Data.data.length; i < tot; i++) {
				if(Data.data[i][13] == states[k]){
					reducedData.states[k].data.push(Data.data[i]);
				}
			}
			//state initial 5 lowest highest costing
			reducedData.states[k].highestCosting[0] = reducedData.states[k].data[0];
			for (var i=1; i < 5; i++) {
				for (var j=0; j < reducedData.states[k].highestCosting.length && j < 5; j++) {
					if (parseInt(reducedData.states[k].data[i][17]) > parseInt(reducedData.states[k].highestCosting[j][17]) ){
						reducedData.states[k].highestCosting.splice(j,0,reducedData.states[k].highestCosting[j]);
						reducedData.states[k].highestCosting[j] = reducedData.states[k].data[i];
						j = 5;
					}
					else if (j == reducedData.states[k].highestCosting.length - 1){
						reducedData.states[k].highestCosting.push(reducedData.states[k].data[i]);
						j = 5;
					}
				}
			}
			reducedData.states[k].lowestCosting[4] = reducedData.states[k].highestCosting[0];
			reducedData.states[k].lowestCosting[3] = reducedData.states[k].highestCosting[1];
			reducedData.states[k].lowestCosting[2] = reducedData.states[k].highestCosting[2];
			reducedData.states[k].lowestCosting[1] = reducedData.states[k].highestCosting[3];
			reducedData.states[k].lowestCosting[0] = reducedData.states[k].highestCosting[4];
			//state list highest and lowest costing
			for (var i=5,  tot=reducedData.states[k].data.length; i < tot; i++) {
				for (var j=0; j < 5; j++) {
					if (parseInt(reducedData.states[k].data[i][17]) > parseInt(reducedData.states[k].highestCosting[j][17]) ){
						reducedData.states[k].highestCosting.splice(j,0,reducedData.states[k].highestCosting[j]);
						reducedData.states[k].highestCosting[j] = reducedData.states[k].data[i];
						reducedData.states[k].highestCosting.splice(5,1);
						j=5;
					}
				}
				for (var j=0; j < 5; j++) {
					if (parseInt(reducedData.states[k].data[i][17]) < parseInt(reducedData.states[k].lowestCosting[j][17]) ){
						reducedData.states[k].lowestCosting.splice(j,0,reducedData.states[k].lowestCosting[j]);
						reducedData.states[k].lowestCosting[j] = reducedData.states[k].data[i];
						reducedData.states[k].lowestCosting.splice(5,1);
						j=5;
					}
				}
			}
		}
		//file download
		var blob;
		if(formatted == 'formatted'){
			var stringified = JSON.stringify(reducedData, null, 4);
			var blob = new Blob([stringified], {'type': 'application/json'});
		}
		else{
			var stringified = JSON.stringify(reducedData);
			var blob = new Blob([stringified], {'type': 'application/json'});
		}
		saveAs(blob, "output.json");
	});
}