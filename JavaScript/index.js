

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
let stringForPopulatingDropdownWithCityNames;

//ON PAGE RELOAD CALL METHOD WHICH UPDATES DROPDOWN MENU
document.addEventListener("DOMContentLoaded", function () {

    //Call funtions that calls all citites
    callCitiesOnPageLoad();
});


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
    apiContentDiv.scrollTop = 0;

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
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3A3320" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/>
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
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3A3320" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/>
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


/*======================================*/
/*==== ADD, CHANGE AND DELETE CITY =====*/
/*======================================*/

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

    console.log('Yes, you are inside of function')
    console.log(cityName);
    console.log(cityPopulation);
    console.log(typeof cityName);
    console.log(typeof cityPopulation)

    //Convert cityPopulation to number, as Cities requires that for input
    let cityPopulationConvertedToNum = cityPopulation * 1;

    console.log(cityPopulationConvertedToNum);
    console.log(typeof cityPopulationConvertedToNum);

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

            console.log(result)

            //Refresh dropdown menu
            callCitiesOnPageLoad();

        })

};
