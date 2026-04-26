// const NextImageDelay = 5000;

function nextImage() {
  slideshowImages[currentImageCounter].style.opacity = 0;
  currentImageCounter = (currentImageCounter+1) % slideshowImages.length;
  slideshowImages[currentImageCounter].style.opacity = 1;
}

const slideshows = document.querySelectorAll(".slideshow");
const NextImageDelay = parseInt(slideshows[0].getAttribute("delay"));
const slideshowImages = document.querySelectorAll(".slideshow img");
let currentImageCounter = 0;
slideshowImages[currentImageCounter].style.opacity = 1;
setInterval(nextImage, NextImageDelay);
