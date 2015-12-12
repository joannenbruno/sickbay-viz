// create the chart
var chart;
nv.addGraph(function() {
	chart = nv.models.scatterChart()
		.showDistX(true)
		.showDistY(true)
		.useVoronoi(true)
		.color(d3.scale.category10().range())
		.duration(300)
	;
	chart.dispatch.on('renderEnd', function(){
		console.log('render complete');
	});

	chart.xAxis.tickFormat(d3.format('.02f'));
	chart.yAxis.tickFormat(d3.format('.02f'));

	d3.select('#chart svg')
		.attr("height", 500)
		.attr("width", 600)
		.datum(randomData(4,40))
		.call(chart);


	
	return chart;
});


function randomData(groups, points) { //# groups,# points per group
	// smiley and thin-x are our custom symbols!
	var data = [],
		shapes = ['circle', 'cross', 'triangle-up', 'triangle-down', 'diamond', 'square'],
		random = d3.random.normal();

	for (i = 0; i < groups; i++) {
		data.push({
			key: 'Group ' + i,
			values: []
		});

		for (j = 0; j < points; j++) {
			data[i].values.push({
				x: random(),
				y: random(),
				size: Math.round(Math.random() * 100) / 100,
				shape: shapes[j % shapes.length]
			});
		}
	}

	return data;
}
