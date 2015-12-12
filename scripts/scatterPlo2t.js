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
	
	for (i = 0; i < 5; i++) {
            data.push({
                key: 'Group ' + i,
                values: []
            });
            for (j = 0; j < 5; j++) {
                data[i].values.push({
                    x: random(),
                    y: random(),
                    size: Math.round(Math.random() * 100) / 100,
                    shape: shapes[j % shapes.length]
                });
            }
        }
    //for (i = 0; i < outputData.serviceTypes.length; i++) {
    /*for (var i = 0; i < outputData.states[0].drg[0].data.length; i++) {
      
	  data.push({
        // set key as service type for visual output
        //key: 'Group: ' + outputData.serviceTypes[i].toLowerCase(),
        key: parseInt(outputData.states[0].drg[0].data[i][10]),
        // TODO: set values as what we want in the tooltip
        values: []
      });
	  
	  data[i].values.push({
          x: i
        , y: parseInt(outputData.states[0].drg[0].data[i][10])
		, size: parseInt(outputData.states[0].drg[0].data[i][10])
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
	  
	  /*
	  for (j = 0; j < outputData.states[0].drg[0].data.length; j++) {
        // push into the axis' the pertinent data
        data[i].values.push({
          x: j
        , y: parseInt(outputData.states[0].drg[0].data[j][10])
        // configure the shape of each scatter point.
        //, shape: (Math.random() > 0.95) ? shapes[j % 5] : "circle"
		, size: parseInt(outputData.states[0].drg[0].data[j][10])
        });
      }*/
	//}

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
            .color(d3.scale.category10().range())
            .duration(300)
		
		/*chart.color(function (d, i) {
			var colors = d3.scale.category10().range();
			return colors[3];
		})*/


		// configure how the tooltip looks.
		chart.tooltip.contentGenerator(function (key) {
		  //return '<p><strong>' + key + '</strong></p>';
		  return '<h3>' + key + '</h3>';
		});

		// axis settings
		chart.xAxis.tickFormat(d3.format('.02f'));
		chart.yAxis.tickFormat(d3.format('.02f'));

		var svg = d3.select('#chart')
		var height = 600;
		var width = 800;
		svg.append("svg")
			.attr("width", width)
			.attr("height", height)
			.datum(myData(40))
			.call(chart);

			
		nv.utils.windowResize(chart.update);

		console.log("Generated chart");
		return chart;
	});
}
