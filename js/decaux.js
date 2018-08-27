	

	$( document ).ready(function() {

 		
	    init();


		function init() {
			let map;
			loadMap();
			getStationData();
			$('#bookBtn').hide();



		}

		function loadMap() {
			mapboxgl.accessToken = 'pk.eyJ1IjoibnRvbnl5eSIsImEiOiJjamw2enA5eW8waGh0M3BvNXg0NXZieTliIn0.-3QrQ4Nba7o2SOaLyH7mIg';
		    map = new mapboxgl.Map({
			    container: 'map',
			    style: 'mapbox://styles/mapbox/streets-v9',
			    center: [4.83927, 45.750945],
			    zoom: 12
	    	});

	    	 map.on('click', function(e) {
    	 	   var features = map.queryRenderedFeatures(e.point);
			 	console.log(features)
			 });
		}




		function getStationData() {
			var apiUrl = 'https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=525032ff79d1c138597fd9ea7f6640d8939eb118';

			$.get( apiUrl, function( data ) {

				for(i = 0; i < data.length; i++) {
					setMarker(data[i].position.lat, data[i].position.lng, data[i].name, i, data);
				}
			});
		}


		function setMarker(latitude, longitude, stationName, index, data) {

			// Create a popup, but don't add it to the map yet.
		    var popup = new mapboxgl.Popup({
		        closeButton: true,
		        closeOnClick: true
		    })
	     	.setLngLat([longitude, latitude])
		  	.setHTML("<p>" + stationName + "</p>")
		  	.addTo(map);



	  	    // create a DOM element for the marker
		    var el = document.createElement('div');
		    el.className = 'marker';
		    el.style.backgroundImage = 'url(https://image.freepik.com/icones-gratuites/velo-d-39-un-gymnaste_318-46870.jpg)';
		    el.style.width ='20px';
		    el.style.height = '20px';

		    el.addEventListener('click', function() {

		        $('#address').html(data[index].address);
		        $('#bookBtn').show();
		        $('#instruction').hide();
		    });
	

	        // add marker to map
			new mapboxgl.Marker(el)
			  .setLngLat([longitude, latitude])
			  .setPopup(popup)
			  .addTo(map);

		}

	  
	});
