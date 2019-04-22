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
                <option value="african">African</option>
                <option value="cajun">Cajun</option>
                <option value="caribbean">Caribbean</option>
                <option value="chinese">Chinese</option>
                <option value="french">French</option>
                <option value="greek">Greek</option>
                <option value="indian">Indian</option>
                <option value="italian">Italian</option>
                <option value="japanese">Japanese</option>
                <option value="korean">Korean</option>
                <option value="mexican">Mexican</option>
                <option value="middle eastern">Middle Eastern</option>
                <option value="southern">Southern</option>
                <option value="spanish">Spanish</option>
                <option value="thai">Thai</option>
                <option value="vietnamese">Vietnamese</option>
              </select>
              <label for="ingredients">Ingredients:<br>(Please separate items by a comma.)</label>
              <input type="text" name="ingredients" placeholder="bacon" id="ingredients">
            </fieldset>
              <label for="diet">Filter by diet:</label>
              <select name="diet" id="diet">
                  <option></option>
                  <option value="paleo">Paleo</option>
                  <option value="pescetarian">Pescetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="vegetarian">Vegetarian</option>
              </select>
        </fieldset>
        <input type="submit" class="submit-button" value="Get cooking">
      </form>`);
    })
}

//display cocktail recipes
function displayResultsCocktail(responseJson) {
    $('.cocktail-results-list').append(`
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

//display food recipes
function displayResultFood(responseJson) {
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
        console.log(responseJson);
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
}


//make API call for food recipes by ID
function getResultsFood(responseJson) {
    //for each recipe, make a call to the API for the recipe details
    const options = {
        headers: new Headers({
            'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
            'X-RapidAPI-Key': '9413d6f098mshb7f33766748b78fp1c7ff4jsn8633802ef568'})
        };
    for (let i = 0; i < responseJson.results.length; i++) {
        let recipeURL = (spoonURL + 'recipes/');
        recipeURL += (`${responseJson.results[i].id}` + '/information');
        fetch(recipeURL, options)
        .then(response => response.json())
        .then(
            function(responseJson) {
                displayResultFood(responseJson);
            }
        )
    }
    handleNewSearch();
}

function cocktailError(err) {
    console.log('Search returned no results');
    $('body').prepend(`<div class="error-overlay"><h4>Your search for a cocktail returned no results. Try entering fewer ingredients.</h4>
    <button class="return-search">Return to Search</button></div>`);
    $('body').on('click', '.return-search', function(event) {
        $('.error-overlay').css('display', 'none');
    })
}

//make API calls for cocktail recipes by ID
function getResultsCocktail(responseJson) {
    $('main').prepend(`
    <h2>Have a cocktail while you cook:</h2>
    <ul class="cocktail-results-list"></ul>`);
    //for each recipe, make a call to the API for the recipe details
    for (let i = 0; i < responseJson.drinks.length && i<4; i++) {
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
}

//check resonse for food recipes for errors
function checkStatusWine(responseJson, searchTerm) {
    if (responseJson.pairedWines.length != 0) {
        console.log(searchTerm);
        displayResultsWine(responseJson, searchTerm);
    }
}

//check resonse for food recipes for errors and set up html for results
function checkStatusFood(responseJson) {
    if (responseJson.results.length != 0) {
        $('form.search-parameters').css('display', 'none')
        $('main').append(`
        <h2>Here are your recipes:</h2>
        <ul class="food-results-list">
        </ul>
        <button class="new-search">New Search</button>
        `)
        getResultsFood(responseJson);
    }
    else if (responseJson.results.length == 0) {
        console.log('Search returned no results');
        $('body').prepend(`<div class="error-overlay"><h4>Your search for a recipe returned no results. Try entering fewer parameters.</h4>
        <button class="return-search">Return to Search</button></div>`);
        $('body').on('click', '.return-search', function(event) {
            $('.error-overlay').css('display', 'none');
        })
    }
}

//make call to Spoonaculur for wine pairing
function getWine(wineArrURL, searchTermsArr) {
    console.log(searchTermsArr);
    const options = {
        headers: new Headers({
            'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
            'X-RapidAPI-Key': '9413d6f098mshb7f33766748b78fp1c7ff4jsn8633802ef568'})
        };
    for (let i = 0; i < wineArrURL.length; i++) {
        let searchTerm = searchTermsArr[i];
        fetch(wineArrURL[i], options)
        .then(response => response.json())
        .then(
            function(responseJson) {
                console.log(searchTerm);
                checkStatusWine(responseJson, searchTerm);
            }
        )
    }
}

//make call to Spoonacular for food recipes
function getFood(foodURL) {
    const options = {
        headers: new Headers({
            'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
            'X-RapidAPI-Key': '9413d6f098mshb7f33766748b78fp1c7ff4jsn8633802ef568'})
        };
    fetch(foodURL, options)
        .then(response => response.json())
        .then(
            function(responseJson) {
                checkStatusFood(responseJson);
            }
        )
}

//make call to CocktailDB for cocktail recipe
function getCocktail(cocktailDBURL) {
    fetch(cocktailDBURL)
        .then(
            function(response) {
                if (response != null) {
                    return response.json();
                }
                throw "returned no results";
            }
        )
        .then(
            function(responseJson) {
                getResultsCocktail(responseJson);
            }
        )
        .catch(err => {
            cocktailError(err);
        })
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
        getCocktail(cocktailDBURL);
    }
}

//build URL for call to Spoonaculur for wine pairing
function buildWineURL(dish, cuisine, ingredients) {
    let spoonURLWine = (spoonURL + 'food/wine/pairing?maxPrice=50&');
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
    console.log(wineArrURL);
    getWine(wineArrURL, searchTermsArr)
}

//build URL for call to Spoonaculur for food recipes
function buildFoodURL(dish, cuisine, ingredients, diet) {
    let spoonURLFood = (spoonURL + 'recipes/searchComplex?limitLicense=false&number=6');
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
    console.log(spoonURLFood);
    return spoonURLFood;
}

//access search values and call to build each url
function buildURLs() {
    const dish = $('#dish').val();
    const cuisine = $('#cuisine').val();
    const ingredients = $('#ingredients').val();
    const diet = $('#diet').val();
    const cocktailIng = $('#cocktail').val();
    let foodURL = buildFoodURL(dish, cuisine, ingredients, diet);
    let wineURL = buildWineURL(dish, cuisine, ingredients);
    let cocktailURL = buildCocktailURL(cocktailIng);
    getFood(foodURL);
    getWine(wineURL);
    getCocktail(cocktailURL);
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
                <option value="african">African</option>
                <option value="cajun">Cajun</option>
                <option value="caribbean">Caribbean</option>
                <option value="chinese">Chinese</option>
                <option value="french">French</option>
                <option value="greek">Greek</option>
                <option value="indian">Indian</option>
                <option value="italian">Italian</option>
                <option value="japanese">Japanese</option>
                <option value="korean">Korean</option>
                <option value="latin american">Latin American</option>
                <option value="mexican">Mexican</option>
                <option value="middle eastern">Middle Eastern</option>
                <option value="southern">Southern</option>
                <option value="spanish">Spanish</option>
                <option value="thai">Thai</option>
                <option value="vietnamese">Vietnamese</option>
              </select>
              <label for="ingredients">Ingredients:<br>(Please separate items by a comma.)</label>
              <input type="text" name="ingredients" placeholder="bacon" id="ingredients">
            </fieldset>
              <label for="diet">Filter by diet:</label>
              <select name="diet" id="diet">
              <option></option>
              <option value="paleo">Paleo</option>
              <option value="pescetarian">Pescetarian</option>
              <option value="vegan">Vegan</option>
              <option value="vegetarian">Vegetarian</option>
              </select>
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