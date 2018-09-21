var Canvas = {
    init: function () {

        var that = this;

        this.canvas = document.getElementById('canvasWindow');
        this.context = this.canvas.getContext('2d');
        this.paint = false;

        window.addEventListener('mousedown', function () {
            that.paint = true;
        });
        window.addEventListener('mouseup', function () {
            that.paint = false;
        });

        this.canvas.addEventListener('mousedown', function (e) {
            that.draw(e.pageX, e.pageY);
        });
        this.canvas.addEventListener('mouseup', function (e) {
            that.draw(e.pageX, e.pageY);
        });
        this.canvas.addEventListener('mousemove', function (e) {
            if (that.paint === true) {
                that.draw(e.pageX, e.pageY);
            }
        });

        document.getElementById('clearCanvasBtn').addEventListener('click', function () {
            that.clearDraw;
        });

        document.getElementById('submitCanvasBtn').addEventListener('click', function () {
            window.location = that.toDataURL("image/png");
        });
    },

    draw: function (mouseX, mouseY) {

        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height); // Clears the canvas
        this.context.strokeStyle = "#000";
        this.context.lineJoin = "round";
        this.context.lineWidth = 5;

        for (var i = 0; i < mouseX.length; i++) {
            this.context.beginPath();
            if (this.clickDrag[i] && i) {
                this.context.moveTo(mouseX[i - 1], mouseY[i - 1]);
            } else {
                this.context.moveTo(mouseX[i] - 1, mouseY[i]);
            }
            this.context.lineTo(mouseX[i], mouseY[i]);
            this.context.closePath();
            this.context.stroke();
        }
    },

    clearDraw: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
};

window.addEventListener('load', function () {
    Canvas.init();
});