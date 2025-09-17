const map = L.map('map', {zoomSnap: 0}).setView([39.95, -75.16], 12);

L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v11/tiles/512/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoibWp1bWJlLXRlc3QiLCJhIjoiY202dGU0ajBrMDF6cDJrb2hvYjdmNnVqbyJ9.56P4wOfH800ekNL19mAWWg', {
  maxZoom: 19,
  zoomOffset: -1,
  tileSize: 512,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);
window.map = map;

function getPartyColor(party) {
  return party === 'REPUBLICAN' ? 'red' : 'blue';
}

const resp = await fetch('data/pa_pres_results.geojson');
const data = await resp.json();
const dataLayer = L.geoJSON(data, {
  style: (feature) => {
    const party = feature.properties.party;
    return {
      fillColor: getPartyColor(party),
      fillOpacity: 0.9,
      color: 'black',
      opacity: 0.5,
      weight: 1,
    };
  },
});

dataLayer.addTo(map);
map.fitBounds(dataLayer.getBounds(), {padding: [32, 32]});

const legend = L.control({position: 'bottomright'});

legend.onAdd = function(map) {
  const div = L.DomUtil.create('div', 'info legend');
  const parties = ['DEMOCRAT', 'REPUBLICAN'];
  const labels = ['Democrat', 'Republican'];

  // loop through our density intervals and generate a label with a colored square for each interval
  for (let i = 0; i < parties.length; i++) {
    div.innerHTML +=
            '<i style="background-color:' + getPartyColor(parties[i]) + '"></i> ' +
            labels[i] + '<br>';
  }

  return div;
};

legend.addTo(map);

dataLayer.bindTooltip((layer) => layer.feature.properties.name);
