'use strict';

//make calls to APIs
function getResults() {
    const dish = $('#dish').val();
    const cuisine = $('#cuisine').val();
    const ingredients = $('#ingredients').val();
    const diet = $('#diet').val();
}

//listen for user to submit search parameters
function handleSubmit() {

    getResults();
}

//listen for user to click get started button and load content
function start() {
    $('.js-start').on('click', function(event) {
        $('main').html(`<form class="search-parameters">
        <h2>Find your perfect recipe pairing!</h2>
        <fieldset name="food-search">
            <legend>First, the food:</legend>
            <label for="dish">Search by dish:</label>
            <input type="text" name="dish" placeholder="quiche" id="dish">
            <label for="cuisine">Search by cuisine:</label>
            <select name="cuisine" id="cuisine">
                <option></option>
                <option value="american">American</option>
                <option value="chinese">Chinese</option>
                <option value="indian">Indian</option>
            </select>
            <label for="ingredients">Search by ingredients:<br>(Please separate items by a comma.)</label>
            <input type="text" name="ingredients" placeholder="bacon" id="ingredients">
            <label for="diet">Search by diet:</label>
            <select name="diet" id="diet">
                <option></option>
                <option value="vegan">Vegan</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="paleo">Paleo</option>
            </select>
        </fieldset>
        <fieldset name="drink-search" class="drink-select">
            <legend>Then, the secret ingredient:</legend>
            <div class="flex-container">
                <input type="radio" name="drink" id="wine" value="wine">
                <label class="radio-button wine" for="wine">Wine Pairing</label>
                <input type="radio" name="drink" id="cocktail" value="cocktail">
                <label class="radio-button" for="cocktail">Cocktail Recipe<br>
                    <label for="cocktail-ingredient" class="with-label">with:</label>
                    <input type="text" class="cocktail-ingredient" name="cocktail-ingredient" placeholder="tequila" id="cocktail-ingredient"
                </label>
            </div>
        </fieldset>
    </form>`);
    $('header').addClass('smallbanner');
    $('img.logo').addClass('smallbanner');
    })
    handleSubmit(); 
}

$(start);