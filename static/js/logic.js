// Define the query URL for the earthquake data.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL using d3.json.
d3.json(queryUrl).then(function(data) {
  console.log(data);

  // Call the createMap function and pass in the earthquake data.
  createMap(data.features);
});

// Define a function that creates the map.
function createMap(earthquakeData) {

  // Create a function that sets the color of the marker based on the depth of the earthquake.
  function getColor(depth) {
    if (depth > 90) {
      return "#FF4500";
    } else if (depth > 70) {
      return "#FF8C00";
    } else if (depth > 50) {
      return "#FFA500";
    } else if (depth > 30) {
      return "#FFD700";
    } else if (depth > 10) {
      return "#FFFF00";
    } else {
      return "#ADFF2F";
    }
  };

  // Creating a function for radius marker based on the magnitude of the earthquake.
  function getRadius(magnitude) {
    return magnitude *3;
  };

  // Create a GeoJSON layer containing the earthquake data.
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: function(feature, layer) {
      // Bind a popup to the marker that displays information about the earthquake.
      layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p><p>Date: ${new Date(feature.properties.time)}</p>`);
    },
    pointToLayer: function(feature, latlng) {
      // Create a circle marker for each earthquake.
      return L.circleMarker(latlng, {
        radius: getRadius(feature.properties.mag),
        fillColor: getColor(feature.geometry.coordinates[2]),
        weight: 1,
        fillOpacity: 0.8
      });
    }
  });

  earthquakes.addTo(myMap);

  // Create a legend that displays information about the earthquake data.
  let legend = L.control({position: 'bottomright'});
  
  let legendColors = [
    { depth: "90+", color: "#FF4500" },
    { depth: "70-90", color: "#FF8C00" },
    { depth: "50-70", color: "#FFA500" },
    { depth: "30-50", color: "#FFD700" },
    { depth: "10-30", color: "#FFFF00" },
    { depth: "-10-10", color: "#ADFF2F" }
  ];
  
  legend.onAdd = function(){
    let div = L.DomUtil.create("div", "info legend");
  
    div.innerHTML = "<h4>Depth (km)</h4>";
  
    legendColors.forEach(function(color) {
      div.innerHTML +=
        '<i style="background:' +
        color.color +
        '"></i> ' +
        color.depth +
        '<br>';
    });
  
    return div;
  };

  // Add the legend to the map.
  legend.addTo(myMap);
};

// Create the base layers.
let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

// Create the map object and set the default view to the center of the United States.
let myMap = L.map("map", {
  center: [7.09, -95.71],
  zoom: 2.5,
  layers: [street]
});