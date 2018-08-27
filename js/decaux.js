	

	$( document ).ready(function() {

 		
	    init();


		function init() {
			let map;
			loadMap();
			getStationData();
		}

		function loadMap() {
			mapboxgl.accessToken = 'pk.eyJ1IjoibnRvbnl5eSIsImEiOiJjamw2enA5eW8waGh0M3BvNXg0NXZieTliIn0.-3QrQ4Nba7o2SOaLyH7mIg';
		    map = new mapboxgl.Map({
			    container: 'map',
			    style: 'mapbox://styles/mapbox/streets-v9',
			    center: [4.83927, 45.750945],
			    zoom: 12
	    	});
		}




		function getStationData() {
			var apiUrl = 'https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=525032ff79d1c138597fd9ea7f6640d8939eb118';

			$.get( apiUrl, function( data ) {
				for(i = 0; i < data.length; i++) {
					setMarker(data[i].position.lat, data[i].position.lng);
				}
			});
		}


		function setMarker(latitude, longitude) {

			var marker = new mapboxgl.Marker()
			  .setLngLat([longitude, latitude])
			  .addTo(map);
		}


	  
	});
