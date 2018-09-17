function signatureCanvas(element) {
    var $element = $(element);
    var paint = false;
    var context = $element[0].getContext("2d");
    var line = [];
    var clickDrag = [];
    var clickX = [];
    var clickY = [];

    $element.mousedown(function (e) {
        var mouseX = e.pageX - this.offsetLeft;
        var mouseY = e.pageY - this.offsetTop;
        paint = true;
        addClick(mouseX, mouseY);
        draw();
    });

    $element.mousemove(function (e) {
        if (paint) {
            addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
            draw();
        }
    });

    $element.mouseup(function (e) {
        paint = false;
    });

    $element.mouseleave(function (e) {
        paint = false;
    });

    function addClick(x, y, dragging) {
        clickX.push(x);
        clickY.push(y);
        clickDrag.push(dragging);
    }

    function draw() {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
        context.strokeStyle = "#000";
        context.lineJoin = "round";
        context.lineWidth = 5;

        for (var i = 0; i < clickX.length; i++) {
            context.beginPath();
            if (clickDrag[i] && i) {
                context.moveTo(clickX[i - 1], clickY[i - 1]);
            } else {
                context.moveTo(clickX[i] - 1, clickY[i]);
            }
            context.lineTo(clickX[i], clickY[i]);
            context.closePath();
            context.stroke();
        }
    }

    this.clear = function () {
        line.length = 0;
        draw();
    }

    $("#clearCanvasBtn").click(function() {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
        clickX = [];
        clickY = [];
        clickDrag = [];
      });
}

$(document).ready(function () {
    var sign = new signatureCanvas('#canvasWindow');
    $('#clearCanvasBtn').click(function () {
        sign.clear();
    })
});