var diameter = 500,
    format = d3.format(",d"),
    color = d3.scale.category20c();

var bubble = d3.layout.pack()
    .sort(null)
    .size([diameter, diameter])
    .padding(1.5);

var Bsvg = d3.select("#bubbleMap").append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .attr("class", "bubble");
//                         red      purple      pink       lgreen    teal       orange     blue
var chartColors =     ["#ff8a80", "#7c4dff", "#ff4081", "#69f0ae", "#64ffda", "#ffb74d", "#64b5f6"];
var chartDarkColors = ["#d50000", "#6200ea", "#880e4f", "#00c853", "#00bfa5", "#e65100", "#0d47a1"];
//var Bsvg;

/*var Btooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("color", "white")
    .style("padding", "8px")
    .style("background-color", "rgba(0, 0, 0, 0.75)")
    .style("border-radius", "6px")
    .style("font", "12px sans-serif")
    .text("tooltip");*/
	
var Btooltip;

// functions to format data for Bubble Chart friendly JSON
// function myDataBubble() {
//   var bubbleData = {};
//   bubbleData.children = [];
//
//   for(var i = 0; i < outputData.states.length; i++) {
//         bubbleData.children.push({
//         name : outputData.states[i].stateName
//         ,size : parseInt(outputData.states[i].avgTotalCost)
//         });
//   }
//
//   return bubbleData;
// }

function changeBubbleData(state, type) {
	$("#bubbleMap svg").empty();
  var bubbleData = {};
  bubbleData.children = [];
  // choose between type specified in drop-down
  if (type == "Average Total Cost") {
    for(var i = 0; i < outputData.states[state].drg.length; i++) {
          bubbleData.children.push({
          name : outputData.states[state].drg[i].type
          ,size : parseInt(outputData.states[state].drg[i].avgTotalCost)
          });
    }
  } else if (type == "Average Medicare Cost") {
    for(var i = 0; i < outputData.states[state].drg.length; i++) {
          bubbleData.children.push({
          name : outputData.states[state].drg[i].type
          ,size : parseInt(outputData.states[state].drg[i].avgMedicareCost)
          });
    }
  } else if (type == "Max Medicare Coverage") {
    for(var i = 0; i < outputData.states[state].drg.length; i++) {
          bubbleData.children.push({
          name : outputData.states[state].drg[i].type
          ,size : parseInt(outputData.states[state].drg[i].avgMaxMedicareCost)
          });
    }
  }

  //console.log(bubbleData);
  return bubbleData;
}

// viz-display function
function bubbleChart(state, type) {
	
	/*Bsvg = d3.select("#bubbleMap").append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .attr("class", "bubble");*/
	
	Btooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("color", "white")
    .style("padding", "8px")
    .style("background-color", "rgba(0, 0, 0, 0.75)")
    .style("border-radius", "6px")
    .style("font", "12px sans-serif")
    .text("tooltip");
	
  // json data for bubble chart
  jsonNodes = changeBubbleData(state, type);
 // console.log(jsonNodes);

  // nodes data, built from bubble.nodes(classes()) functions
  var nodes = bubble.nodes(classes(jsonNodes));
  //console.log(nodes);
  
  var node = Bsvg.selectAll(".node")
      .data((nodes) //NOTE**classes(root) is a member function of this file that sets up the data file they want to graph, this program is then structured around that json structure
      .filter(function(d) { return !d.children; }))
      .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
	  //future: change color of currently selected service
	  /*.style("fill", function(d)  {console.log($( "#serviceSelect option:selected" ).text() + " ==? " + d.className);
									if($( "#serviceSelect option:selected" ).text() == d.className) return "#FFFFFF";
									else return chartColors[d.value % chartColors.length];} )
	  .style("stroke", function(d) {console.log($( "#serviceSelect option:selected" ).text() + " ==? " + d.className);
									if($( "#serviceSelect option:selected" ).text() == d.className) return "#000000";
									else return chartDarkColors[d.value % chartDarkColors.length];} )
		*/
	  .style("fill", function(d) {return chartColors[d.value % chartColors.length];} )
	  .style("stroke", function(d) {return chartDarkColors[d.value % chartDarkColors.length];} )
	  .style("stroke-width", 1.5)
	  	.on("mouseover", function(d,i)
	{
		d3.select(this).style("fill", "#ffff00");
		d3.select(this).style("stroke", "#ffd600");
		showToolTip(d.className+"<br>" + $("#costSelect option:selected").val() + ": $"+d.value+" ", d3.event.pageX+15 ,d3.event.pageY-55,true);
		//console.log(d3.mouse(this));
	})
	.on("mousemove", function(d,i)
	{

		tooltipDivID.css({top:d3.event.pageY-55,left:d3.event.pageX+15});
		//showToolTip("<ul><li>"+data[0][i]+"<li>"+data[1][i]+"</ul>",d.x+d3.mouse(this)[0]+10,d.y+d3.mouse(this)[1]-10,true);
		//console.log(d3.mouse(this));
	})
    .on("mouseout", function()
	{
		d3.select(this).style("fill", function(d) {return chartColors[d.value % chartColors.length];} );
		d3.select(this).style("stroke", function(d) {return chartDarkColors[d.value % chartDarkColors.length];} );
		showToolTip(" ",0,0,false);
	});


  node.append("title")
      .text(function(d) { return d.className + ": " + format(d.value); });

  node.append("circle")
        .attr("r", function(d) { return d.r; });

  node.append("text")
      .style("font-size", "1px")
      .text(function(d) { return d.className.substring(0, d.r / 3); })
      .each(getSize)
      .attr("dy", ".3em")
      .style("text-anchor", "middle")
	  .style("stroke", "none")
	  .style("fill","black")
      .style("font-size", function(d) { return d.scale + "px"; });
	  
	Bsvg.append("g")
      .attr("class", "nv-axislabel")
	  .attr("id", "chart-title")
      .attr("transform", "translate("+ 30 + "," + 20 + ")")
    .append("text")
	  .style("text-align", "center")
	  .style("width", "100%")
      .text("State Service Average Cost");
};

function showToolTip(pMessage,pX,pY,pShow)
{
  if (typeof(tooltipDivID)=="undefined")
  {
             tooltipDivID =$('<div id="messageToolTipDiv" style="position:absolute;display:block;z-index:10000;border:2px solid black;background-color:rgba(0,0,0,0.8);margin:auto;padding:3px 5px 3px 5px;color:white;font-size:12px;font-family:arial;border-radius: 5px;vertical-align: middle;text-align: center;min-width:50px;overflow:auto;"></div>');

		$('body').append(tooltipDivID);
  }
  if (!pShow) { tooltipDivID.hide(); return;}
  //MT.tooltipDivID.empty().append(pMessage);
  tooltipDivID.html(pMessage);
  tooltipDivID.css({top:pY,left:pX});
  tooltipDivID.show();
}


function getSize(d) {
  var bbox = this.getBBox(),
      cbbox = this.parentNode.getBBox(),
      scale = Math.min(cbbox.width/bbox.width, cbbox.height/bbox.height);
  d.scale = scale;
  console.log(d.className + " : " + scale);
}

// Returns a flattened hierarchy containing all leaf nodes under the root.
function classes(root) {
  var classes = [];

  function recurse(name, node) {
    if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
    else classes.push({packageName: name, className: node.name, value: node.size});
  }

  recurse(null, root);
  return {children: classes};
}

d3.select(self.frameElement).style("height", diameter + "px");
