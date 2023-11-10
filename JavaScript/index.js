

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
/*==== DROPDOWN MENU ON PAGE LOAD ====*/
/*====================================*/

//SELECT ELEMENTS FROM THE DOM
const dropDownMenuForSearching = document.getElementById("dropdown-menu-search");

//CREAT VARIABLES TO BE USED
let chosenCityID = "";
let stringForPopulatingDropdownWithCityNames = '<option value="">All cities</option>';

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

viewResultsBtn.addEventListener("click", function () {

    chosenCityID = document.getElementById("dropdown-menu-search").value;
    writeCitiesAndElements(chosenCityID);
})


let writeCitiesAndElements = (chosenCityIdInput) => {

    //FETCH FROM CITITES API
    fetch('https://avancera.app/cities/' + chosenCityIdInput)
        .then((response) => response.json())
        .then((result) => {

            if (chosenCityIdInput === "") {

                // Clear the existing content by setting stringForCreatingDynamicDivsInApiContentDiv to an empty string
                stringForCreatingDynamicDivsInApiContentDiv = '';

                // Initialize an array to store promises from getGeoCoordinatesFromCity
                const promises = [];


                for (let i = 0; i < result.length; i++) {
                    // Call method for fetching API to get geo-coordinates
                    const promise = getGeoCoordinatesFromCity(result[i].name)
                        .then((coordinates) => {
                            // Access the latitude and longitude values here
                            const lat = coordinates.lat;
                            const lng = coordinates.lng;

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

                    promises.push(promise);
                }

                // Wait for all promises to resolve before updating the DOM
                Promise.all(promises).then(() => {
                    apiContentDiv.innerHTML = stringForCreatingDynamicDivsInApiContentDiv;
                });

            }
            else {
                // Handle the case when a single city is selected
                const city = result; // Single city object

                // Clear the existing content by setting stringForCreatingDynamicDivsInApiContentDiv to an empty string
                stringForCreatingDynamicDivsInApiContentDiv = '';

                // Fetch geo-coordinates for the selected city
                getGeoCoordinatesFromCity(city.name)
                    .then((coordinates) => {
                        const lat = coordinates.lat;
                        const lng = coordinates.lng;

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

                        apiContentDiv.innerHTML = stringForCreatingDynamicDivsInApiContentDiv;
                    });
            }

        });

}


// Fetch from the Web Quest API and return a promise
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
                // Return an object with lat and lng as undefined
                return { lat: undefined, lng: undefined };
            }
        })
        .catch((error) => {
            console.error("Error occurred while fetching data:", error);
            // Return an object with lat and lng as undefined
            return { lat: undefined, lng: undefined };
        });
}
