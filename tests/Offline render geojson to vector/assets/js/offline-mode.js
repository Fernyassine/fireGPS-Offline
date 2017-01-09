var xml = Fichier('.assets/data/map.osm');   
        
var geojson = osm2geo(xml);

console.log(geojson);

var blob = new Blob([geojson], {type: "application/json"});
var url = URL.createObjectURL(blob);

var a = document.createElement('a');
a.download = "map.geojson";
a.href = url;
a.textContent = "Dl map.json"; 

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

function Fichier(fichier)
{
    if(window.XMLHttpRequest) 
        obj = new XMLHttpRequest(); //Pour Firefox, Opera,...
    else if(window.ActiveXObject) 
        obj = new ActiveXObject("Microsoft.XMLHTTP"); //Pour Internet Explorer 
    else 
        return(false);

    if (obj.overrideMimeType) 
        obj.overrideMimeType("text/xml"); //Évite un bug de Safari

    obj.open("GET", fichier, false);
    obj.send(null);

    if(obj.readyState == 4) 
        return(obj.responseText);
    else 
        return(false);
}