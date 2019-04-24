'use strict';

const spoonURL = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/';

//listen for new search
function handleNewSearch() {
    console.log('handleNewSearch ran');
    $('body').on('click', 'button.new-search', function(event) {
        $('main').html(`
        <form class="search-parameters">
        <h2>Search for Recipes</h2>
        <fieldset name="cocktail-search">
            <legend>The important stuff:</legend>
            <label for="cocktail">Find me a cocktail with:<br>(Please separate items by a comma.)</label>
            <input type="text" name="cocktail" placeholder="tequila" id="cocktail">
        </fieldset>
        <fieldset name="food-search">
            <legend>Oh and also, let's eat something:</legend>
            <fieldset name="required-parameters">
                <legend>Search by (at least of one the following):</legend>
                <label for="dish">Dish:</label>
                <input type="text" name="dish" placeholder="quiche" id="dish">
                <label for="cuisine">Cuisine:</label>
                <select name="cuisine" id="cuisine">
                    <option></option>
                    <option value="African">African</option>
                    <option value="American">American</option>
                    <option value="Cajun">Cajun</option>
                    <option value="Caribbean">Caribbean</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Eastern european">Eastern European</option>
                    <option value="French">French</option>
                    <option value="Greek">Greek</option>
                    <option value="Indian">Indian</option>
                    <option value="Italian">Italian</option>
                    <option value="Japanese">Japanese</option>
                    <option value="Korean">Korean</option>
                    <option value="Latin American">Latin American</option>
                    <option value="Mexican">Mexican</option>
                    <option value="Middle Eastern">Middle Eastern</option>
                    <option value="Southern">Southern</option>
                    <option value="Spanish">Spanish</option>
                    <option value="Thai">Thai</option>
                    <option value="Vietnamese">Vietnamese</option>
                </select>
                <label for="ingredients">Ingredients:<br>(Please separate items by a comma.)</label>
                <input type="text" name="ingredients" placeholder="bacon" id="ingredients">
            </fieldset>
            <fieldset>
                <legend>Filter by:</legend>
                <label for="diet">Diet:</label>
                <select name="diet" id="diet">
                    <option></option>
                    <option value="paleo">Paleo</option>
                    <option value="pescetarian">Pescetarian</option>
                    <option value="vegan">Vegan</option>
                    <option value="vegetarian">Vegetarian</option>
                </select>
                <label for="course">Course:</label>
                <select name="course" id="course">
                    <option></option>
                    <option value="main course">Main Course</option>
                    <option value="side dish">Side Dish</option>
                    <option value="dessert">Dessert</option>
                    <option value="appetizer">Appetizer</option>
                    <option value="salad">Salad</option>
                    <option value="soup">Soup</option>
                    <option value="sauce">Sauce</option>
                    <option value="bread">Bread</option>
                </select>
            </fieldset>
        </fieldset>
        <input type="submit" class="submit-button" value="Get cooking">
      </form>`);
    })
}

//display each cocktail
function displayResultsCocktail(responseJson) {
    $('.cocktail-results-list').prepend(`
        <li class="cocktail-result">
            <a href="https://www.thecocktaildb.com/drink.php?c=${responseJson.drinks[0].idDrink}" target="_blank">${responseJson.drinks[0].strDrink}</a>
            <a href="https://www.thecocktaildb.com/drink.php?c=${responseJson.drinks[0].idDrink}" target="_blank">
                <img src="${responseJson.drinks[0].strDrinkThumb}" class="cocktail-img">
            </a>
    `)
}

//display wine pairing
function displayResultsWine(responseJson, searchTerm) {
    console.log(responseJson);
    console.log(searchTerm);
    $('ul.food-results-list').before(`
    <div class="general-pairing">
        <h4>General wine pairing advice for ${searchTerm}</h4>
        <p>${responseJson.pairingText}</p>
    </div>
    `)
}

//display each food recipe
function displayResultFood(responseJson) {
    // console.log('displayResultFood ran');
    console.log(responseJson);
    console.log(`begin insert for ${responseJson.id}`);
    $('.food-results-list').append(`
    <li class="recipe-result ${responseJson.id}">
        <a href="${responseJson.sourceUrl}" target="_blank">${responseJson.title}</a>
    </li>`);
    if (responseJson.hasOwnProperty('image')) {
        $(`li.${responseJson.id}`).append(`
        <a href="${responseJson.sourceUrl}" target="_blank">
            <img src="${responseJson.image}" class="recipe-img">
        </a>`)
    }
    if ((responseJson.winePairing.hasOwnProperty('pairingText')) && (responseJson.winePairing.pairingText !== '')) {
        $(`li.${responseJson.id}`).append(`
        <button class="wp wine-pairing-${responseJson.id}">View Wine Pairing</button>
        <div class="wpt wine-pairing-text-${responseJson.id}">
        </div>
        `)
        $(`.wine-pairing-text-${responseJson.id}`).css('display', 'none');
        $(`.wine-pairing-text-${responseJson.id}`).html(`<p>${responseJson.winePairing.pairingText}</p>
        `)
        $('body').on('click', `.wine-pairing-${responseJson.id}`, function(event) {
            $(`.wine-pairing-text-${responseJson.id}`).toggle();
        })
    }
    console.log(`end insert for ${responseJson.id}`);
}

//make API call for food recipes by ID
function getResultsFood(foodResponse, displayNumFood) {
    console.log('getResultsFood ran');
    console.log(displayNumFood);
    //for each recipe, make a call to the API for the recipe details
    const options = {
        headers: new Headers({
            'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
            'X-RapidAPI-Key': '9413d6f098mshb7f33766748b78fp1c7ff4jsn8633802ef568'})
        };
    for (let i = (displayNumFood - 5); ((i < foodResponse.results.length) && (i < displayNumFood)); i++) {
        console.log(i);
        console.log(displayNumFood);
        let recipeURL = (spoonURL + 'recipes/');
        recipeURL += (`${foodResponse.results[i].id}` + '/information');
        fetch(recipeURL, options)
        .then(response => response.json())
        .then(
            function(responseJson) {
                displayResultFood(responseJson);
            }
        )
    }
}


//make API calls for cocktail recipes by ID
function getResultsCocktail(responseJson, displayNumCocktail) {
    console.log(responseJson);
    //for each recipe, make a call to the API for the recipe details
    for (let i = (displayNumCocktail - 5); ((i < responseJson.drinks.length) && (i < displayNumCocktail) && (i < 20)); i++) {
        let recipeURL = 'https://www.thecocktaildb.com/api/json/v2/8673533/lookup.php?i=';
        recipeURL += (`${responseJson.drinks[i].idDrink}`);
        fetch(recipeURL)
        .then(response => response.json())
        .then(
            function(responseJson) {
                displayResultsCocktail(responseJson);
            }
        )
    }
    window.scrollTo(0, 0);
}

//handle user clicks to see next or previous results for food
function handleNavFood(foodResponse, displayNumFood) {
    console.log('handleSeeMore ran');
    $('main').on('click', '.see-more-food', function(event) {
        $('.food-results-list').empty();
        displayNumFood += 5;
        console.log(displayNumFood);
        if (displayNumFood >= 20) {
            $('.see-more-food').css('display', 'none');
        }
        else if (displayNumFood <= 5) {
            $('.see-previous-food').css('display', 'none');
        }
        else {
            $('.see-previous-food').css('display', 'block');
            $('.see-more-food').css('display', 'block');
        }
        getResultsFood(foodResponse, displayNumFood);
    });
    $('main').on('click', '.see-previous-food', function(event) {
        console.log('handleSeePreviousFood ran');
        displayNumFood -= 5;
        $('.food-results-list').empty();
        console.log(displayNumFood);
        if (displayNumFood >= 20) {
            $('.see-more-food').css('display', 'none');
        }
        else if (displayNumFood <= 5) {
            $('.see-previous-food').css('display', 'none');
        }
        else {
            $('.see-previous-food').css('display', 'block');
            $('.see-more-food').css('display', 'block');
        }  
        getResultsFood(foodResponse, displayNumFood);
    });
}

//handle user clicks to see next or previous results for cocktails
function handleNavCocktails(cocktailResponse, displayNumCocktail) {
    console.log('handleSeeMoreCocktails ran');
    $('main').on('click', '.see-more-cocktails', function(event) {
        $('.cocktail-results-list').empty();
        displayNumCocktail += 5;
        console.log(displayNumCocktail);
        if (displayNumCocktail >= 20) {
            $('.see-more-cocktails').css('display', 'none');
        }
        else if (displayNumCocktail <= 5) {
            $('.see-previous-cocktails').css('display', 'none');
        }
        else {
            $('.see-previous-cocktails').css('display', 'block');
            $('.see-more-cocktails').css('display', 'block');
        }
        getResultsCocktail(cocktailResponse, displayNumCocktail);
    });
    $('main').on('click', '.see-previous-cocktails', function(event) {
        $('.cocktail-results-list').empty();
        displayNumCocktail -= 5;
        console.log(displayNumCocktail);
        if (displayNumCocktail >= 20) {
            $('.see-more-cocktails').css('display', 'none');
        }
        else if (displayNumCocktail <= 5) {
            $('.see-previous-cocktails').css('display', 'none');
        }
        else {
            $('.see-previous-cocktails').css('display', 'block');
            $('.see-more-cocktails').css('display', 'block');
        }
        getResultsCocktail(cocktailResponse, displayNumCocktail);
    });
}

//set up html for displaying results
function setUpResultsDisplay(foodResponse, cocktailResponse) {
    $('form.search-parameters').css('display', 'none');
    $('main').append(`
        <h2>Have a cocktail while you cook:</h2>
        <ul class="cocktail-results-list"></ul>
        <button class="see-previous-cocktails">See Previous</button>
        <button class="see-more-cocktails">See More</button>
        <h2>Here are your recipes:</h2>
        <ul class="food-results-list">
        </ul>
        <button class="see-previous-food">See Previous</button>
        <button class="see-more-food">See More</button>
        <button class="new-search">New Search</button>
    `);
    $('.see-previous-cocktails').css('display', 'none');
    $('.see-previous-food').css('display', 'none');
    let displayNumFood = 5;
    let displayNumCocktail = 5;
    getResultsCocktail(cocktailResponse, displayNumCocktail);
    getResultsFood(foodResponse, displayNumFood);
    handleNavCocktails(cocktailResponse, displayNumCocktail);
    handleNavFood(foodResponse, displayNumFood);
    handleNewSearch();
}

//check response for wine pairings
function checkStatusWine(responseJson, searchTerm) {
    if (responseJson.pairedWines.length != 0) {
        console.log(searchTerm);
        displayResultsWine(responseJson, searchTerm);
    }
}

//make call to Spoonaculur for wine pairing
function getWine(wineURLArr) {
    const options = {
        headers: new Headers({
            'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
            'X-RapidAPI-Key': '9413d6f098mshb7f33766748b78fp1c7ff4jsn8633802ef568'})
        };
    for (let i = 0; i < wineURLArr[0].length; i++) {
        let searchTerm = wineURLArr[1][i];
        fetch(wineURLArr[0][i], options)
        .then(response => response.json())
        .then(
            function(responseJson) {
                console.log(searchTerm);
                checkStatusWine(responseJson, searchTerm);
            }
        )
    }
}


//check responses and proceed with display if valid
function checkStatus(cocktailResponse, foodResponse, wineURLArr) {
    console.log(foodResponse);
    if (foodResponse) {
        if ((foodResponse.results.length != 0) && (cocktailResponse)) {
            getWine(wineURLArr);
            setUpResultsDisplay(foodResponse, cocktailResponse);
        }
    }
}

//display error message
function cocktailError(err) {
    if (($('.error-overlay').length == 0) || ($('.error-overlay').is(':hidden'))) {
        $('body').prepend(`<div class="error-overlay"><h4>Your search for a cocktail returned no results. Try entering fewer ingredients.</h4>
        <button class="return-search">Return to Search</button></div>`);
        $('body').on('click', '.return-search', function(event) {
            $('.error-overlay').css('display', 'none');
        })
    }
    else {
        $('.error-overlay').prepend(`<h4>Your search for a cocktail returned no results. Try entering fewer ingredients.</h4>`);
    }
}

//display error message
function foodError(err) {
    if (($('.error-overlay').length == 0) || ($('.error-overlay').is(':hidden'))) {
        $('body').prepend(`<div class="error-overlay"><h4>Your search for a recipe returned no results. Try entering fewer parameters.</h4>
        <button class="return-search">Return to Search</button></div>`);
        $('body').on('click', '.return-search', function(event) {
            $('.error-overlay').css('display', 'none');
        });
    }
    else {
        $('.error-overlay').prepend(`<h4>Your search for a recipe returned no results. Try entering fewer parameters.</h4>`);
    }
}

//make API calls for cocktails and food recipes
function getAll(cocktailDBURL, foodURL, wineURLArr) {
    console.log(wineURLArr);
    const options = {
        headers: new Headers({
            'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
            'X-RapidAPI-Key': '9413d6f098mshb7f33766748b78fp1c7ff4jsn8633802ef568'})
        };

    let cocktailRequest = (fetch(cocktailDBURL)
        .then(
            function(response) {
                if (response != null) {
                    return response.json();
                }
                throw "returned no results";
            }
        )
        .catch(err => {
            cocktailError(err);
        })
    );

    let foodRequest = (fetch(foodURL, options)
        .then(response => response.json())
        .then(function(responseJson) {
            if (responseJson.results.length != 0) {
                return responseJson;
            }
            throw "returned no results";
        })
        .catch(err => {
            foodError(err);
        })
    );
    
    Promise.all([cocktailRequest, foodRequest]).then(function(values) {
        console.log(wineURLArr);
        let cocktailResponse = values[0];
        let foodResponse = values[1];
        console.log(foodResponse);
        checkStatus(cocktailResponse, foodResponse, wineURLArr);
    });
}

//build URL for call to CocktailDB for cocktail recipe
function buildCocktailURL(cocktailIng) {
    if (cocktailIng !== '') {
        let cocktailIngArr = cocktailIng.split(",");
        let cocktailIngItems = cocktailIngArr.map(function(e){return e.trim();});
        let cocktailIngItemsEnc = cocktailIngItems.map(e => encodeURIComponent(e));
        let cocktailIngString = cocktailIngItemsEnc.join(',');
        let cocktailDBURL = ('https://www.thecocktaildb.com/api/json/v2/8673533/filter.php?i=' + cocktailIngString);
        console.log(cocktailDBURL);
        return cocktailDBURL;
    }
}

//build URL for call to Spoonaculur for wine pairing
function buildWineURL(dish, cuisine, ingredients) {
    let spoonURLWine = (spoonURL + 'food/wine/pairing?maxPrice=50&');
    const combinedArr = [];
    const wineArrURL = [];
    const searchTermsArr = [];
    if (dish != '') {
        searchTermsArr.push(dish);
        spoonURLWine += ('&food=' + dish);
        wineArrURL.push(spoonURLWine);
    }
    else if (cuisine != '') {
        searchTermsArr.push(cuisine);
        spoonURLWine += ('&food=' + cuisine);
        wineArrURL.push(spoonURLWine);
    }
    else if (ingredients != '') {
        const items = ingredients.split(',');
        for (let i = 0; i < items.length; i++) {
            items[i] = items[i].trim();
            searchTermsArr.push(items[i]);
        }
        for (let i = 0; i < items.length; i++) {
            items[i] = spoonURLWine + '&food=' + items[i];
            wineArrURL.push(items[i]);
        }
    }
    combinedArr.push(wineArrURL);
    combinedArr.push(searchTermsArr);
    console.log(combinedArr);
    return combinedArr;
}

//build URL for call to Spoonaculur for food recipes
function buildFoodURL(dish, cuisine, ingredients, diet, course) {
    let spoonURLFood = (spoonURL + 'recipes/searchComplex?limitLicense=false&number=20');
    if (dish != '') {
        spoonURLFood += ('&query=' + dish);
    }
    if (cuisine != '') {
        spoonURLFood += ('&cuisine=' + cuisine);
    }
    if (ingredients != '') {
        let ingredientsURI = encodeURIComponent(ingredients);
        spoonURLFood += ('&includeIngredients=' + ingredientsURI);
    }
    if (diet != '') {
        spoonURLFood += ('&diet=' + diet);
    }
    if (course != '') {
        spoonURLFood += ('&type=' + course);
    }
    console.log(spoonURLFood);
    return spoonURLFood;
}

//access search values and call to build each url
function buildURLs() {
    const dish = $('#dish').val();
    const cuisine = $('#cuisine').val();
    const ingredients = $('#ingredients').val();
    const diet = $('#diet').val();
    const course = $('#course').val();
    const cocktailIng = $('#cocktail').val();
    if (((dish != '') || (cuisine != '') || (ingredients != '')) && (cocktailIng != '')) {
        let foodURL = buildFoodURL(dish, cuisine, ingredients, diet, course);
        let wineURLArr = buildWineURL(dish, cuisine, ingredients);
        let cocktailURL = buildCocktailURL(cocktailIng);
        getAll(cocktailURL, foodURL, wineURLArr);
    }
}

//listen for user to submit search parameters
function handleSubmit() {
    $('main').submit(function(event) {
        event.preventDefault();
        buildURLs();
    })
}

//listen for user to click get started button and load content
function start() {
    $('.js-start').on('click', function(event) {
        $('main').html(`
        <form class="search-parameters">
        <h2>Search for Recipes</h2>
        <fieldset name="cocktail-search">
            <legend>The important stuff:</legend>
            <label for="cocktail">Find me a cocktail with:<br>(Please separate items by a comma.)</label>
            <input type="text" name="cocktail" placeholder="tequila" id="cocktail">
        </fieldset>
        <fieldset name="food-search">
            <legend>Oh and also, let's eat something:</legend>
            <fieldset name="required-parameters">
                <legend>Search by (at least of one the following):</legend>
                <label for="dish">Dish:</label>
                <input type="text" name="dish" placeholder="quiche" id="dish">
                <label for="cuisine">Cuisine:</label>
                <select name="cuisine" id="cuisine">
                    <option></option>
                    <option value="African">African</option>
                    <option value="American">American</option>
                    <option value="Cajun">Cajun</option>
                    <option value="Caribbean">Caribbean</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Eastern european">Eastern European</option>
                    <option value="French">French</option>
                    <option value="Greek">Greek</option>
                    <option value="Indian">Indian</option>
                    <option value="Italian">Italian</option>
                    <option value="Japanese">Japanese</option>
                    <option value="Korean">Korean</option>
                    <option value="Latin American">Latin American</option>
                    <option value="Mexican">Mexican</option>
                    <option value="Middle Eastern">Middle Eastern</option>
                    <option value="Southern">Southern</option>
                    <option value="Spanish">Spanish</option>
                    <option value="Thai">Thai</option>
                    <option value="Vietnamese">Vietnamese</option>
                </select>
                <label for="ingredients">Ingredients:<br>(Please separate items by a comma.)</label>
                <input type="text" name="ingredients" placeholder="bacon" id="ingredients">
            </fieldset>
            <fieldset>
                <legend>Filter by:</legend>
                <label for="diet">Diet:</label>
                <select name="diet" id="diet">
                    <option></option>
                    <option value="paleo">Paleo</option>
                    <option value="pescetarian">Pescetarian</option>
                    <option value="vegan">Vegan</option>
                    <option value="vegetarian">Vegetarian</option>
                </select>
                <label for="course">Course:</label>
                <select name="course" id="course">
                    <option></option>
                    <option value="main course">Main Course</option>
                    <option value="side dish">Side Dish</option>
                    <option value="dessert">Dessert</option>
                    <option value="appetizer">Appetizer</option>
                    <option value="salad">Salad</option>
                    <option value="soup">Soup</option>
                    <option value="sauce">Sauce</option>
                    <option value="bread">Bread</option>
                </select>
            </fieldset>
        </fieldset>
        <input type="submit" class="submit-button" value="Get cooking">
      </form>`);
    $('header').addClass('smallbanner');
    $('img.logo').addClass('smallbanner');
    $('img.logo').on('click', function(event) {
        location.reload();
    })
    handleSubmit();
    })
}

$(start);