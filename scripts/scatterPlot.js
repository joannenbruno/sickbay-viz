// global data variable to pass JSON

//global chart stuff for update functions
var chart;
var csvg;
var cHeight = 600;
var cWidth = 800;

// parses and formats the data for the nvd3.js graph
function myData(state, drg) {
    // final data array object for graph, array of shapes for graph
    var data = [],
      shapes = ['circle', 'cross', 'triangle-up', 'diamond', 'square'],
      random = d3.random.normal();

	console.log(outputData);
	
	/*for (i = 0; i < 5; i++) {
		data.push({
			key: 'Group ' + i,
			values: []
		});

		for (j = 0; j < 5; j++) {
			data[i].values.push({
				x: random(),
				y: random(),
				size: Math.round(Math.random() * 100) / 100,
				shape: "circle"
			});
		}
	}*/

    for (var i = 0; i < 3; i++) {
		var priceElement;
		var elementKey;
		if(i==0){
			elementKey = "Total Cost";
			data.push({
				// set key as service type for visual output
				//key: 'Group: ' + outputData.serviceTypes[i].toLowerCase(),
				//key: outputData.states[0].drg[0].type,
				key: elementKey,
				values: []
			});
			priceElement = 10;
		}
		else if(i==1){
			elementKey = "Medicare Coverage";
			data.push({
				key: elementKey,
				values: []
			});
			priceElement = 11;
		}
		else{
			elementKey = "Max Medicare Coverage";
			data.push({
				key: elementKey,
				disabled: true,
				values: []
			});
			priceElement = 9;
		}
	  
	 /* data[i].values.push({
          x: i
        , y: parseInt(outputData.states[0].drg[0].data[i][10])
		, size: parseInt(outputData.states[0].drg[0].data[i][10])
      });*/
	  
	  for (j = 0; j < outputData.states[state].drg[drg].data.length; j++) {
        // push into the axis' the pertinent data
        data[i].values.push({
          x: j
        , y: parseInt(outputData.states[state].drg[drg].data[j][priceElement])
        // configure the shape of each scatter point.
        //, shape: (Math.random() > 0.95) ? shapes[j % 5] : "circle"
		, size: parseInt(outputData.states[state].drg[drg].data[j][priceElement])
		, nodeData: outputData.states[state].drg[drg].data[j]
		, parentKey: elementKey
        });
      }
	}

    console.log("DEBUG: Returned data object from myData method");
    return data;
}

//capitalizes first letter of each word
function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

// disgusting hack to allow json to load before graph is rendered
function drawGraph(){
	nv.addGraph(function() {
		 chart = nv.models.scatterChart()
			.showDistX(true)
			.showDistY(true)
			.useVoronoi(true)
			//.color(d3.scale.category10().range())
			.duration(300)
			.showLegend(true)
			;
		
		chart.legend.margin({"bottom":10, "right":-20});
		chart.legend.maxKeyLength(30);
		//chart.legend.expanded = true;
		//chart.legend.rightAlign = true;
		/*chart.color(function (d, i) {
			var colors = d3.scale.category20().range().slice(10);
			console.log(colors);
			console.log(i);
			return colors[i % colors.length-1];
		})*/
		
		chart.color(function (d, i) {
			//var colors = d3.scale.category10().range();
			var colors = ["#D32F2F", "#0097A7", "#00E676"];//rgb
			//var colors = ["#D32F2F", "#0097A7", "#651FFF"];//rgp
			//console.log(colors);
			return colors[i];
			//return "#00E676";//green
			//return "#651FFF";//purple
			//return "#0097A7";//blue
			//return "#D32F2F";//red
			//return ["#D32F2F", "#0097A7"];//red blue
		});


		// configure how the tooltip looks.
		chart.tooltip.contentGenerator(function (key) {
			//console.log(JSON.stringify(key));
			var tooltipHTML;
			tooltipHTML = '<div>' + key.point.nodeData[0].substring(6) + '</div>';
			//tooltipHTML += '<div>' + key.point.nodeData[2] + '</div>';
			//tooltipHTML += '<div>' + key.point.nodeData[4] + ', ' + key.point.nodeData[5] + '</div>';
			var name = toTitleCase(key.point.nodeData[2].toLowerCase());
			var city = toTitleCase(key.point.nodeData[4].toLowerCase());
			tooltipHTML += '<div>' + name + ' - ' + city + ', ' + key.point.nodeData[5] + '</div>';
			tooltipHTML += '<div>' + key.point.parentKey + ': $' + key.point.size + '</div>';
			/*tooltipHTML += '<div>Total service cost:       $' + key.point.nodeData[10] + '</div>';
			tooltipHTML += '<div>Medicare will cover:      $' + key.point.nodeData[11] + '</div>';
			tooltipHTML += '<div>Medicare can cover up to: $' + key.point.nodeData[9] + '</div>';*/

			return tooltipHTML;
		  //return '<h3>' + key + '</h3>';
		});
		
		// axis settings
		chart.xAxis.tickFormat(d3.format('.02f'));
		chart.yAxis.tickFormat(d3.format('.02f'));
		chart.yAxis.tickFormat(function(d) { return "$" + d; });
		
		chart.xAxis.axisLabel("Hospitals");
		chart.yAxis.axisLabel("Total Cost");
		chart.yAxis.axisLabelDistance(10);
		
		csvg = d3.select('#chart svg')
		//var format = d3.format(",.2f");
		//d3.selectAll(".tick").text(function(d) { return "$" + format(d); });
		
		//svg.attr("width", width)
		var dataset = myData(0,0);
		csvg.attr("height", cHeight)
			.datum(dataset)
			.call(chart);
		
		csvg.append("g")
      .attr("class", "nv-axislabel")
	  .attr("id", "chart-title")
      //.attr("transform", "translate(" + (width/2 - 71) + "," + 15 + ")")
      //.attr("transform", "translate("+ 75 + "," + 20 + ")")
      .attr("transform", "translate("+ 75 + "," + 20 + ")")
    .append("text")
	  .style("font-weight", "bold")
	  .style("text-align", "center")
	  .style("width", "100%")
      //.text(outputData.serviceTypes[0]);
      .text("Service Cost Graph");
		
	
		nv.utils.windowResize(chart.update);
		
		console.log("Generated chart");
		return chart;
	});
}

function changeScatterData(state,drg){
	d3.selectAll('.nv-distx').remove();
	d3.selectAll('.nv-disty').remove();
	csvg.datum(myData(state,drg)).transition().duration(500).call(chart);
	console.log(outputData.serviceTypes[drg]);
	d3.select('#chart-title').remove();
	csvg.append("g")
      .attr("class", "nv-axislabel")
	  .attr("id", "chart-title")
      //.attr("transform", "translate(" + (width/2 - 71) + "," + 15 + ")")
      .attr("transform", "translate("+ 75 + "," + 20 + ")")
    .append("text")
	  .style("font-weight", "bold")
	  .style("text-align", "center")
	  .style("width", "100%")
      //.text(outputData.serviceTypes[drg]);
      .text("Service Cost Graph");
    nv.utils.windowResize(chart.update);
}