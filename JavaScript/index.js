

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

    console.log(topPosY);

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
            // console.log(stringForPopulatingDropdownWithCityNames);

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
                    const promiseForGeo = getGeoCoordinatesFromCity(result[i].name)
                        .then((coordinates) => {
                            //Store lat and lang in temp variables
                            const lat = coordinates.lat;
                            const lng = coordinates.lng;

                            //Append data in string used for creating dynamic divs
                            stringForCreatingDynamicDivsInApiContentDiv += `
                                <div class="dynamic-div-container">
                                    <div class="dynamic-div-wrapper">
                                        <h2>${result[i].name}</h2>
                                        <p>Population: ${result[i].population}</p>
                                        <div class="geo-coordinates-container">
                                            <p>Latitude: ${lat}</p>
                                            <p>Longitude: ${lng}</p>
                                        </div>
                                        <div class="dynamic-btn-container">
                                                <div id="change-btn"></div>
                                                <div id="delete-btn"></div>
                                        </div>
                                    </div>
                                </div>
                            `;
                        });

                    //Store every promise inside of all promises array
                    promises.push(promiseForGeo);
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
                const promiseForCityDescription = getCityDescription(city.name)


                // Clear the existing content by setting stringForCreatingDynamicDivsInApiContentDiv to an empty string
                stringForCreatingDynamicDivsInApiContentDiv = '';

                // Fetch geo-coordinates for the selected city
                getGeoCoordinatesFromCity(city.name)
                    .then((coordinates) => {
                        const lat = coordinates.lat;
                        const lng = coordinates.lng;

                        //Put data in string used for creating a dynamic div
                        stringForCreatingDynamicDivsInApiContentDiv = `
                            <div>
                                <h2>${city.name}</h2>
                                <p>Population: ${city.population}</p>
                                <div>
                                    <p>Latitude: ${lat}</p>
                                    <p>Longitude: ${lng}</p>
                                </div>
                            </div>
                        `;

                        //Add a dynamic div based on data in string variable
                        apiContentDiv.innerHTML = stringForCreatingDynamicDivsInApiContentDiv;
                    });
            }

        });

}


//Fetch data from WebQuest API and return a promise
function getGeoCoordinatesFromCity(selectedCityNameInput) {
    return fetch('https://www.mapquestapi.com/geocoding/v1/address?key=eKH0ZMAEGWKaibhVOrRQftMpmBMpFcLT&location=' + selectedCityNameInput)
        .then((response) => response.json())
        .then((resultWebQuest) => {

            //If request is successful (statuscode === 0), store lat and lng and return an object
            if (resultWebQuest.info.statuscode === 0) {
                const lat = resultWebQuest.results[0].locations[0].latLng.lat;
                const lng = resultWebQuest.results[0].locations[0].latLng.lng;

                // Return an object with lat and lng
                return { lat, lng };
            } else {
                console.log("API request failed with status code: " + resultWebQuest.info.statuscode);
                //Return an object with lat and lng as undefined
                return { lat: undefined, lng: undefined };
            }
        })
        .catch((error) => {
            console.error("Error occurred while fetching data:", error);
            //Return an object with lat and lng as undefined
            return { lat: undefined, lng: undefined };
        });
}


//Fetch data from WikiMedia API and return a promise
function getCityDescription(cityNameInput) {

    console.log(cityNameInput + "yaaay");
}
