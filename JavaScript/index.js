

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



/*===================================*/
/*=========== CALL ON API ===========*/
/*===================================*/

//SELECT ELEMENTS FROM THE DOM
const dropDownMenuForSearching = document.getElementById("dropdown-menu-search");

//CREAT VARIABLES TO BE USED
let chosenCity;//chosen city should refer to dropdown
let cititesIDArray = [];
let cityNamesOnServerFromStartArray = [];
let stringForPopulatingDropdownWithCityNames = "";


document.addEventListener("DOMContentLoaded", function () {
    console.log("eventet funkar");

    //Set chosen city to nothing so all cities are called
    chosenCity = "";

    //Call funtions that calls all citites
    callCities(chosenCity);
});


let callCities = (cityInput) => {

    console.log("funktionen körs");

    fetch("https://avancera.app/cities/" + cityInput)
        .then((response) => response.json())
        .then((result) => {

            console.log(result);

            //Populate array with cities on web-server
            for (let i = -1; i < result.length; i++) {

                //First value of this array should always be All Cities
                if (i === -1) {
                    cityNamesOnServerFromStartArray[0] = "All cities";
                }
                //Else populate nextcoming indexes with real values from server
                else {
                    cityNamesOnServerFromStartArray[i + 1] = result[i].name;

                }
            }

            //Create child (option) html-elements to parent (select) element
            for (let j = 0; j < cityNamesOnServerFromStartArray.length; j++) {

                //write all html-code elements in one long string
                stringForPopulatingDropdownWithCityNames += `
                <option value="`+ cityNamesOnServerFromStartArray[j] + `">` + cityNamesOnServerFromStartArray[j] + `</option>
                `;
            }

            console.log(stringForPopulatingDropdownWithCityNames)

            //Populate parent (select) html-element with option elements from string
            dropDownMenuForSearching.innerHTML = stringForPopulatingDropdownWithCityNames;
        });


    console.log(cityNamesOnServerFromStartArray);
}
