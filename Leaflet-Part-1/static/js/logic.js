const url =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

const colors = [
  "#F7CEA0",
  "#E09C91",
  "#D0868F",
  "#BB708E",
  "#875D8E",
  "#604E8A",
];

function getColor(depth) {
  if (depth > 90) {
    return colors[5];
  } else if (depth > 70) {
    return colors[4];
  } else if (depth > 50) {
    return colors[3];
  } else if (depth > 30) {
    return colors[2];
  } else if (depth > 10) {
    return colors[1];
  } else {
    return colors[0];
  }
}

var container = L.DomUtil.get("map");
if (container != null) {
  container._leaflet_id = null;
}

// Perform a GET request to the query URL/
d3.json(url).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  console.log(data.features);
  const features = data.features;

  // Creating our initial map object:
  // We set the longitude, latitude, and starting zoom level.
  // This gets inserted into the div with an id of "map".
  let myLeaflet = L;

  let myMap = myLeaflet.map("map", {
    center: [15.6993, 42.1244],
    zoom: 2,
  });

  // Adding a tile layer (the background map image) to our map:
  // We use the addTo() method to add objects to our map.
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(myMap);

  features.forEach((feature, index) => {
    // Creating a new marker:
    // We pass in some initial options, and then add the marker to the map by using the addTo() method.
    const coordinates = feature["geometry"]["coordinates"];
    const depth = coordinates.pop();
    const mag = feature["properties"]["mag"];
    const title = feature["properties"]["title"];
    // console.log(index);
    // console.log(depth);
    // console.log();
    let marker = L.circle(coordinates, {
      color: "black",
      weight: 0.4,
      fillColor: getColor(depth),
      fillOpacity: 1,
      radius: mag * 50000,
    }).addTo(myMap);

    // Create a circle, and pass in some initial options.

    // Binding a popup to our marker
    marker.bindPopup(
      `<h3>${title}</h3> 
      <hr> 
      <div>Coordinates: ${coordinates}</div>
      <div>Mag: ${mag}</div>
      <div>Depth: ${depth}</div>
      `
    );
  });

  var legend = L.control({ position: "bottomright" });

  legend.onAdd = function (map) {
    var div = L.DomUtil.create("div", "info legend"),
      grades = [-10, 10, 30, 50, 70, 90],
      labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        '<i style="background:' +
        colors[i] +
        '"></i> ' +
        grades[i] +
        (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }

    return div;
  };

  legend.addTo(myMap);
});
