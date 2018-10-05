"use strict";

window.addEventListener('load', function () {
    Canvas.init();
});

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

    clearCanvasButton: function (){
        this.clearDraw();
    },

    storeMouseClick: function (x, y, dragging) {
        this.clickX.push(x);
        this.clickY.push(y);
        this.clickDrag.push(dragging);
    },

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

    clearDraw: function () {
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height); // Clears the canvas
        this.clickX = [];
        this.clickY = [];
        this.clickDrag = [];
    }
};
