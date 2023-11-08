

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
let chosenCity;//Used by DOMContentLOADED
let cityNamesOnServerFromStartArray = [];
let cityIdsOnServerFromStartArray = [];
let stringForPopulatingDropdownWithCityNames = "";

document.addEventListener("DOMContentLoaded", function () {

    //Set chosen city to nothing so all cities are called
    chosenCity = "";

    //Call funtions that calls all citites
    callCitiesOnPageLoad(chosenCity);
});


let callCitiesOnPageLoad = (cityInput) => {

    fetch("https://avancera.app/cities/" + cityInput)
        .then((response) => response.json())
        .then((result) => {

            //Populate array with cities on web-server
            for (let i = -1; i < result.length; i++) {

                //First value of this array should always be All Cities
                if (i === -1) {
                    cityNamesOnServerFromStartArray[0] = "All cities";
                    cityIdsOnServerFromStartArray[0] = "idUnique"

                }
                //Else populate nextcoming indexes with real values from server
                else {
                    cityNamesOnServerFromStartArray[i + 1] = result[i].name;
                    cityIdsOnServerFromStartArray[i + 1] = result[i].id;

                }


            }

            //Create child (option) html-elements to parent (select) element
            for (let j = 0; j < cityNamesOnServerFromStartArray.length; j++) {

                //write all html-code elements in one long string
                stringForPopulatingDropdownWithCityNames += `
                <option value="`+ cityIdsOnServerFromStartArray[j] + `">` + cityNamesOnServerFromStartArray[j] + `</option>
                `;
            }

            //Populate parent (select) html-element with option elements from string
            dropDownMenuForSearching.innerHTML = stringForPopulatingDropdownWithCityNames;
        });

}


/*=======================================*/
/*== VIEW CITIES ON CLICK OF VIEW BTN ===*/
/*=======================================*/

//SELECT ELEMENTS FROM DOM
const viewResultsBtn = document.getElementById("view-results-btn");
const dropDownMenu = document.getElementById("dropdown-menu-search");
const apiContentDiv = document.getElementById("api-content");
let stringForCreatingDivElementsForApiContent = "";

//CREATE VARIABLES FOR USE
let idSentFromDropDownSelection;


//Click-Event method that calls callCitiesServerOnBtnClick
viewResultsBtn.addEventListener("click", function () {
    callCitiesServerOnBtnClick(dropDownMenu.value);
})


//Method used for calling cities server on Btn-click
let callCitiesServerOnBtnClick = (dropdownMenuValueInput) => {

    //If value in dropdown menu is idUnique (i.e. All cities) show all cities
    if (dropdownMenuValueInput === "idUnique") {
        idSentFromDropDownSelection = "";
    }
    //Show value for a specific ID
    else {
        idSentFromDropDownSelection = dropdownMenuValueInput;
    }

    const webServerLinkForAllCities = "https://avancera.app/cities/" + idSentFromDropDownSelection;

    fetch(webServerLinkForAllCities)
        .then((respons) => respons.json())
        .then((result) => {

            for (let i = 0; i < result.length; i++) {


                //Write nodes here based from the server

                stringForCreatingDivElementsForApiContent += `
                    <div>
                    <h2>${result[i].name}</h2>
                        <p>Population: ${result[i].population}</p>
                        <div id="geoLocation">

                        </div>
                    </div>
                `;

            }

            console.log(stringForCreatingDivElementsForApiContent);
            apiContentDiv.innerHTML = stringForCreatingDivElementsForApiContent;



        });





}
