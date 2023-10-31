/*====================================*/
/*============= HAMBURGER ============*/
/*====================================*/

/*SELECT ELEMENTS FROM DOM*/
const hamburgerContainer = document.getElementById("hamburger-container");
const movingRectangleInHamburger = document.querySelector(".rectB");


/*===== ANIMATION OF HAMBURGER =====*/

/*ANIMATE HAMBURGER BY ADDING IT A NEW CSS-CLASS, ON HOVER OF PARENT*/
hamburgerContainer.addEventListener("mouseover", function () {
    movingRectangleInHamburger.classList.add("slide-rectB-to-the-right");
});

/*===== ON CLICK OF HAMBURGER =====*/
