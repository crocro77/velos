"use strict";

$(document).ready(function () {
    // on initialise les méthodes qui sont dans la fonction init de chaque objet
    stationMap.init();
    Reservation.init();
});

// l'objet stationMap et les fonctions qui appellent la carte et les stations
let stationMap = {
    map: [],
    clickedStation: null,
    reservation: null,
    init: function () {
        this.loadMap();
        this.getStationData();
        $('#stationDetails').hide();
        this.attachClickEventToCanvas();
    },

    // la carte mapbox
    loadMap: function () {
        mapboxgl.accessToken = 'pk.eyJ1IjoibnRvbnl5eSIsImEiOiJjamw2enA5eW8waGh0M3BvNXg0NXZieTliIn0.-3QrQ4Nba7o2SOaLyH7mIg';
        this.map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v9',
            center: [4.83927, 45.750945],
            zoom: 12.5
        });
    },

    // l'API JCDecaux
    getStationData: function () {
        const apiUrl = 'https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=525032ff79d1c138597fd9ea7f6640d8939eb118';
        let flex = this;
        $.get(apiUrl, function (data) {
            for (let i = 0; i < data.length; i++) {
                data[i].name = data[i].name.split(/-(.+)/)[1];
                flex.setMarker(data[i].position.lat, data[i].position.lng, data[i].name, i, data);
            }
        }).fail(function () {
            // si le serveur de l'API JCDecaux ne répond pas, un message d'erreur s'affiche
            $('#errorMsg').show();
        });
    },

    // le placement des marqueurs, de leurs popups et de leurs affichages détaillés des stations dans la div à côté de la map
    setMarker: function (latitude, longitude, stationName, index, data) {
        let popup = new mapboxgl.Popup({
            closeButton: true,
            closeOnClick: true,
        })
            .setLngLat([longitude, latitude])
            .setHTML("<p class='stationName'>" + stationName.toLowerCase() + "</p>")
            .addTo(this.map);
        let el = document.createElement('div');
        el.className = 'marker';
        el.addEventListener('click', function () {
            this.clickedStation = data[index];
            sessionStorage.setItem('selectedStation', this.clickedStation.name);
            $('#name').html("Nom de la Station : " + data[index].name.toLowerCase());
            $('#address').html("Adresse de la Station : " + data[index].address);
            $('#status').html("Statut de la Station : " + data[index].status);
            $('#status').css('background-color', data[index].status == 'OPEN' ? 'green' : 'red');
            $('#status').css('color', data[index].status == 'OPEN' ? 'white' : 'white');
            $('#status').css('margin', data[index].status == 'OPEN' ? '10px 120px' : '10px 120px');
            $('#bike_stands').html("Nombre de bornes : " + data[index].bike_stands);
            $('#available_bikes').html("Nombre de vélos disponibles : " + data[index].available_bikes);
            $('#available_bike_stands').html("Nombre de bornes libres : " + data[index].available_bike_stands);
            $('#stationDetails').show();
            $('#instruction').hide();
            $('#velov_station_img').hide();
            // condition qui masque le bouton réserver un vélo et le formulaire nom-prénom, si la station est fermée ou aucun vélo n'est disponible
            if (this.clickedStation.status === 'CLOSED' || this.clickedStation.available_bikes === 0) {
                $('#bookForm').hide();
                $('.bookBtn').hide();
            } else {
                $('#bookForm').show();
                $('.bookBtn').show();
            }
        });

        // ajout des marqueurs sur la map
        new mapboxgl.Marker(el)
            .setLngLat([longitude, latitude])
            .setPopup(popup)
            .addTo(this.map);
    },

    // la fonction du bouton reserver un vélo qui ouvre l'encart canvas
    attachClickEventToCanvas: function () {
        $('.bookBtn').click(function () {
            $('#canvas').show();
        });
    },
}

// la fonction du bouton valider avec condition si aucune signature n'est détectée
function attachClickEventToSubmit() {
    if (Canvas.clickX.length > 0) {
        Reservation.reserver(sessionStorage.getItem('selectedStation'));
        $('#canvas').hide();
        $('#stationDetails').hide();
        $('#velov_station_img').show();
        $('#instruction').show();
        Canvas.clearDraw();
    } else {
        alert("Merci de signer pour activer votre réservation !");
    }
}

// la fonction du bouton annuler qui ferme le canvas et retourne sur la map
function attachClickEventToCancel() {
    $('#canvas').hide();
    $('#stationDetails').hide();
    $('#instruction').show();
    $('#velov_station_img').show();
    Canvas.clearDraw();
}

// la fonction qui vérifie si le formulaire nom-prénom a été rempli
function formCheck() {
    // on définit un boolean qu'on initialise à false
    let hasError = false;
    let fields = $(".itemRequired")
        .find("input").serializeArray();

    $.each(fields, function (i, field) {
        if (!field.value) {
            // on boucle sur les champs du formulaire. Si un ou plusieurs champs sont vides, on passe le boolean à true
            hasError = true;
            $('.bookBtn').click(function () {
                $('#canvas').hide();
                $('.bookBtn').show();
            });
        } else {
            $('.bookBtn').click(function () {
                $('.bookBtn').hide();
                $('#canvas').show();
            });
            // on stocke les nom et prénom qui sont renseignés
            localStorage.setItem(field.name, field.value);
        }
    });

    // en dehors de la boucle et à la fin de la fonction, si hasError est true on affiche l'alert.
    if (hasError) {
        alert("Veuillez saisir vos nom et/ou prénom !");
    }
}

// l'objet réservation et les fonction qui gèrent la réservation avec les différents storages (nom, prénom, station, heure)
let Reservation = {
    stationReservee: null,
    lastname: null,
    firstname: null,
    init: function () {
        this.stationReservee();
        setInterval(this.refresh, 1000);
    },

    // au chargement de la page on reprend la reservation du session storage
    stationReservee: function () {
        this.stationReservee = sessionStorage.getItem('bookInfo') && sessionStorage.getItem('bookInfo') != 'undefined' ? sessionStorage.getItem('bookInfo') : {};
    },

    // la fonction appelee pour reserver un velo sur une station
    reserver: function (station) {
        this.stationReservee = station;
        sessionStorage.setItem('bookTime', Date.now());
        sessionStorage.setItem('bookInfo', station);
    },

    // la fonction qui refresh le footer
    refresh: function () {
        this.firstname = localStorage.getItem("firstname", "");
        this.lastname = localStorage.getItem("lastname", "");
        this.stationReservee = sessionStorage.getItem("bookInfo", "");
        let $reservations = $('#reservations');
        let bookTime = sessionStorage.getItem('bookTime');
        if (!bookTime) {
            $reservations.text("Vous n'avez aucune réservation");
        } else {
            let bookDiff = Date.now() - bookTime;
            let timeLeft = 20 * 60 - Math.round(bookDiff / 1000);
            if (timeLeft < 0) {
                $reservations.text("Réservation expirée !");
            } else {
                let mm = Math.floor(timeLeft / 60);
                let ss = timeLeft - mm * 60;
                $reservations.text("Un vélo a été réservé à la station " + this.stationReservee + " par " + this.lastname + " " + this.firstname + ". La réservation expire dans " + (mm < 10 ? '0' + mm : mm) + " minutes et " + (ss < 10 ? '0' + ss : ss) + " secondes.");
            }
        }
    },
}