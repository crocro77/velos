'use strict';

$(document).ready(function () {

    init();

    function init() {




        let stationMap = {
            map: {},
            getMap: function () {
                mapboxgl.accessToken = 'pk.eyJ1IjoibnRvbnl5eSIsImEiOiJjamw2enA5eW8waGh0M3BvNXg0NXZieTliIn0.-3QrQ4Nba7o2SOaLyH7mIg';
                this.map = new mapboxgl.Map({
                    container: 'map',
                    style: 'mapbox://styles/mapbox/streets-v9',
                    center: [4.83927, 45.750945],
                    zoom: 12
                });
            },
            getStation: function () {
                const apiUrl = 'https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=525032ff79d1c138597fd9ea7f6640d8939eb118';
                let self = this;
                $.get(apiUrl, function (data) {

                    for (let i = 0; i < data.length; i++) {
                        data[i].name = data[i].name.split(/-(.+)/)[1];
                        self.setMarker(data[i].position.lat, data[i].position.lng, data[i].name, i, data);
                    }

                }).fail(function () {
                    $('#errorMsg').show();
                });
            },
            setMarker: function (latitude, longitude, stationName, index, data) {
                var popup = new mapboxgl.Popup({
                    closeButton: true,
                    closeOnClick: true
                })
                    .setLngLat([longitude, latitude])
                    .setHTML("<p class='stationName'>" + stationName.toLowerCase() + "</p>")
                    .addTo(this.map);

                var el = document.createElement('div');
                el.className = 'marker';
                // CSS
                el.style.backgroundImage = 'url(img/red_marker_bike.png)';
                el.style.backgroundSize = '20px auto';
                el.style.backgroundRepeat = 'no-repeat';
                el.style.width = '30px';
                el.style.height = '30px';

                el.addEventListener('click', function () {

                    $('#name').html("Nom de la Station : " + data[index].name);
                    $('#address').html("Adresse de la Station : " + data[index].address);
                    $('#status').html("Statut de la Station : " + data[index].status);
                    $('#bike_stands').html("Nombre de bornes : " + data[index].bike_stands);
                    $('#available_bikes').html("Nombre de vélos disponibles : " + data[index].available_bikes);
                    $('#available_bike_stands').html("Nombre de bornes libres : " + data[index].available_bike_stands);
                    $('#stationDetails').show();
                    $('#instruction').hide();
                    
                });

                new mapboxgl.Marker(el)
                    .setLngLat([longitude, latitude])
                    .setPopup(popup)
                    .addTo(this.map);

            }
        };

        stationMap.getMap();
        stationMap.getStation();
        $('#stationDetails').hide();
        //attachClickEventToCanvas();
    }

});

