/*====================================*/
/*======= HOME BTN CLICK EVENT =======*/
/*====================================*/

//SELECT ELEMENTS FROM DOM
let homeBtn = document.getElementById("magic-btn");


//Add click event to homeBtn
homeBtn.addEventListener("click", () => {
    window.location.replace("index.html");
})
