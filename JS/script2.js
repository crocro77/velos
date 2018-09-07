'use strict';

function Reservation(){
   
    // au chargement de la page on reprend la reservation du session storage:
    var stationReservee = sessionStorage.getItem('bookInfo') && sessionStorage.getItem('bookInfo')!='undefined' ? JSON.parse(sessionStorage.getItem('bookInfo')) : {};
                   
    // la fonction appelee pour reserver un velo sur une station:
    this.reserver = function(station){
        console.info('RESERVER',station);
        stationReservee = station;
        sessionStorage.setItem('bookTime',Date.now());
        sessionStorage.setItem('bookInfo',JSON.stringify(station));
    }
   
    // la fonction qui refresh le footer
    this.refresh = function(){
        var $reservations = $('#reservations');
        var bookTime = sessionStorage.getItem('bookTime');
        if(!bookTime){
            $reservations.text("Vous n'avez aucune réservation");
        }else{
            var bookDiff = Date.now()-bookTime;
            var timeLeft = 20*60 - Math.round(bookDiff/1000); // Date.now() est en millisecondes
            if(timeLeft<0){
                $reservations.text("Réservation expirée");             
                //TODO: remove from sessionStorage;
            }else{                 
                var mm = Math.floor(timeLeft / 60);
                var ss = timeLeft - mm * 60;               
                $reservations.text("Un vélo a été réservé à la station "+stationReservee.name+ ". La réservation expire dans " + (mm<10?'0'+mm:mm)+':'+(ss<10?'0'+ss:ss));
            }
        }
    }
   
    // on lance le refresh chaque seconde
    setInterval(this.refresh,1000);
}


function StationMap() {		
	
    var map;
    var clickedStation; // la derniere station cliquee
    var reservation = new Reservation();  
	
	this.init = function(){
		this.loadMap();
		this.getStationData();
		$('#stationDetails').hide();
		this.attachClickEventToCanvas();
		this.attachClickEventToSubmit();
		this.attachClickEventToCancel();
	}
	
	this.loadMap = function(){
		mapboxgl.accessToken = 'pk.eyJ1IjoibnRvbnl5eSIsImEiOiJjamw2enA5eW8waGh0M3BvNXg0NXZieTliIn0.-3QrQ4Nba7o2SOaLyH7mIg';
		map = new mapboxgl.Map({
			container: 'map',
			style: 'mapbox://styles/mapbox/streets-v9',
			center: [4.83927, 45.750945],
			zoom: 12
		});
	}
	
	this.getStationData = function() {
		const apiUrl = 'https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=525032ff79d1c138597fd9ea7f6640d8939eb118';
		var flex = this;
		$.get( apiUrl, function( data ) {
			for(let i = 0; i < data.length; i++) {
				data[i].name = data[i].name.split(/-(.+)/)[1];
				flex.setMarker(data[i].position.lat, data[i].position.lng, data[i].name, i, data);
			}
		}).fail(function() {
			$('#errorMsg').show();
		});
	}
	
	this.setMarker = function(latitude, longitude, stationName, index, data) {
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
            clickedStation = data[index];
			$('#name').html("Nom de la Station : " + data[index].name);
			$('#address').html("Adresse de la Station : " + data[index].address);
			$('#status').html("Statut de la Station : " + data[index].status);
			$('#bike_stands').html("Nombre de bornes : " + data[index].bike_stands);
			$('#available_bikes').html("Nombre de vélos disponibles : " + data[index].available_bikes);
			$('#available_bike_stands').html("Nombre de bornes libres : " + data[index].available_bike_stands);
			$('#stationDetails').show();
			$('#instruction').hide();
			$('#velov_station_img').hide();
		});
		// add marker to map
		new mapboxgl.Marker(el)
		  .setLngLat([longitude, latitude])
		  .setPopup(popup)
		  .addTo(map);
	}
	
	this.attachClickEventToCanvas = function() {
		$('.bookBtn').click(function() {
			$('.bookBtn').hide();
			$('#canvas').show();
		});
    }
    
    this.attachClickEventToSubmit = function() {
        $('#submitCanvasBtn').click(function() {
            reservation.reserver(clickedStation);
		$('#canvas').hide();
		$('#stationDetails').hide();
		$('#velov_station_img').show();
		$('#instruction').show();
        });
	}
	
	this.attachClickEventToCancel = function() {
		$('#cancelCanvasBtn').click(function() {	
		$('#canvas').hide();
		$('#stationDetails').hide();
		$('#instruction').show();
		$('.bookBtn').show();
		$('#velov_station_img').show();
		});
	}
}	


//--------------------------------------------

$( document ).ready(function() {
	var station = new StationMap();
	station.init();
});