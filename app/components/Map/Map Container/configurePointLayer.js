import mapboxgl from 'mapbox-gl';
import { numberWithCommas } from '../../../utils/numberFunctions';

const configurePointLayer = map => {
  // When a click event occurs on a feature in the places layer, open a popup at the
  // location of the feature, with description HTML from its properties.
  map.on('click', 'airportPoints', e => {
    var coordinates = e.features[0].geometry.coordinates.slice();
    var description = `<h3>${
      e.features[0].properties.airportName
    }</h3><h4>#Flights: ${numberWithCommas(
      e.features[0].properties.flights
    )}<br>CO2/Flight: ${numberWithCommas(e.features[0].properties.co2perFlight)}</h4>`;

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    new mapboxgl.Popup()
      .setLngLat(coordinates)
      .setHTML(description)
      .addTo(map);
  });

  // Change the cursor to a pointer when the mouse is over the airport layer.
  map.on('mouseenter', 'airportPoints', () => {
    map.getCanvas().style.cursor = 'pointer';
  });
  // Change it back to a pointer when it leaves.
  map.on('mouseleave', 'airportPoints', () => {
    map.getCanvas().style.cursor = '';
  });
};

export default configurePointLayer;
