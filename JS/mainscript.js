"use strict";

// la fonction du slider
function init() {
  var sliderInterval;

  // objet slider avec conditions qui permettent de defiler les images en boucles
  let slider = {
    index: 0,
    images: ['img/slider01.jpg', 'img/slider02.jpg', 'img/slider03.jpg', 'img/slider04.jpg', 'img/slider05.jpg', 'img/slider06.jpg', 'img/slider07.jpg', 'img/slider08.jpg'],
    next: () => {
      if (slider.index + 1 < slider.images.length) {
        slider.index += 1;
      } else {
        slider.index = 0;
      }
      document.getElementById('sliderImage').setAttribute('src', slider.images[slider.index]);
    },

    previous: () => {
      if (slider.index - 1 >= 0) {
        slider.index -= 1;
      } else {
        slider.index = slider.images.length - 1;
      }
      document.getElementById('sliderImage').setAttribute('src', slider.images[slider.index]);
    },

    // fonction qui permet l'autoplay du slider avec changement d'images toutes les 5 secondes
    setSliderInterval: function () {
      return setInterval(function () {
        slider.next();
      }, 5000);
    }
  };

  // la fonction qui gere l'interaction de l'utilisateur sur le slider (clics souris, keydowns fleches gauche et droite et les mouseover/mouseleave)
  function attachSliderEvents() {
    document.getElementById("previous").onclick = slider.previous;
    document.getElementById("next").onclick = slider.next;
    document.getElementById("sliderImage").addEventListener("mouseover", function () {
      clearInterval(sliderInterval);
    });

    document.getElementById("sliderImage").addEventListener("mouseleave", function () {
      sliderInterval = slider.setSliderInterval();
    });
    document.addEventListener("keydown", function (e) {
      if (e.keyCode === 37) {
        slider.previous();
      }
      else if (e.keyCode === 39) {
        slider.next();
      }
    });
  }

  sliderInterval = slider.setSliderInterval();
  attachSliderEvents();
}

// initialisation de la map et des stations
$(document).ready(function () {
    let station = new stationMap();
    station.init();
});

// la fonction qui appelle la carte et les stations
function stationMap() {

    let map;
    let clickedStation;
    let reservation = new Reservation();

    this.init = function () {
        this.loadMap();
        this.getStationData();
        $('#stationDetails').hide();
        this.attachClickEventToCanvas();
        this.attachClickEventToSubmit();
        this.attachClickEventToCancel();
    }

    // la carte mapbox
    this.loadMap = function () {
        mapboxgl.accessToken = 'pk.eyJ1IjoibnRvbnl5eSIsImEiOiJjamw2enA5eW8waGh0M3BvNXg0NXZieTliIn0.-3QrQ4Nba7o2SOaLyH7mIg';
        map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v9',
            center: [4.83927, 45.750945],
            zoom: 12.5
        });
    }

    // l'API JCDecaux
    this.getStationData = function () {
        const apiUrl = 'https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=525032ff79d1c138597fd9ea7f6640d8939eb118';
        let flex = this;
        $.get(apiUrl, function (data) {
            for (let i = 0; i < data.length; i++) {
                data[i].name = data[i].name.split(/-(.+)/)[1];
                flex.setMarker(data[i].position.lat, data[i].position.lng, data[i].name, i, data);
            }
        }).fail(function () {
            $('#errorMsg').show();
        });
    }

    // le placement des marqueurs, de leurs popups et de leurs affichages détaillés des stations dans la div à côté de la map
    this.setMarker = function (latitude, longitude, stationName, index, data) {
        let popup = new mapboxgl.Popup({
            closeButton: true,
            closeOnClick: true,
        })
            .setLngLat([longitude, latitude])
            .setHTML("<p class='stationName'>" + stationName.toLowerCase() + "</p>")
            .addTo(map);

        let el = document.createElement('div');
        el.className = 'marker';
        el.addEventListener('click', function () {
            clickedStation = data[index];
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
            if (clickedStation.status === 'CLOSED' || clickedStation.available_bikes === 0) {
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
            .addTo(map);
    }

    // la fonction du bouton reserver un vélo de la div stationDetails qui ouvre l'encart canvas
    this.attachClickEventToCanvas = function () {
        $('.bookBtn').click(function () {
            $('#canvas').show();
        });
    }

    // la fonction du bouton valider du div canvas avec condition si aucune signature n'est détectée
    this.attachClickEventToSubmit = function () {
        $('#submitCanvasBtn').click(function () {
            if (Canvas.clickX.length > 0) {
                reservation.reserver(clickedStation);
                $('#canvas').hide();
                $('#stationDetails').hide();
                $('#velov_station_img').show();
                $('#instruction').show();
                Canvas.clearDraw();
            } else {
                alert("Merci de signer pour activer votre réservation !");
            }
        });
    }

    // la fonction du bouton annuler du div canvas qui ferme le canvas et retourne sur la map
    this.attachClickEventToCancel = function () {
        $('#cancelCanvasBtn').click(function () {
            $('#canvas').hide();
            $('#stationDetails').hide();
            $('#instruction').show();
            $('#velov_station_img').show();
        });
    }
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
                $('bookBtn').hide();
                $('#canvas').show();
            });
        }
    });

    // en dehors de la boucle et à la fin de la fonction, si hasError est true on affiche l'alert.
    if (hasError) {
        alert("Veuillez saisir vos nom et/ou prénom !");
    }
}

// la fonction qui gère la réservation avec le storage et le timer
function Reservation() {
    // au chargement de la page on reprend la reservation du session storage
    let stationReservee = sessionStorage.getItem('bookInfo') && sessionStorage.getItem('bookInfo') != 'undefined' ? JSON.parse(sessionStorage.getItem('bookInfo')) : {};

    // récupération des données du formulaire nom et prénom
    let lastname = localStorage.lastname;
    if (lastname == null || typeof (lastname) == "undefined")
        lastname = "";
    document.getElementById("lastname").value = lastname;

    let firstname = localStorage.firstname;
    if (firstname == null || typeof (firstname) == "undefined")
        firstname = "";
    document.getElementById("firstname").value = firstname;

    // la fonction appelee pour reserver un velo sur une station
    this.reserver = function (station) {
        stationReservee = station;
        sessionStorage.setItem('bookTime', Date.now());
        sessionStorage.setItem('bookInfo', JSON.stringify(station));
    }

    // la fonction qui refresh le footer
    this.refresh = function () {
        firstname = localStorage.getItem("firstname", "");
        lastname = localStorage.getItem("lastname", "");
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
                $reservations.text("Un vélo a été réservé à la station " + stationReservee.name + " par " + lastname + " " + firstname + ". La réservation expire dans " + (mm < 10 ? '0' + mm : mm) + " minutes et " + (ss < 10 ? '0' + ss : ss) + " secondes.");
            }
        }
    }

    // on lance le refresh chaque seconde
    setInterval(this.refresh, 1000);
}

// la fonction qui gere le canvas
window.addEventListener('load', function () {
    Canvas.init();
});

// l'objet canvas
let Canvas = {
    canvas: null,
    context: null,
    line: [],
    clickDrag: [],
    clickX: [],
    clickY: [],
    paint: false,
    init: function () {

        this.canvas = document.getElementById('canvasWindow');
        this.context = this.canvas.getContext('2d');

        let mouseDownBind =  this.mouseDown.bind(this);
        this.canvas.addEventListener('mousedown', mouseDownBind);

        let mouseUpBind = this.mouseUp.bind(this);
        this.canvas.addEventListener('mouseup', mouseUpBind);

        let mouseUpEventBind = this.mouseUpEvent.bind(this);
        this.canvas.addEventListener('mouseup', mouseUpEventBind);

        let mouseMoveEventBind = this.mouseMoveEvent.bind(this);
        this.canvas.addEventListener('mousemove', mouseMoveEventBind);

        let clearCanvasButtonBind = this.clearCanvasButton.bind(this);
        document.getElementById('clearCanvasBtn').addEventListener('click', clearCanvasButtonBind);

        document.getElementById('submitCanvasBtn').addEventListener('click', function () {
        });
    },

    // les differentes interactions de la souris sur le canvas
    mouseDown: function(e) {
        let mouseX = e.pageX - this.offsetLeft;
        let mouseY = e.pageY - this.offsetTop;
        this.paint = true;
        this.storeMouseClick(mouseX, mouseY);
        this.draw();
    },

    mouseUp: function() {
        this.paint = false;
    },

    mouseUpEvent: function(e) {
        this.draw(e.pageX, e.pageY);
    },

    mouseMoveEvent: function(e){
        if (this.paint === true){
            this.storeMouseClick(e.pageX - this.canvas.offsetLeft, e.pageY - this.canvas.offsetTop, true);
            this.draw();
        }
    },

    // la fonction du bouton effacer de la div canvas qui permet d'effacer le canvas
    clearCanvasButton: function (){
        this.clearDraw();
    },

    // la fonction qui store lorsque la souris dessine
    storeMouseClick: function (x, y, dragging) {
        this.clickX.push(x);
        this.clickY.push(y);
        this.clickDrag.push(dragging);
    },

    // la fonction qui va dessiner les mouvements cliques de la souris sur le canvas
    draw: function (mouseX, mouseY) {
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        this.context.strokeStyle = "#000";
        this.context.lineJoin = "round";
        this.context.lineWidth = 5;

        for (var i = 0; i < this.clickX.length; i++) {
            this.context.beginPath();
            if (this.clickDrag[i] && i) {
                this.context.moveTo(this.clickX[i - 1], this.clickY[i - 1]);
            } else {
                this.context.moveTo(this.clickX[i] - 1, this.clickY[i]);
            }
            this.context.lineTo(this.clickX[i], this.clickY[i]);
            this.context.closePath();
            this.context.stroke();
        }
    },

    // la fonction qui va effacer le canvas
    clearDraw: function () {
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        this.clickX = [];
        this.clickY = [];
        this.clickDrag = [];
    }
};
