"use strict";
var slides = ["url1", "url2"];
var slideIndex = 1;
showSlides(slideIndex);

 
// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1} 
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none"; 
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block"; 
  dots[slideIndex-1].className += " active";
} 

document.addEventListener("keydown", function(e){
  if(e.keyCode === 37){
      slides[slideIndex-1];
      //change img src attribut url

  }
  else if(e.keyCode === 39){
      slides[slideIndex+1]();
        //change img src attribut url
  }
  });
  