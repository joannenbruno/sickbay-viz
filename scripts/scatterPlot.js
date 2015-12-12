// global data variable to pass JSON
var outputData;

// closure function to obtain JSON data
(function(){
  // get the output.json file
  d3.json("data/outputFiveStates.json", function(error, dataSet){
    if(error) return console.warn(error);
    outputData = dataSet;
    console.log(outputData);
	drawGraph();
  });
})();

// parses and formats the data for the nvd3.js graph
function myData(points) {
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

    //for (var i = 0; i < outputData.states[0].drg[0].data.length; i++) {
	  data.push({
        // set key as service type for visual output
        //key: 'Group: ' + outputData.serviceTypes[i].toLowerCase(),
        key: outputData.states[0].drg[0].type,
	   //key: "this",
        // TODO: set values as what we want in the tooltip
        values: []
      });
	  
	 /* data[i].values.push({
          x: i
        , y: parseInt(outputData.states[0].drg[0].data[i][10])
		, size: parseInt(outputData.states[0].drg[0].data[i][10])
      });*/
	  
	  
	  for (j = 0; j < outputData.states[0].drg[0].data.length; j++) {
        // push into the axis' the pertinent data
        data[0].values.push({
          x: j
        , y: parseInt(outputData.states[0].drg[0].data[j][10])
        // configure the shape of each scatter point.
        //, shape: (Math.random() > 0.95) ? shapes[j % 5] : "circle"
		, size: parseInt(outputData.states[0].drg[0].data[j][10])
        });
      }


    console.log("DEBUG: Returned data object from myData method");
    return data;
}

// disgusting hack to allow json to load before graph is rendered
function drawGraph(){
	nv.addGraph(function() {
		var chart = nv.models.scatterChart()
			.showDistX(true)
			.showDistY(true)
			.useVoronoi(true)
			//.color(d3.scale.category10()[3])
			.duration(300)
			.showLegend(false)
			;
		
		chart.color(function (d, i) {
			var colors = d3.scale.category10().range();
			return colors[3];
		});


		// configure how the tooltip looks.
		chart.tooltip.contentGenerator(function (key) {
			console.log(JSON.stringify(key));
		  return '<p><strong>' + JSON.stringify(key.point.size) + '</strong></p>';
		  //return '<h3>' + key + '</h3>';
		});
		
		// axis settings
		chart.xAxis.tickFormat(d3.format('.02f'));
		chart.yAxis.tickFormat(d3.format('.02f'));
		chart.yAxis.tickFormat(function(d) { return "$" + d; });
		
		chart.xAxis.axisLabel("Hospitals");
		chart.yAxis.axisLabel("Total Cost");
		chart.yAxis.axisLabelDistance(10);
		
		var svg = d3.select('#chart svg')
		//var format = d3.format(",.2f");
		//d3.selectAll(".tick").text(function(d) { return "$" + format(d); });
		
		var height = 600;
		var width = 800;
		//svg.attr("width", width)
		svg.attr("height", height)
			.datum(myData(40))
			.call(chart);

			
		svg.append("g")
      .attr("class", "nv-axislabel")
      //.attr("transform", "translate(" + (width/2 - 71) + "," + 15 + ")")
      .attr("transform", "translate("+ 75 + "," + 15 + ")")
    .append("text")
	  .style("font-weight", "bold")
	  .style("text-align", "center")
	  .style("width", "100%")
      .text("Hospital Service Cost Graph");
		
		nv.utils.windowResize(chart.update);
		
		console.log("Generated chart");
		return chart;
	});
}