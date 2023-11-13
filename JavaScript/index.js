

/*=====================================*/
/*====== ANIMATION OF FORMS MENU ======*/
/*=====================================*/

//SELECT ELEMENTS FROM DOM
const magicBtn = document.getElementById("magic-btn-wrapper");
const formsMenu = document.getElementById("forms-menu-container");

//Boolean to regulate if forms-menu is visible or not
let isFormsMenuVisible = false;

//Add new class (for animation) to forms-menu, on click-event
magicBtn.addEventListener("click", function () {

    if (isFormsMenuVisible === false) {
        formsMenu.classList.remove("class-for-sliding-forms-menu-container-down");
        formsMenu.classList.add("class-for-sliding-forms-menu-container-up");
        isFormsMenuVisible = true;
    }
    else {
        formsMenu.classList.remove("class-for-sliding-forms-menu-container-up");
        formsMenu.classList.add("class-for-sliding-forms-menu-container-down");
        isFormsMenuVisible = false;
    }

})


/*====================================*/
/*===== API CONTENT TOP POSITION =====*/
/*====================================*/

//RESIZE EVENT CALLS A METHOD WHICH UPDATES HEIGHT FOR API-CONTENT
window.onresize = function () {
    updateTopOfDiv();
}

function updateTopOfDiv() {
    const container = document.getElementById("punchline-container");
    const rect = container.getBoundingClientRect();
    let topPosY = rect.bottom;

    if (document.documentElement.clientWidth >= 769) {
        // apiContentDiv.style.marginTop = `${topPosY}px`;
        apiContentDiv.style.paddingTop = `${topPosY}px`;
    }
    else {
        // apiContentDiv.style.marginTop = `0px`;
        apiContentDiv.style.paddingTop = `0px`;
    }

}


/*====================================*/
/*==== DROPDOWN MENU ON PAGE LOAD ====*/
/*====================================*/

//SELECT ELEMENTS FROM THE DOM
const dropDownMenuForSearching = document.getElementById("dropdown-menu-search");

//CREAT VARIABLES TO BE USED
let chosenCityID = "";
let stringForPopulatingDropdownWithCityNames = '<option value="">All cities</option>';

//ON PAGE RELOAD CALL METHOD WHICH UPDATES DROPDOWN MENU
document.addEventListener("DOMContentLoaded", function () {

    //Call funtions that calls all citites
    callCitiesOnPageLoad();
});


let callCitiesOnPageLoad = () => {

    fetch("https://avancera.app/cities/")
        .then((response) => response.json())
        .then((result) => {

            for (let i = 0; i < result.length; i++) {
                stringForPopulatingDropdownWithCityNames += `
                    <option value="${result[i].id}">${result[i].name}</option>
                `;
            }

            dropDownMenuForSearching.innerHTML = stringForPopulatingDropdownWithCityNames;

        });

}


/*=======================================*/
/*== VIEW CITIES ON CLICK OF VIEW BTN ===*/
/*=======================================*/

//SELECT ELEMENTS FROM DOM
const viewResultsBtn = document.getElementById("view-results-btn");
const apiContentDiv = document.getElementById("api-content");

//Variable used for retrieving geo coordinates
let geoCoordinates;

//CREATE VARIABLE FOR USE
let stringForCreatingDynamicDivsInApiContentDiv = "";
let chosenCityByName;

//Call method that writes citites and creates dynamic divs, on click of view btn
viewResultsBtn.addEventListener("click", function () {

    //Ensure api-content has accurate posY by calling updateTopOfDIv
    if (document.documentElement.clientWidth >= 769) {
        updateTopOfDiv();
    }

    //Store chosen value/city from dropdown, in a variable
    chosenCityID = document.getElementById("dropdown-menu-search").value;

    //Send chosen city to method that fetches data for that city
    writeCitiesAndElements(chosenCityID);
})

//Fetch info from API´s and write it in dynamics html-elements
let writeCitiesAndElements = (chosenCityIdInput) => {

    //FETCH FROM CITITES API (avancera.app)
    fetch('https://avancera.app/cities/' + chosenCityIdInput)
        .then((response) => response.json())
        .then((result) => {

            //If "All Cities" input is chosen generate all data/info
            if (chosenCityIdInput === "") {

                // Clear the existing content by setting stringForCreatingDynamicDivsInApiContentDiv to an empty string
                stringForCreatingDynamicDivsInApiContentDiv = '';

                // Initialize an array to store promises from getGeoCoordinatesFromCity
                const promises = [];

                //For every city (i) in the Cities API
                for (let i = 0; i < result.length; i++) {

                    //Call method for fetching geo-coordinates from MapQuest API
                    const promiseForCitySummary = getCitySummary(result[i].name)
                        .then((citySummaryObject) => {
                            //Store lat and lang in temp variables
                            const cityPage = citySummaryObject.page;
                            const lat = citySummaryObject.lat;
                            const lon = citySummaryObject.lon;
                            const cityExtract = citySummaryObject.description;

                            //NOT USED YET
                            const thumbnail = citySummaryObject.thumbnail;
                            const originalImage = citySummaryObject.originalImage;

                            //Append data in string used for creating dynamic divs
                            stringForCreatingDynamicDivsInApiContentDiv += `

                                <div class="every-city-container">
                                    <h2><a href="${cityPage}"  target="_blank">${result[i].name}</a></h2>
                                    <p>Population: ${result[i].population}</p>
                                    <div>
                                        <p>Latitude: ${lat}</p>
                                        <p>Longitude: ${lon}</p>
                                        <div id="learn-more-container">
                                            <div id="learn-more-wrapper">
                                                <p>Learn more</p>
                                                <div id="expand-btn-container">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3A3320" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div>
                                                <p class="city-description">${cityExtract}</p>
                                            </div>
                                        </div>
                                        <div class="change-delete-btn-container">
                                            <button id="change-btn">Change</button>
                                            <button id="delete-btn">Delete</button>
                                        </div>
                                    </div>
                                </div>


                            `;
                        });

                    //Store every promise inside of all promises arrayp
                    promises.push(promiseForCitySummary);
                }

                // Wait for all promises to resolve before updating the DOM
                Promise.all(promises).then(() => {
                    apiContentDiv.innerHTML = stringForCreatingDynamicDivsInApiContentDiv;
                });

            }
            //If a specific city is chosen in the dropdown menu
            else {
                // Handle the case when a single city is selected
                const city = result; // Single city object

                //Call method for fetching city description from WikiMedia API
                getCitySummary(city.name)
                    .then((citySummaryObject) => {
                        const cityPage = citySummaryObject.page;
                        const lat = citySummaryObject.lat;
                        const lon = citySummaryObject.lon;
                        const cityExtract = citySummaryObject.description;

                        //NOT USED YET
                        const thumbnail = citySummaryObject.thumbnail;
                        const originalImage = citySummaryObject.originalImage;


                        /*========================================*/
                        /*=== ACCTUAL CREATION OF DYNAMIC DIVS ===*/
                        /*========================================*/

                        // Clear the existing content by setting stringForCreatingDynamicDivsInApiContentDiv to an empty string
                        stringForCreatingDynamicDivsInApiContentDiv = '';


                        //Put data in string used for creating a dynamic div
                        stringForCreatingDynamicDivsInApiContentDiv = `
                            <div class="every-city-container">
                                <h2><a href="${cityPage}"  target="_blank">${city.name}</a></h2>
                                <p>Population: ${city.population}</p>
                                <div>
                                    <p>Latitude: ${lat}</p>
                                    <p>Longitude: ${lon}</p>
                                    <div id="learn-more-container">
                                        <div id="learn-more-wrapper">
                                            <p>Learn more</p>
                                            <div id="expand-btn-container">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3A3320" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/>
                                                </svg>
                                            </div>
                                        </div>
                                        <div>
                                            <p class="city-description">${cityExtract}</p>
                                        </div>
                                    </div>
                                    <div class="change-delete-btn-container">
                                        <button id="change-btn">Change</button>
                                        <button id="delete-btn">Delete</button>
                                    </div>
                                </div>
                            </div>
                        `;

                        //Add a dynamic div based on data in string variable
                        apiContentDiv.innerHTML = stringForCreatingDynamicDivsInApiContentDiv;


                    })



            }

        });

}


//Fetch data from WikiMedia API and return a promise
function getCitySummary(cityNameInput) {

    //Set fetch adress (en or sv) depending on language you want to generate
    return fetch('https://sv.wikipedia.org/api/rest_v1/page/summary/' + cityNameInput)
        .then((responseFromWikiMedia) => responseFromWikiMedia.json())
        .then((resultWikiMedia) => {

            //Find documentation to set up if status code successful or not

            //Store objects keys/property-values in variables
            const lat = resultWikiMedia.coordinates.lat;
            const lon = resultWikiMedia.coordinates.lon;
            const description = resultWikiMedia.extract;
            const page = resultWikiMedia.content_urls.desktop.page;
            const thumbnail = resultWikiMedia.thumbnail.source;
            const originalImage = resultWikiMedia.originalimage.source;

            //Return variables from fetch
            return { page, lat, lon, description, thumbnail, originalImage };
        });


}
