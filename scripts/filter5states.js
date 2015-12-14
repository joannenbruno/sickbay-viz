// set the global variable
var Data;
var states = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];
var reducedData= {serviceTypes:[], nodeDescription : '', states:[]};

Array.prototype.subarray=function(start,end){
     if(!end){ end=-1;} 
    return this.slice(start, this.length+1-(end*-1));
}

//Strips drg down to without the number prefixes
//and without the w/o ... suffixes or w suffixes
function stripDRG(inputStr){
	var prefixIndex = inputStr.indexOf(' - ')
	prefixIndex+=3;
	var suffixIndex = inputStr.indexOf(' W/O');
	var newStr;
	
	if(suffixIndex != -1)
		newStr = inputStr.substring(prefixIndex,suffixIndex);
	else
		newStr = inputStr.substring(prefixIndex);
	
	while(newStr.indexOf(' W ') != -1){
		suffixIndex = newStr.indexOf(' W ');
		newStr = newStr.substring(0,suffixIndex);
	}
	
	return newStr;
}

function download(formatted) {
	$.getJSON('http://abbottmb12.github.io/health.json', function(data){
		Data = data;

		//making the node descriptions
		reducedData.nodeDescription = {drgDefinition:'Code and description identifying the DRG. DRGs are a classification system that groups similar clinical conditions (diagnoses) and the procedures furnished by the hospital during the stay.',
		providerID:'Provider Identifier billing for inpatient hospital services.',
		providerName:'Name of the Provider',
		providerAddress:'Address of the Provider',
		providerCity:'City of the Provider',
		providerState:'State of the Provider',
		providerZip:'Zip Code of the Provider',
		totalDischarges:'The number of discharges billed by the provider for inpatient hospital services.',
		totalCoveredPayments:'The providers average charge for services covered by Medicare for all discharges in the DRG. These will vary from hospital to hospital because of differences in hospital charge structures.',
		totalPayments:'The average of Medicare payments to the provider for the DRG including the DRG amount, teaching,  disproportionate share, capital, and outlier payments for all cases. Also included are co-payment and deductible amounts that the patient is responsible for',
		totalMedicarePayments:'The total amount that can be payed by Medicare'}
		
		//making a list of each unique drg without the prefixes and suffixes
		for (var i=0,  tot=Data.data.length; i < tot; i++) {
			var stripped = stripDRG(Data.data[i][8]);
			//checking if it already in the list
			if(reducedData.serviceTypes.indexOf(stripped) == -1)
				reducedData.serviceTypes.push(stripped);
		}
		reducedData.serviceTypes.sort();
		
		//change value to change how many states get filtered
		var numberOfStates = 5;
		
		//filtering each service into individual states and creating their drg arrays
		var drglength = reducedData.serviceTypes.length; //define lengths before for loops to reduce run time so it doesn't have to recalculate each time
		for (var k=0; k < numberOfStates; k++) {
			//constructing the state drg array model
			reducedData.states[k] = {stateName : states[k], avgTotalCost : '', avgMedicareCost : '', avgMaxMedicareCost : '', drg:[]}
			for(var i = 0; i < reducedData.serviceTypes.length; i++){
				reducedData.states[k].drg[i] = {type : '', avgTotalCost : '', avgMedicareCost : '', avgMaxMedicareCost : '', data:[]}
				reducedData.states[k].drg[i].type = reducedData.serviceTypes[i];
			}
			var total_cost=0;
			var total_medicarepayment=0;
			var total_maxmedicarepayment=0;
			var total_elements=0;
			for (var i=0,  tot=Data.data.length; i < tot; i++) {
				//sort into it's state array
				if(Data.data[i][13] == states[k]){
					//sort into it's drg array
					for (var j=0; j < drglength; j++){
						//use strip to see what array it belongs in
						if(stripDRG(Data.data[i][8]) == reducedData.states[k].drg[j].type){
							//push and increment the costs amounts
							reducedData.states[k].drg[j].data.push(Data.data[i].subarray(8));//filtered out 8 elements
							total_cost+=parseInt(Data.data[i][18]);
							total_medicarepayment+=parseInt(Data.data[i][19]);
							total_maxmedicarepayment+=parseInt(Data.data[i][17]);
							total_elements++;
						}
					}
				}
				
			}
			//compute and store avgs
			reducedData.states[k].avgTotalCost = total_cost/total_elements;
			reducedData.states[k].avgMedicareCost = total_medicarepayment/total_elements;
			reducedData.states[k].avgMaxMedicareCost = total_maxmedicarepayment/total_elements;
			console.log(states[k] + " total members: " + total_elements);
		}
		
		//making averages for each individual drg in each state
		for (var k=0; k < numberOfStates; k++) {
			for (var i=0; i < drglength; i++) {
				var total_cost=0;
				var total_medicarepayment=0;
				var total_maxmedicarepayment=0;
				var total_elements=0;
				var drgdatalength = reducedData.states[k].drg[i].data.length; //once again, define before a loop to reduce time of computation
				for (var j=0; j < drgdatalength; j++){
					//using 10 and 11 instead of 18 and 19 because I filtered some data out.
					total_cost+=parseInt(reducedData.states[k].drg[i].data[j][10]);
					total_medicarepayment+=parseInt(reducedData.states[k].drg[i].data[j][11]);
					total_maxmedicarepayment+=parseInt(reducedData.states[k].drg[i].data[j][9]);
					total_elements++;
				}
				//compute and store avgs
				reducedData.states[k].drg[i].avgTotalCost = total_cost/total_elements;
				reducedData.states[k].drg[i].avgMedicareCost = total_medicarepayment/total_elements;
				reducedData.states[k].drg[i].avgMaxMedicareCost = total_maxmedicarepayment/total_elements;
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