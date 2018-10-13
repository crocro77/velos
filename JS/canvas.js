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
        this.context.strokeStyle = "#000";
        this.context.lineJoin = "round";
        this.context.lineWidth = 3;

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

        let touchStartBind = this.touchStart.bind(this);
        this.canvas.addEventListener('touchstart', touchStartBind);

        let touchMoveBind = this.touchMove.bind(this);
        this.canvas.addEventListener("touchmove", touchMoveBind);

        let touchEndBind = this.touchEnd.bind(this);
        this.canvas.addEventListener("touchend", touchEndBind);
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

    // les fonctions qui gèrent les différentes intéractions tactiles sur le canvas
    touchStart: function (e) {
        e.preventDefault();
        var touch = e.touches[0];
        var touchpos = this.getTouchPos(this.canvas,touch);
        this.mouseDown(touch);
    },

    touchMove: function (e) {
        e.preventDefault();
        var touch = e.touches[0];
        var touchpos = this.getTouchPos(this.canvas,touch);
        this.mouseMoveEvent(touch);
    },

    touchEnd: function (e) {
        e.preventDefault();
        var mouseEvent = new MouseEvent("mouseup", {});
        this.canvas.dispatchEvent(mouseEvent);
    },

    // la fonction pour effacer le canvas avec le bouton effacer
    clearCanvasButton: function () {
        this.clearDraw();
    },

    // la fonction qui ajoute les clic et les déplacements de la souris sur le canvas
    storeMouseClick: function (x, y, dragging) {
        this.clickX.push(x);
        this.clickY.push(y);
        this.clickDrag.push(dragging);
    },

    // la fonction qui obtient la position du tactile
    getTouchPos: function (canvasDom, touchEvent) {
        var rect = canvasDom.getBoundingClientRect();
            return {
                clientX: touchEvent.clientX - rect.left,
                clientY: touchEvent.clientY - rect.top
        };
    },

    // la fonction qui permet de 'dessiner' sur le canvas
    draw: function (mouseX, mouseY) {
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
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