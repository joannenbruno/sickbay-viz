
var Uwidth = 400,
    Uheight = 250,
    active = d3.select(null);

var projection = d3.geo.albersUsa()
    .scale(500)
    .translate([Uwidth / 2, Uheight / 2]);

var path = d3.geo.path()
    .projection(projection);

var Usvg = d3.select("#USMap").append("svg")
    .attr("width", Uwidth)
    .attr("height", Uheight);

Usvg.append("rect")
    .attr("class", "background")
    .attr("width", Uwidth)
    .attr("height", Uheight)
    .on("click", reset);
	
var Ug = Usvg.append("g")
    .style("stroke-width", "1.5px");

d3.json("data\\us.json", function(error, us) {
  if (error) throw error;

  Ug.selectAll("path")
      .data(topojson.feature(us, us.objects.states).features)
    .enter().append("path")
      .attr("d", path)
      .attr("class", "feature")
      .on("click", clicked);

  Ug.append("path")
      .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
      .attr("class", "mesh")
      .attr("d", path);
});

function clicked(d) {
  if (active.node() === this) return reset();
  active.classed("active", false);
  active = d3.select(this).classed("active", true);

  var bounds = path.bounds(d),
      dx = bounds[1][0] - bounds[0][0],
      dy = bounds[1][1] - bounds[0][1],
      x = (bounds[0][0] + bounds[1][0]) / 2,
      y = (bounds[0][1] + bounds[1][1]) / 2,
      scale = .9 / Math.max(dx / Uwidth, dy / Uheight),
      translate = [Uwidth / 2 - scale * x, Uheight / 2 - scale * y];

  Ug.transition()
      .duration(750)
      .style("stroke-width", 1.5 / scale + "px")
      .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
}

function reset() {
  active.classed("active", false);
  active = d3.select(null);

  Ug.transition()
      .duration(750)
      .style("stroke-width", "1.5px")
      .attr("transform", "");
}
