"use strict";

function init() {

  let slider = {
    index: 0,
    images: ['img/slider01.jpg', 'img/slider02.jpg', 'img/slider03.jpg', 'img/slider04.jpg', 'img/slider05.jpg', 'img/slider06.jpg', 'img/slider07.jpg', 'img/slider08.jpg'],
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

  let sliderInterval = setInterval(function () {
    slider.next();
  }, 5000);

  document.addEventListener("keydown", function (e) {
    if (e.keyCode === 37) {
      slider.previous();
    }
    else if (e.keyCode === 39) {
      slider.next();
    }
    // else if (e.keyCode === 80) {
    //   clearInterval(sliderInterval);
    // }
    // else if (e.keyCode === 67) {
    //   if (!sliderInterval) slider.next();
    // }
  });

  document.addEventListener("mouseover", function (e) {
    if (e.type == "mouseover") {
      clearInterval(sliderInterval);
    } else {
      slider.next();
    }
  });
}
