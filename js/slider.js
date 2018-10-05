"use strict";

function init() {
  var sliderInterval;

  // objet slider
  let slider = {
    index: 0,
    images: ['img/slider01.jpg', 'img/slider02.jpg', 'img/slider03.jpg', 'img/slider04.jpg', 'img/slider05.jpg', 'img/slider06.jpg', 'img/slider07.jpg', 'img/slider08.jpg'],
    next: () => {
      if (slider.index + 1 < slider.images.length) {
        slider.index += 1;
        document.getElementById('sliderImage').setAttribute('src', slider.images[slider.index]);
      } else {
        slider.index = 0;
        document.getElementById('sliderImage').setAttribute('src', slider.images[slider.index]);
      }
    },

    previous: () => {
      if (slider.index - 1 >= 0) {
        slider.index -= 1;
        document.getElementById('sliderImage').setAttribute('src', slider.images[slider.index]);
      } else {
        slider.index = slider.images.length - 1;
        document.getElementById('sliderImage').setAttribute('src', slider.images[slider.index]);
      }
    },

    setSliderInterval: function () {
      return setInterval(function () {
        slider.next();
      }, 5000);
    }
  };

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
