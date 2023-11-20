/*====================================*/
/*======= HOME BTN CLICK EVENT =======*/
/*====================================*/

//SELECT ELEMENTS FROM DOM
let homeBtn = document.getElementById("magic-btn");


//Add click event to homeBtn
homeBtn.addEventListener("click", () => {
    window.location.replace("index.html");
});


/*=====================================*/
/*======== WEB STORAGE BUTTONS ========*/
/*=====================================*/

// Select elements from the DOM
const blueBrownThemeBtn = document.querySelector(".first-theme-container");
const martiniqueSeaPinkThemeBtn = document.querySelector(".second-theme-container");
const background = document.querySelector(".top-or-left-intro-container");
const gitLogo = document.querySelector(".git-logo-svg");
const pageTitle = document.querySelector(".page-title");
const aboutBtn = document.querySelector(".about-container p");
const magicBtnContainer = document.querySelector(".magic-btn");
const magicBtn = document.querySelector(".magic-btn svg");
const punchlineContainer = document.querySelector(".punchline-container");
const punchline = document.getElementById("punchline-svg");
const content = document.querySelector(".bottom-or-right-container");
const body = document.querySelector("body");


blueBrownThemeBtn.addEventListener("click", function () {

    //Change all page colors to blueBrown theme
    background.style.background = "#ABAFC7";
    gitLogo.style.fill = "#3A3320";
    blueBrownThemeBtn.style.background = "#3A3320";
    martiniqueSeaPinkThemeBtn.style.background = "#3A3320";
    pageTitle.style.color = "#3A3320";
    aboutBtn.style.color = "#3A3320";
    magicBtnContainer.style.borderColor = "#3A3320";
    magicBtn.style.stroke = "#3A3320";
    punchline.style.fill = "#3A3320";
    content.style.background = "#E7B39C";
    punchlineContainer.style.background = "#E7B39C";
    body.style.color = "#3A3320";
    body.style.background = "#E7B39C";

    //Set the three color values in sessionStorage
    sessionStorage.setItem('blueOrMartinique', "#ABAFC7");
    sessionStorage.setItem('brownOrSeaPink', "#3A3320");
    sessionStorage.setItem('brownOrMartinique', "#3A3320");
    sessionStorage.setItem('desertSandOrSeaPink', "#E7B39C");

});

martiniqueSeaPinkThemeBtn.addEventListener("click", function () {

    //Change all page colors to martiniqueSeaPink theme
    background.style.background = "#2E3049";
    gitLogo.style.fill = "#EE9391";
    blueBrownThemeBtn.style.background = "#EE9391";
    martiniqueSeaPinkThemeBtn.style.background = "#EE9391";
    pageTitle.style.color = "#EE9391";
    aboutBtn.style.color = "#EE9391";
    magicBtnContainer.style.borderColor = "#EE9391";
    magicBtn.style.stroke = "#EE9391";
    punchline.style.fill = "#2E3049";
    content.style.background = "#EE9391";
    punchlineContainer.style.background = "#EE9391";
    body.style.color = "#2E3049";
    body.style.background = "#EE9391";

    //Set "two" values in sessionStorage
    sessionStorage.setItem('blueOrMartinique', "#2E3049");
    sessionStorage.setItem('brownOrSeaPink', "#EE9391");
    sessionStorage.setItem('brownOrMartinique', "#2E3049");
    sessionStorage.setItem('desertSandOrSeaPink', "#EE9391");

});

//Get latest values from sessionStorage and apply them
document.addEventListener("DOMContentLoaded", function () {

    // Retrieve values from sessionStorage
    let blueOrMartinique = sessionStorage.getItem('blueOrMartinique');
    let brownOrSeakPink = sessionStorage.getItem('brownOrSeaPink');
    let brownOrMartinique = sessionStorage.getItem('brownOrMartinique');
    let desertSandOrSeaPink = sessionStorage.getItem('desertSandOrSeaPink');

    //Change page theme (colors) according to latest sessionStorage values
    background.style.background = blueOrMartinique;
    gitLogo.style.fill = brownOrSeakPink;
    blueBrownThemeBtn.style.background = brownOrSeakPink;
    martiniqueSeaPinkThemeBtn.style.background = brownOrSeakPink;
    pageTitle.style.color = brownOrSeakPink;
    aboutBtn.style.color = brownOrSeakPink;
    magicBtnContainer.style.borderColor = brownOrSeakPink;
    magicBtn.style.stroke = brownOrSeakPink;
    punchline.style.fill = brownOrMartinique;
    content.style.background = desertSandOrSeaPink;
    punchlineContainer.style.background = desertSandOrSeaPink;
    body.style.color = brownOrMartinique;
    body.style.background = desertSandOrSeaPink;

});
