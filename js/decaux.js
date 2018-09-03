	

	$( document ).ready(function() {

 		
	    init();


		function init() {
			// StationMap property
			let map;


			loadMap();
			getStationData();
			$('#stationDetails').hide();
			attachClickEventToCanvas();
			attachClickEventToSubmit();

			// StationMap property
			let booked;
		}
		
		// StationMap method
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

		// StationMap method
		function getStationData() {
			var apiUrl = 'https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=525032ff79d1c138597fd9ea7f6640d8939eb118';

			$.get( apiUrl, function( data ) {

				for(i = 0; i < data.length; i++) {
					data[i].name = data[i].name.split(/-(.+)/)[1];
					setMarker(data[i].position.lat, data[i].position.lng, data[i].name, i, data);
				}

			}).fail(function() {
				$('#errorMsg').show();
			});
		}

		// StationMap method
		function setMarker(latitude, longitude, stationName, index, data) {

			// Create a popup, but don't add it to the map yet.
		    var popup = new mapboxgl.Popup({
		        closeButton: true,
		        closeOnClick: true
		    })
	     	.setLngLat([longitude, latitude])
		  	.setHTML("<p class='stationName'>" + stationName.toLowerCase() + "</p>")
		  	.addTo(map);



	  	    // create a DOM element for the marker
		    var el = document.createElement('div');
		    el.className = 'marker';
		    el.style.backgroundImage = 'url(img/red_marker_bike.png)';
			el.style.backgroundSize = '20px auto';
			el.style.backgroundRepeat = 'no-repeat';
		    el.style.width ='30px';
		    el.style.height = '30px';

		    el.addEventListener('click', function() {

		        $('#name').html("Nom de la Station : " + data[index].name);
		        $('#address').html("Adresse de la Station : " + data[index].address);
		        $('#status').html("Statut de la Station : " + data[index].status);
		        $('#bike_stands').html("Nombre de bornes : " + data[index].bike_stands);
		        $('#available_bikes').html("Nombre de vélos disponibles : " + data[index].available_bikes);
		        $('#available_bike_stands').html("Nombre de bornes libres : " + data[index].available_bike_stands);
		        $('#stationDetails').show();
		        $('#instruction').hide();
		    });
	

	        // add marker to map
			new mapboxgl.Marker(el)
			  .setLngLat([longitude, latitude])
			  .setPopup(popup)
			  .addTo(map);

		}

		
		function attachClickEventToCanvas() {
			$('.bookBtn').click(function() {
				$('.bookBtn').hide();
				$('#canvas').show();
			});
		}

		// function attachClickEventToSubmit() {
		// 	$('#submitCanvasBtn').click(function() {
		// data[index].booked = true;
		// data[index].bookTime = new Date();
 		// window.sessionStorage(data[index]);
		// 		setTimeout(function(){ 1200000 });
		// 		document.getElementById("reservations").innerHTML = "Un vélo a été réservé à la station" + data[index].name) + ". La réservation expire dans " + mm&ss + "."
		// 		sessionStorage.date[index]name;
		// 		console.log(sessionStorage)
		// 	});
		// }
});

