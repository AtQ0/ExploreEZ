

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
            console.log(stringForPopulatingDropdownWithCityNames);

        });

}


/*=======================================*/
/*== VIEW CITIES ON CLICK OF VIEW BTN ===*/
/*=======================================*/

//SELECT ELEMENTS FROM DOM
const viewResultsBtn = document.getElementById("view-results-btn");
const apiContentDiv = document.getElementById("api-content");

//CREATE VARIABLE FOR USE
let stringForCreatingDynamicDivsInApiContentDiv = "";

viewResultsBtn.addEventListener("click", function () {

    chosenCityID = document.getElementById("dropdown-menu-search").value;
    writeCitiesAndElements(chosenCityID);
})


let writeCitiesAndElements = (chosenCityIdInput) => {








    console.log(chosenCityIdInput)


    //FETCH FOR CITITES API

    fetch('https://avancera.app/cities/' + chosenCityIdInput)
        .then((response) => response.json())
        .then((result) => {

            console.log(result)

            if (chosenCityIdInput === "") {
                for (let i = 0; i < result.length; i++) {
                    stringForCreatingDynamicDivsInApiContentDiv += `
                    <div>
                        <h2>${result[i].name}</h2>
                        <p>Population: ${result[i].population}</p>
                        <div>
                            <p>Longintude:</p>
                            <p>Lattitude:</p>
                        </div>
                    </div>
                    `;
                }
            }
            else {

                stringForCreatingDynamicDivsInApiContentDiv = `
                <div>
                    <h2>${result.name}</h2>
                    <p>Population: ${result.population}</p>
                    <div>
                        <p>Longintude:</p>
                        <p>Lattitude:</p>
                    </div>
                </div>
                `;
            }

            apiContentDiv.innerHTML = stringForCreatingDynamicDivsInApiContentDiv;

        });

}
