var width  = 600,
	height = 400;		
	
var projection = d3.geo.mercator()
					   .translate([0, 0])
					   .scale(1);
						
var path = d3.geo.path()
				 .projection(projection);

var svg = d3.select("#mapid")
			.append("svg")
			.attr("width", width)
			.attr("height", height)
			.call(d3.behavior.zoom().scaleExtent([1, 20]).on("zoom", zoom)),
			
	g = svg.append("g")
			.attr("class", "leaflet-zoom-hide"),
			
	tooltip = d3.select("body")
				.append("div")
				.attr("class", "tooltip");
			
			
d3.json("./assets/data/regions.geojson", function(json) {			
	var b = path.bounds( json ),
		s = .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
		t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];
		
	projection
		.scale(s)
		.translate(t);
				
	g.selectAll("path")
		.data(json.features)
		.enter()
		.append("path")
		.attr("id", function(d) { return d.properties.code})
		.on("mouseover", function(d) { tooltip.html(d.properties.nom);})
		.on("mouseout", function(d) {tooltip.html("");})
		.attr("d", path)
		.style("fill", "steelblue");	
		
	//Nom des villes
	/*g.selectAll("labels")
		.data(json.features)
		.enter()
		.append("text")
		.attr("class", "labels")
		.attr("transform", function(d) {return "translate(" + path.centroid(d) + ")";})
		.attr("dy", ".35em")
		.text(function(d) {return d.properties.nom;});*/
		
});

function zoom() {
  svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}
