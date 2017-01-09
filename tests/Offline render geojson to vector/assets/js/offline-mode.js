var width  = 600,
	height = 400;
			
var map = L.map('mapid').setView([51.505, -0.09], 13);
	
L.tileLayer('./assets/Tiles/{z}/{x}/{y}.png', {maxzoom: 16}).addTo(map);
	
var projection = d3.geo.mercator()
					   .translate([0, 0])
					   .scale(1);
						
var path = d3.geo.path()
				 .projection(projection);

var svg = d3.select("#mapid")
			.append("svg")
			.attr("width", width)
			.attr("height", height)
			.call(d3.behavior.zoom().scaleExtent([1, 20]).on("zoom", zoom))
			.append("g")
			.attr("class", "leaflet-zoom-hide");
			
d3.json("./assets/data/regions.geojson", function(json) {			
	var b = path.bounds( json ),
		s = .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
		t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];
		
	projection
		.scale(s)
		.translate(t);
				
	svg.selectAll("path")
		.data(json.features)
		.enter()
		.append("path")
		.attr("d", path)
		.style("fill", "steelblue");	
});

function zoom() {
  svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}