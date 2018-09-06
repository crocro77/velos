"use strict";

function init() {

  var slider = {
    index: 0,
    images: ['img/slider1.jpg', 'img/slider2.jpg', 'img/slider3.jpg'],
    next: function () {
      if (slider.index + 1 < slider.images.length) {

        slider.index += 1;
        document.getElementById('sliderImage').setAttribute('src', slider.images[slider.index]);

      }

    },
    previous: function () {
      if (slider.index - 1 >= 0) {

        slider.index -= 1;
        document.getElementById('sliderImage').setAttribute('src', slider.images[slider.index]);
      }
    }
  };

  document.getElementById("previous").onclick = slider.previous;
  document.getElementById("next").onclick = slider.next;


  document.addEventListener("keydown", function (e) {
    if (e.keyCode === 37) {

      slider.previous();

    }
    else if (e.keyCode === 39) {
      slider.next();

    }
  });

}