/*====================================*/
/*======= HOME BTN CLICK EVENT =======*/
/*====================================*/

//SELECT ELEMENTS FROM DOM
let homeBtn = document.getElementById("magic-btn");


//Add click event to homeBtn
homeBtn.addEventListener("click", () => {
    window.location.replace("index.html");
})


/*=====================================*/
/*======== WEB STORAGE BUTTONS ========*/
/*=====================================*/

// Select elements from the DOM
const firstThemeBtn = document.querySelector(".first-theme-container");
const secondThemeBtn = document.querySelector(".second-theme-container");
const backGround = document.querySelector(".top-or-left-intro-container");
const foreGround = document.querySelector(".top-or-left-intro-wrapper");
