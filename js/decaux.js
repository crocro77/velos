	$( document ).ready(function() {

		getStationData();

		function getStationData() {
			var apiUrl = 'https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=525032ff79d1c138597fd9ea7f6640d8939eb118';

			$.get( apiUrl, function( data ) {
				for(var i = 0; i < data.length; i++ ) {
				  var stationAddress = data[i].address;

				  if (data[i].address !== "") {
				   console.log( stationAddress + " index:"  + i);
				  }
				  else {
				  	console.log(" Address empty !");
				  }

				}
			});


	
		}
	  
	});