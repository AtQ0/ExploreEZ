

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

    //Call BoundingClientRect function for container and store it in variable rect
    const rect = container.getBoundingClientRect();

    //Get distance from top of viewport to bottom of rect
    let topPosY = rect.bottom;

    //If above 769vw, ensure apiContentDiv has a top which is punchlines bottom
    if (document.documentElement.clientWidth >= 769) {
        // apiContentDiv.style.marginTop = `${topPosY}px`;
        apiContentDiv.style.paddingTop = `${topPosY}px`;
    }
    //If beneath 769vw let apiContentDiv have its top as 0
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
let stringForPopulatingDropdownWithCityNames;

//ON PAGE RELOAD CALL METHOD WHICH UPDATES DROPDOWN MENU
document.addEventListener("DOMContentLoaded", function () {

    //Clear all input fields
    document.getElementById("input-for-city-tbx").value = "";
    document.getElementById("input-for-pop-tbx").value = "";
    document.getElementById("below500-cbx").checked = false;
    document.getElementById("above500-cbx").checked = false;

    //Call funtions that calls all citites
    callCitiesOnPageLoad();
});

//Update drop-down menu with all values on Cities server
let callCitiesOnPageLoad = () => {

    //Reset string (with default value) for creating slect elements on every call
    stringForPopulatingDropdownWithCityNames = '<option value="">All cities</option>';

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


/*============================*/
/*======== CHECKBOXES ========*/
/*============================*/

/*WORKS; HOWEVER THIS LOGIC HAS NOT BEEN APPLIED ON THE FETCH YET*/

//Select elements from DOM
let below500Cbx = document.getElementById("below500-cbx");
let above500Cbx = document.getElementById("above500-cbx");
let areNoCbxChecked = true;

below500Cbx.addEventListener("click", function () {
    //If below500 if checked
    if (below500Cbx.checked) {
        console.log("below500 is checked");
        //Uncheck above500
        above500Cbx.checked = false;
        areNoCbxChecked.checked = false;
    }
    else if (!above500Cbx.checked && !below500Cbx.checked) {
        console.log("both checkboxes are unchecked")
        areNoCbxChecked.checked = true;
    }
});

above500Cbx.addEventListener("click", function () {

    if (above500Cbx.checked) {
        console.log("above500 is checked")
        below500Cbx.checked = false;
        areNoCbxChecked = false;
    }
    else if (!above500Cbx.checked && !below500Cbx.checked) {
        console.log("both checkboxes are unchecked")
        areNoCbxChecked.checked = true;
    }
});


/*=======================================*/
/*== VIEW CITIES ON CLICK OF VIEW-BTN ===*/
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

    //Scroll page to top on every btn click
    window.scrollTo(0, 0);

    //Store chosen value/city from dropdown, in a variable
    chosenCityID = document.getElementById("dropdown-menu-search").value;

    //Send chosen city to method that fetches data for that city
    showCitiesAndElements(chosenCityID);
})

//Fetch info from API´s and write it in dynamics html-elements
let showCitiesAndElements = (chosenCityIdInput) => {

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

                    //Call method for fetching data from wikieMedia API
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
                                <div class="every-city-container every-city-container${i}">
                                    <div class="city-header-and-expand-edit-controls-for-name-btn-container">
                                        <h2 class="cityNameH2${i}"><a href="${cityPage}" target="_blank">${result[i].name}</a></h2>
                                        <div class="expand-edit-controls-for-name-btn-container">
                                            <svg class="expand-edit-controls-for-city-name-btn" data-city-index="${i}" onclick="expandEditControlsForCityName(this)" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                                fill="none" stroke="#3A3320" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path>
                                                <polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon>
                                            </svg>
                                        </div>
                                    </div>
                                    <div class="edit-name-controls-container edit-name-controls-container${i}">
                                        <input class="city-name-tbx city-name-tbx${i}" type="text" placeholder="Write new city name">
                                        <div class="city-name-edit-btns-container city-name-edit-btns-container${i}">
                                            <button class="save-city-name-btn save-city-name-btn${i}" data-city-index="${i}" data-city-name="${result[i].name}" data-city-id="${result[i].id}" data-city-population="${result[i].population}" onclick="saveNewCityName(this)">Save</button>
                                            <button class="cancle-city-name-btn cancle-city-name-btn${i}" data-city-index="${i}" onclick="cancleAddingNewCityName(this)">Cancle</button>
                                        </div>
                                    </div>
                                    <p>Population: ${result[i].population}</p>
                                    <div>
                                        <p>Latitude: ${lat}</p>
                                        <p>Longitude: ${lon}</p>
                                        <div id="learn-more-container">
                                            <div id="learn-more-wrapper">
                                                <p>Learn more</p>
                                                <div id="expand-btn-container">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3A3320" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div>
                                                <p class="city-description">${cityExtract}</p>
                                            </div>
                                        </div>
                                        <div class="edit-delete-btn-container">
                                            <button class="delete-btn" id="delete-btn" data-city-index="${i}" data-city-id="${result[i].id}" onclick="removeCity(this)">Delete</button>
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

                        //Variable used for keeping track of chosen city

                        //Put data in string used for creating a dynamic div
                        stringForCreatingDynamicDivsInApiContentDiv = `
                            <div class="every-city-container every-city-container-singleCity">
                                <h2><a href="${cityPage}"  target="_blank">${city.name}</a></h2>
                                <p>Population: ${city.population}</p>
                                <div>
                                    <p>Latitude: ${lat}</p>
                                    <p>Longitude: ${lon}</p>
                                    <div id="learn-more-container">
                                        <div id="learn-more-wrapper">
                                            <p>Learn more</p>
                                            <div id="expand-btn-container">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3A3320" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/>
                                            </svg>
                                            </div>
                                        </div>
                                        <div>
                                            <p class="city-description">${cityExtract}</p>
                                        </div>
                                    </div>
                                    <div class="edit-delete-btn-container">
                                        <button class="edit-btn" id="edit-btn">edit</button>
                                        <button class="delete-btn" id="delete-btn" data-city-index="singleCity" data-city-id="${result.id}" data-city-name="${result.name}" onclick="removeCity(this)">Delete</button>
                                    </div>
                                </div>
                            </div>
                        `;

                        //Add a dynamic div based on data in string variable
                        apiContentDiv.innerHTML = stringForCreatingDynamicDivsInApiContentDiv;
                    })

            }

            //Update dropdown menu after every view/btn-click of results
            callCitiesOnPageLoad();

        });

}


//Fetch data from WikiMedia API and return a promise
function getCitySummary(cityNameInput) {

    //Set fetch adress (en or sv) depending on language you want to generate
    return fetch('https://sv.wikipedia.org/api/rest_v1/page/summary/' + cityNameInput)
        .then((responseFromWikiMedia) => responseFromWikiMedia.json())
        .then((resultWikiMedia) => {

            //If fetch is successful, return fetched values
            if (resultWikiMedia && resultWikiMedia.coordinates && resultWikiMedia.extract && resultWikiMedia.content_urls) {

                //Store objects keys/property-values in variables
                const lat = resultWikiMedia.coordinates.lat;
                const lon = resultWikiMedia.coordinates.lon;
                const description = resultWikiMedia.extract;
                const page = resultWikiMedia.content_urls.desktop.page;
                const thumbnail = resultWikiMedia.thumbnail.source;
                const originalImage = resultWikiMedia.originalimage.source;

                //Return variables from fetch
                return { page, lat, lon, description, thumbnail, originalImage };

            }
            //If any prorerty from the fetch is not successful, return object with undefined values
            else {
                return {
                    page: undefined,
                    lat: undefined,
                    lon: undefined,
                    description: undefined,
                    thumbnail: undefined,
                    originalImage: undefined
                };

            }

        });


}


/*===============================*/
/*=========== ADD CITY ==========*/
/*===============================*/

//SELECT ELEMENTS FROM DOM
const addNewCityBtn = document.getElementById('add-new-city-btn');
const inputForCityNameTbx = document.getElementById('input-for-city-tbx');
const inputForCityPopTbx = document.getElementById('input-for-pop-tbx');
const inputErrorMessageDiv = document.getElementById('error-message');

addNewCityBtn.addEventListener('click', function () {

    //if city input tbx is empty
    if (inputForCityNameTbx.value === "" && inputForCityPopTbx.value !== "") {
        inputErrorMessageDiv.innerText = "*Please write a city name.";
        inputForCityNameTbx.classList.add("error-border");
        inputForCityPopTbx.classList.remove('error-border');
    }
    //if population input tbx is empty
    else if (inputForCityPopTbx.value === "" && inputForCityNameTbx.value !== "") {
        inputErrorMessageDiv.innerText = "*Please write a city population.";
        inputForCityPopTbx.classList.add('error-border');
        inputForCityNameTbx.classList.remove('error-border')

    }
    //If none of the input tbx have values in them
    else if (inputForCityNameTbx.value === "" || inputForCityPopTbx.value === "") {
        inputForCityNameTbx.classList.add("error-border");
        inputForCityPopTbx.classList.add('error-border');
        inputErrorMessageDiv.innerText = "*Please write a city and it's population.";
    }
    //If both input tbx have values in them
    else {

        //Remove error-borders at first
        inputForCityNameTbx.classList.remove('error-border');
        inputForCityPopTbx.classList.remove('error-border');

        //Variable containing regex for checking if letters (swe & eng)
        const regexForSWEandENGLetters = /^[a-zA-ZåäöÅÄÖ]+$/u;

        let valueFromCityTbx = inputForCityNameTbx.value;

        //If city name input contains anything else but letters, and population is numbers
        if (!valueFromCityTbx.match(regexForSWEandENGLetters) && isNaN(inputForCityPopTbx.value) === false) {
            inputErrorMessageDiv.innerText = "*City name can only contain letters";
            inputForCityNameTbx.classList.add("error-border");
            inputForCityPopTbx.classList.remove('error-border');
        }
        //If population input contains anything else but numbers, and city name is letters
        else if (isNaN(inputForCityPopTbx.value) === true && valueFromCityTbx.match(regexForSWEandENGLetters)) {
            inputErrorMessageDiv.innerText = "*Population can only contain numbers";
            inputForCityNameTbx.classList.remove('error-border');
            inputForCityPopTbx.classList.add('error-border')
        }
        //If both city name, and population, inputs are wrong, e.g. city name contains numbers, and population contains letters
        else if (!valueFromCityTbx.match(regexForSWEandENGLetters) && isNaN(inputForCityPopTbx.value) === true) {
            inputErrorMessageDiv.innerHTML = "*City name can only contain letters.<br>*Population can only contain numbers.";
            inputForCityNameTbx.classList.add('error-border');
            inputForCityPopTbx.classList.add('error-border');
        }
        //If both inputs are correct, e.g. city name consist of letters, and population consists of numbers
        else {
            //Clear everything as all is good
            inputForCityNameTbx.classList.remove('error-border');
            inputForCityPopTbx.classList.remove('error-border');
            inputErrorMessageDiv.innerHTML = '';

            //Call addNewCityToServer function and send it city and population
            addNewCityToCitiesServer(inputForCityNameTbx.value, inputForCityPopTbx.value);


        }
    }
});


//METHOD USED TO ADD A NEW CITY TO CITIES SERVER/API
function addNewCityToCitiesServer(cityName, cityPopulation) {

    //Clear all input fields
    document.getElementById("input-for-city-tbx").value = "";
    document.getElementById("input-for-pop-tbx").value = "";

    //Convert cityPopulation to number, as Cities requires that for input
    let cityPopulationConvertedToNum = cityPopulation * 1;

    //Creat object to be sent to server
    let newObject = {
        "name": cityName,
        "population": cityPopulationConvertedToNum
    };

    // Convert the object to a JSON string
    let inputForBody = JSON.stringify(newObject);

    //Add city and population to server by using POST-request with fetch
    fetch('https://avancera.app/cities/', {
        body: inputForBody,
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST'
    })
        .then(response => response.json())
        .then(result => {

            //Refresh dropdown menu
            callCitiesOnPageLoad()

        })


};



/*==================================*/
/*=========== REMOVE CITY ==========*/
/*==================================*/


function removeCity(objectInput) {

    //Store values from them data-attribute, inside of incoming object
    const cityIndex = objectInput.dataset.cityIndex;
    const cityId = objectInput.dataset.cityId;

    //If user wants to remove a single city from viewing a single city
    if (cityIndex === "singleCity") {

        //Select the dynamic element from DOM
        const dynamicDiv = document.querySelector(".every-city-container-singleCity");


        console.log("this is your city id: " + cityId);

        //Remove city from CITIES server
        fetch('https://avancera.app/cities/' + cityId, {
            method: 'DELETE'
        }).then(response => {

            //Remove all children and parent Div
            dynamicDiv.innerHTML = "";
            dynamicDiv.remove();

            //Refresh dropdown menu
            callCitiesOnPageLoad();
        })



    }
    //If user wants to remove a single city from viewing all citites
    else {

        //Select the dynamic element from DOM
        const dynamicDiv = document.querySelector(".every-city-container" + cityIndex);

        //Remove all children and parent Div
        dynamicDiv.innerHTML = "";
        dynamicDiv.remove();

        //Remove city from server
        fetch('https://avancera.app/cities/' + cityId, {
            method: 'DELETE'
        }).then(response => {

            //Remove all children and parent Div
            dynamicDiv.innerHTML = "";
            dynamicDiv.remove();

            //Refresh dropdown menu
            callCitiesOnPageLoad();

        })
    }
}


/*==================================*/
/*=========== Edit CITY ==========*/
/*==================================*/




//Expand edit controls for city name
function expandEditControlsForCityName(objectInput) {

    //Store values from the data-attribute, inside of incoming object
    const cityIndex = objectInput.dataset.cityIndex;

    //Select element from the DOM
    let editNameControlsDiv = document.querySelector(".edit-name-controls-container" + cityIndex);

    // Check the display property
    const displayValue = window.getComputedStyle(editNameControlsDiv).getPropertyValue("display");

    if (displayValue === "none") {
        //display all edit controls for editing city name
        editNameControlsDiv.style.display = "inline-block";
    }
    else if (displayValue === "inline-block") {
        //Hide all edit controls for editing city name
        editNameControlsDiv.style.display = "none";
    }

};

//Cancle adding a new city name
function cancleAddingNewCityName(objectInput) {

    //Store values from the data-attribute, inside of incoming object
    const cityIndex = objectInput.dataset.cityIndex;

    //Select elements from DOM
    let cityNameTbx = document.querySelector(".city-name-tbx" + cityIndex);
    let editNameControlsDiv = document.querySelector(".edit-name-controls-container" + cityIndex);

    cityNameTbx.value = "";
    editNameControlsDiv.style.display = "none";

}

//Save new city name
function saveNewCityName(objectInput) {

    //Store values from the data-attribute, inside of incoming object
    const cityIndex = objectInput.dataset.cityIndex;
    const cityName = objectInput.dataset.cityName;
    const cityId = objectInput.dataset.cityId;
    const cityPopulation = objectInput.dataset.cityPopulation;

    console.log(cityIndex);
    console.log(cityName);
    console.log(cityId);
    console.log(cityPopulation);





}
