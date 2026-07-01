// const NextImageDelay = 5000;

function nextImage() {
  carouselImages[currentImageCounter].style.opacity = 0;
  currentImageCounter = (currentImageCounter+1) % carouselImages.length;
  carouselImages[currentImageCounter].style.opacity = 1;
}

const carousels = document.querySelectorAll(".carousel");
const NextImageDelay = parseInt(carousel[0].getAttribute("delay"));
const carouselImages = document.querySelectorAll(".carousel img");
let currentImageCounter = 0;
carouselImages[currentImageCounter].style.opacity = 1;
setInterval(nextImage, NextImageDelay);
