"use strict";

window.addEventListener('load', function () {
    // on initialise les méthodes qui sont dans la fonction init l'objet Canvas
    Canvas.init();
});

// objet Canvas
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

        let mouseDownBind = this.mouseDown.bind(this);
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

        // TEST TOUCH //
        // configurations des événèments touch
        this.canvas.addEventListener("touchstart", function (e) {
            var touch = e.touches[0];
            var mouseEvent = new MouseEvent("mousedown", {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            canvas.dispatchEvent(mouseEvent);
        }, false),

        this.canvas.addEventListener("touchmove", function (e) {
            var touch = e.touches[0];
            var mouseEvent = new MouseEvent("mousemove", {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            canvas.dispatchEvent(mouseEvent);
        }, false),

        this.canvas.addEventListener("touchend", function (e) {
            var mouseEvent = new MouseEvent("mouseup", {});
            canvas.dispatchEvent(mouseEvent);
        }, false),

        // la fonction qui obtient la position du toucher
        function getMousePos(canvasDom, touchEvent) {
            var rect = canvasDom.getBoundingClientRect();
            return {
                x: touchEvent.touches[0].clientX - rect.left,
                y: touchEvent.touches[0].clientY - rect.top
            };
        },

        // empêche le scrolling quand on touche le canvas
        document.body.addEventListener("touchmove", function (e) {
            if (e.target == canvas) {
                e.preventDefault();
                }
        }, false);
    },

    // les fonctions qui gèrent les différentes interactions de la souris sur le canvas
    mouseDown: function (e) {
        let mouseX = e.pageX - this.offsetLeft;
        let mouseY = e.pageY - this.offsetTop;
        this.paint = true;
        this.storeMouseClick(mouseX, mouseY);
        this.draw();
    },

    mouseUp: function () {
        this.paint = false;
    },

    mouseUpEvent: function (e) {
        this.draw(e.pageX, e.pageY);
    },

    mouseMoveEvent: function (e) {
        if (this.paint === true) {
            this.storeMouseClick(e.pageX - this.canvas.offsetLeft, e.pageY - this.canvas.offsetTop, true);
            this.draw();
        }
    },

    // la fonction du bouton Effacer du panneau du canvas
    clearCanvasButton: function () {
        this.clearDraw();
    },

    // la fonction qui ajoute les clic et les déplacements de la souris sur le canvas
    storeMouseClick: function (x, y, dragging) {
        this.clickX.push(x);
        this.clickY.push(y);
        this.clickDrag.push(dragging);
    },

    // la fonction qui permet de 'dessiner' sur le canvas
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

    // la fonction qui efface le canvas
    clearDraw: function () {
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height); // Clears the canvas
        this.clickX = [];
        this.clickY = [];
        this.clickDrag = [];
    },
}

