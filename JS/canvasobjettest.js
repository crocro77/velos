function CrocSignature(element){	

	// toutes les var suivantes sont private au final
	var $element = $(element);
	var painting = false;
	var context = $element[0].getContext("2d");
	var line = [];	    
	
	$element.mousedown(function (e) {
		painting = true;
		addPoint(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
		draw();
    });
	$element.mousemove(function (e) {
      if (painting) {
        addPoint(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
        draw();
      }
    });
   
    $element.mouseup(function (e) {
      painting = false;
    });
   
    $element.mouseleave(function (e) {
      painting = false;
    });
	
	function addPoint(x, y, dragging) {
      line.push({x:x,y:y,drag:dragging});      
      clickDrag.push(dragging);
    }
   
    function draw() {
      context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
      context.strokeStyle = "#000";
      context.lineJoin = "round";
      context.lineWidth = 5;
	  line.forEach(function(p){
		context.beginPath();
        if (p.drag) {
          context.lineTo(p.x, p.y);
        } else {
          context.moveTo(p.x, p.y);
        }        
        context.closePath();
		context.stroke();
	  });
    }
	
	// en utilisant "this" on expose cette fonction pour clear le canvas
	this.clear = function(){
		line.length=0;
		draw();				
	}
	
	// et celle la pour recup la signature sous forme de points :
	// this.getLine(){
	// 	return line.slice();
	// }
	
	// this.getPNG(){
	// 	// TODO export png
	// }
}

$(document).ready(function () {

	var sig = new CrocSignature('#canvasWindow');
    $("#clearCanvasBtn").click(function() {
		sig.clear();
	})
	// .... sig.getPNG();
});