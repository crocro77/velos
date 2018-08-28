	

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

		        $('#name').html("Nom de la Station : " + data[index].name.toLowerCase());
		        $('#address').html("Adresse de la Station : " + data[index].address);
		        $('#status').html("Statut de la Station : " + data[index].status);
		        $('#bike_stands').html("Nombre de bornes : " + data[index].bike_stands);
		        $('#available_bikes').html("Nombre de vélos disponibles : " + data[index].available_bikes);
		        $('#available_bike_stands').html("Nombre de bornes libres : " + data[index].available_bike_stands);
		        $('#bookBtn').show();
		        $('#instruction').hide();
		    });
	

	        // add marker to map
			new mapboxgl.Marker(el)
			  .setLngLat([longitude, latitude])
			  .setPopup(popup)
			  .addTo(map);

		}

	  

	  		var canvas = document.querySelector("canvas");

			var signaturePad = new SignaturePad(canvas);

			// Returns signature image as data URL (see https://mdn.io/todataurl for the list of possible parameters)
			signaturePad.toDataURL(); // save image as PNG
			signaturePad.toDataURL("image/jpeg"); // save image as JPEG
			signaturePad.toDataURL("image/svg+xml"); // save image as SVG

			// Draws signature image from data URL.
			// NOTE: This method does not populate internal data structure that represents drawn signature. Thus, after using #fromDataURL, #toData won't work properly.
			signaturePad.fromDataURL("data:image/png;base64,iVBORw0K...");

			// Returns signature image as an array of point groups
			const data = signaturePad.toData();

			// Draws signature image from an array of point groups
			signaturePad.fromData(data);

			// Clears the canvas
			signaturePad.clear();

			// Returns true if canvas is empty, otherwise returns false
			signaturePad.isEmpty();

			// Unbinds all event handlers
			signaturePad.off();

			// Rebinds all event handlers
			signaturePad.on();
				});
