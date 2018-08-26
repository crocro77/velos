"use strict";

mapboxgl.accessToken = 'pk.eyJ1IjoibnRvbnl5eSIsImEiOiJjamw2enA5eW8waGh0M3BvNXg0NXZieTliIn0.-3QrQ4Nba7o2SOaLyH7mIg';
    const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v9',
    center: [4.83, 45.76],
    zoom: 11.5
    });

var marker1 = new mapboxgl.Marker()
  .setLngLat([4.815747, 45.743317])
  .addTo(map);

var marker2 = new mapboxgl.Marker()
  .setLngLat([4.821662, 45.75197])
  .addTo(map);

var marker3 = new mapboxgl.Marker()
  .setLngLat([4.844845, 45.768896])
  .addTo(map);