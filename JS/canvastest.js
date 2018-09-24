window.addEventListener('load', function () {
    Canvas.init();
});

var Canvas = {
    canvas: null,
    context: null,
    line: [],
    clickDrag: [],
    clickX: [],
    clickY: [],
    paint: false,
    init: function () {

        var that = this;
        this.canvas = document.getElementById('canvasWindow');
        this.context = this.canvas.getContext('2d');

        this.canvas.addEventListener('mousedown', function (e) {
            var mouseX = e.pageX - this.offsetLeft;
            var mouseY = e.pageY - this.offsetTop;
            that.paint = true;
            that.storeMouseClick(mouseX, mouseY);
            that.draw();
        });

        // this.canvas.addEventListener('mouseup', function () {
        //     that.paint = false;
        // });

        function mouseUp() {
            this.paint = false;
        }

        let mouseUpBind = mouseUp.bind(this);

        this.canvas.addEventListener('mouseup', mouseUpBind);

        this.canvas.addEventListener('mouseup', function (e) {
            that.draw(e.pageX, e.pageY);
        });

        this.canvas.addEventListener('mousemove', function (e) {
            if (that.paint === true) {
                that.storeMouseClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
                that.draw();
            }
        });

        document.getElementById('clearCanvasBtn').addEventListener('click', function () {
            that.clearDraw();
        });

        document.getElementById('submitCanvasBtn').addEventListener('click', function () {
        });
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
