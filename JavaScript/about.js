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
const blueBrownThemeBtn = document.querySelector(".first-theme-container");
const martiniqueSeaPinkThemeBtn = document.querySelector(".second-theme-container");

blueBrownThemeBtn.addEventListener("click", function () {

    alert("yaaay")
});

martiniqueSeaPinkThemeBtn.addEventListener("click", function () {

    alert("yaay")
});
