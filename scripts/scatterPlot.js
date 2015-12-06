// global data variable to pass JSON
var outputData;

// closure function to obtain JSON data
(function(){
  // get the output.json file
  d3.json("data/output.json", function(error, dataSet){
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
    for (i = 0; i < outputData.serviceTypes.length; i++) {

      data.push({
        /*
        // set key as service type for visual output
        key: 'Group: ' + outputData.serviceTypes[i].toLowerCase(),
        */
        // TODO: set values as what we want in the tooltip
        values: []
      });

      /*for (j = 0; j < outputData.states.length; j++) {
        // push into the axis' the pertinent data
        data[i].values.push({
          x: [j] //outputData.serviceTypes[i]
        , y: outputData.states[j].drg[i].avgTotalCost
        // configure the shape of each scatter point.
        // , shape: (Math.random() > 0.95) ? shapes[j % 5] : "circle"
        });
      }*/
	  for (j = 0; j < outputData.states[0].drg[0].data.length; j++) {
        // push into the axis' the pertinent data
        data[i].values.push({
          x: j
        , y: parseInt(outputData.states[0].drg[0].data[j][10])
        // configure the shape of each scatter point.
        // , shape: (Math.random() > 0.95) ? shapes[j % 5] : "circle"
        });
      }
    }

    console.log("DEBUG: Returned data object from myData method");
    return data;
}

// disgusting hack to allow json to load before graph is rendered
function drawGraph(){
	nv.addGraph(function() {
		var chart = nv.models.scatterChart()
					  // showDist, when true, will display those
					  // little distribution lines on the axis.
					  .showDistX(true)
					  .showDistY(true)
					  .color(d3.scale.category10().range());

		// configure how the tooltip looks.
		chart.tooltip.contentGenerator(function (key) {
		  return '<p><strong>' + key + '</strong></p>';
		});

		// axis settings
		chart.xAxis.tickFormat(d3.format('.02f'));
		chart.yAxis.tickFormat(d3.format('.02f'));

		d3.select('#chart svg')
			.datum(myData(40))
			.transition().duration(500)
			.call(chart);

		nv.utils.windowResize(chart.update);


		console.log("Generated chart");
		return chart;
	});
}
