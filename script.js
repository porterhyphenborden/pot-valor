'use strict';

const spoonURL = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/';

//listen for new search
function handleNewSearch() {
    $('body').on('click', 'button.new-search', function(event) {
        $('main').html(`
        <form class="search-parameters">
      <h2>Search for Recipes</h2>
      <fieldset name="cocktail-search" class="cocktail-search">
        <legend>The important stuff:</legend>
        <label for="cocktail">Find me a cocktail with:<br>(Please separate items by a comma.)</label>
        <input type="text" name="cocktail" placeholder="tequila" id="cocktail">
      </fieldset>
      <fieldset name="food-search" class="food-search">
          <legend>Oh and also, let's eat something:</legend>
          <fieldset name="required-parameters" class="required-parameters">
            <legend class="sub-legend">Search by (at least of one the following):</legend>
            <div class="filter-container required">
              <div class="filter-box required">
                <label for="dish">Dish:</label>
                <input type="text" name="dish" placeholder="quiche" id="dish">
              </div>
              <div class="filter-box required">
                <label for="cuisine">Cuisine:</label>
                <select name="cuisine" id="cuisine">
                    <option></option>
                    <option value="african">African</option>
                    <option value="american">American</option>
                    <option value="cajun">Cajun</option>
                    <option value="caribbean">Caribbean</option>
                    <option value="chinese">Chinese</option>
                    <option value="eastern european">Eastern European</option>
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
              </div>
              <div class="filter-box required">
                <label for="ingredients">Ingredients (separate by comma):</label>
                <input type="text" name="ingredients" placeholder="bacon" id="ingredients">
              </div>
            </div>
          </fieldset>
          <fieldset name="filters" class="optional-parameters">
            <legend class="sub-legend">Filter by:</legend>
            <div class="filter-container">
              <div class="filter-box">
                <label for="diet">Diet:</label>
                <select name="diet" id="diet">
                    <option></option>
                    <option value="paleo">Paleo</option>
                    <option value="pescetarian">Pescetarian</option>
                    <option value="vegan">Vegan</option><
                    <option value="vegetarian">Vegetarian</option>
                </select>
              </div>
              <div class="filter-box">
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
              </div>
            </div>
          </fieldset>
      </fieldset>
      <input type="submit" class="submit-button" value="Find Recipes">
    </form>`);
    })
}

//display each cocktail
function displayResultsCocktail(responseJson) {
    $('.cocktail-results-list').prepend(`
        <li class="cocktail-result">
            <a href="https://www.thecocktaildb.com/drink.php?c=${responseJson.drinks[0].idDrink}" target="_blank">
                <img src="${responseJson.drinks[0].strDrinkThumb}" class="cocktail-img" alt="${responseJson.drinks[0].strDrink}">
            </a>
            <div class="cocktail-title-wrapper">
                <a class="cocktail-title" href="https://www.thecocktaildb.com/drink.php?c=${responseJson.drinks[0].idDrink}" target="_blank">${responseJson.drinks[0].strDrink}</a>
            </div>
        </li>`)
}

//display wine pairing
function displayResultsWine(responseJson, searchTerm) {
    $('div.general-pairing-top').html(`
        <h3 class="general-pairing">General wine pairing advice for ${searchTerm}</h3>
        <p class="general-pairing">${responseJson.pairingText}</p>
    `);
    $('div.general-pairing').html(`
        <h3 class="general-pairing">General wine pairing advice for ${searchTerm}</h3>
        <p class="general-pairing">${responseJson.pairingText}</p>
        <button class="view-general">View General Pairing Advice</button>
    `);
    $('body').on('click', `.view-general`, function(event) {
        $(`h3.general-pairing`).html(`
            General wine pairing advice for ${searchTerm}`);
        $(`p.general-pairing`).html(`
            ${responseJson.pairingText}`);
        $('button.view-general').css('display', 'none');
    });
}

//display each food recipe
function displayResultFood(responseJson) {
    $('.food-results-list').append(`
    <li class="recipe-result ${responseJson.id}">
        <div class="recipe-result-wrapper ${responseJson.id}">
            <div class="recipe-title-wrapper">
                <a href="${responseJson.sourceUrl}" target="_blank" class="recipe-title">${responseJson.title}</a>
            </div>
        </div>
    </li>`);
    if (responseJson.hasOwnProperty('image')) {
        $(`div.${responseJson.id}`).prepend(`
        <a href="${responseJson.sourceUrl}" target="_blank">
            <img src="${responseJson.image}" class="recipe-img" alt="${responseJson.title}">
        </a>`)
    }
    else {
        $(`div.${responseJson.id}`).prepend(`
        <a href="${responseJson.sourceUrl}" target="_blank">
            <img src="https://i.imgur.com/ME5RFII.png" class="recipe-img" alt="${responseJson.title}">
        </a>`)
    };
    if ((responseJson.winePairing.hasOwnProperty('pairingText')) && (responseJson.winePairing.pairingText !== '')) {
        $(`li.${responseJson.id}`).append(`
        <button class="wp-small wine-pairing-small-${responseJson.id}">View Wine Pairing</button>
        <button class="wp-large wine-pairing-large-${responseJson.id}">View Wine Pairing</button>
        <div class="wpt wine-pairing-text-${responseJson.id}">
        </div>
        `)
        $(`.wine-pairing-text-${responseJson.id}`).css('display', 'none');
        $(`.wine-pairing-text-${responseJson.id}`).html(`<p>${responseJson.winePairing.pairingText}</p>
        `)
        $('body').on('click', `.wine-pairing-small-${responseJson.id}`, function(event) {
            $(`.wine-pairing-text-${responseJson.id}`).toggle();
        })
        $('body').on('click', `.wine-pairing-large-${responseJson.id}`, function(event) {
            $('h3.general-pairing').html(`
                Wine pairing for ${responseJson.title}`);
            $('p.general-pairing').html(`
                ${responseJson.winePairing.pairingText}`);
            $('button.view-general').css('display', 'block');
        })
    }
}

//make API call for food recipes by ID
function getResultsFood(foodResponse, displayNumFood) {
    $('.food-results-list').hide();
    $('.food-nav').hide();
    //for each recipe, make a call to the API for the recipe details
    const options = {
        headers: new Headers({
            'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
            'X-RapidAPI-Key': '9413d6f098mshb7f33766748b78fp1c7ff4jsn8633802ef568'})
        };
    for (let i = (displayNumFood - 4); ((i < foodResponse.results.length) && (i < displayNumFood)); i++) {
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
    window.scrollTo(0, 0);
    $('.food-results-list').fadeIn('2000');
    $('.food-nav').fadeIn('3000');
}


//make API calls for cocktail recipes by ID
function getResultsCocktail(responseJson, displayNumCocktail) {
    $('.cocktail-results-list').hide();
    $('.cocktail-nav').hide();
    //for each recipe, make a call to the API for the recipe details
    for (let i = (displayNumCocktail - 4); ((i < responseJson.drinks.length) && (i < displayNumCocktail) && (i < 24)); i++) {
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
    $('.cocktail-results-list').fadeIn('2000');
    $('.cocktail-nav').fadeIn('3000');
}

//handle user clicks to see next or previous results for food
function handleNavFood(foodResponse, displayNumFood) {
    $('main').on('click', '.see-more-food', function(event) {
        $('.food-results-list').fadeOut();
        $('.food-results-list').empty();
        displayNumFood += 4;
        if ((displayNumFood >= 24) || (displayNumFood >= foodResponse.results.length)) {
            $('.see-more-food').css('display', 'none');
            $('.see-previous-food').css('display', 'block');
        }
        else if ((displayNumFood <= 4) && (displayNumFood < foodResponse.results.length)) {
            $('.see-previous-food').css('display', 'none');
            $('.see-more-food').css('display', 'block');
        }
        else if (displayNumFood > 4) {
            $('.see-previous-food').css('display', 'block');
        }
        else {
            $('.see-previous-food').css('display', 'block');
            $('.see-more-food').css('display', 'block');
        }  
        getResultsFood(foodResponse, displayNumFood);
    });
    $('main').on('click', '.see-previous-food', function(event) {
        displayNumFood -= 4;
        $('.food-results-list').fadeOut();
        $('.food-results-list').empty();
        if ((displayNumFood >= 24) || (displayNumFood >= foodResponse.results.length)) {
            $('.see-more-food').css('display', 'none');
            $('.see-previous-food').css('display', 'block');
        }
        else if ((displayNumFood <= 4) && (displayNumFood < foodResponse.results.length)) {
            $('.see-previous-food').css('display', 'none');
            $('.see-more-food').css('display', 'block');
        }
        else if (displayNumFood > 4) {
            $('.see-previous-food').css('display', 'block');
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
    $('main').on('click', '.see-more-cocktails', function(event) {
        $('.cocktail-results-list').fadeOut();
        $('.cocktail-results-list').empty();
        displayNumCocktail += 4;
        if ((displayNumCocktail >= 24) || (displayNumCocktail >= cocktailResponse.drinks.length)) {
            $('.see-more-cocktails').css('display', 'none');
            $('.see-previous-cocktails').css('display', 'block');
        }
        else if ((displayNumCocktail <= 4) && (displayNumCocktail < cocktailResponse.drinks.length)) {
            $('.see-previous-cocktails').css('display', 'none');
            $('.see-more-cocktails').css('display', 'block');
        }
        else if (displayNumCocktail > 4) {
            $('.see-previous-cocktails').css('display', 'block');
        }
        else {
            $('.see-previous-cocktails').css('display', 'block');
            $('.see-more-cocktails').css('display', 'block');
        }
        getResultsCocktail(cocktailResponse, displayNumCocktail);
    });
    $('main').on('click', '.see-previous-cocktails', function(event) {
        $('.cocktail-results-list').fadeOut();
        $('.cocktail-results-list').empty();
        displayNumCocktail -= 4;
        if ((displayNumCocktail >= 24) || (displayNumCocktail >= cocktailResponse.drinks.length)) {
            $('.see-more-cocktails').css('display', 'none');
            $('.see-previous-cocktails').css('display', 'block');
        }
        else if ((displayNumCocktail <= 4) && (displayNumCocktail < cocktailResponse.drinks.length)) {
            $('.see-previous-cocktails').css('display', 'none');
            $('.see-more-cocktails').css('display', 'block');
        }
        else if (displayNumCocktail > 4) {
            $('.see-previous-cocktails').css('display', 'block');
        }
        else {
            $('.see-previous-cocktails').css('display', 'block');
            $('.see-more-cocktails').css('display', 'block');
        }
        getResultsCocktail(cocktailResponse, displayNumCocktail);
    });
}

//handle toggle between cocktail and food recipes for small screens
function handleToggle() {
    $('body').on('click', '.dt-cocktail', function(event) {
        $('.cocktail-results').show();
        $('.food-results').hide();
        $('.general-pairing-top').hide();
        $('.dt-cocktail').toggleClass('selected');
        $('.dt-food').toggleClass('selected');
    });
    $('body').on('click', '.dt-food', function(event) {
        $('.cocktail-results').hide();
        $('.food-results').show();
        $('.general-pairing-top').show();
        $('.dt-cocktail').toggleClass('selected');
        $('.dt-food').toggleClass('selected');
    });
}

function handleResize() {
    $(window).resize(function() {
        if ( $(this).width() > 800 ) {
            $('.cocktail-results').show();
            $('.food-results').show();
            $('.general-pairing-top').hide();
            $('.general-pairing').show();
        }
    })
}

//set up html for displaying results
function setUpResultsDisplay(foodResponse, cocktailResponse) {
    $('form.search-parameters').css('display', 'none');
    $('main').append(`
        <div class="display-toggle">
            <button class="dt-cocktail selected">COCKTAILS</button>
            <button class="dt-food">RECIPES</button>
        </div>
        <div class="results">
            <div class="cocktail-results">
                <h2>Raise your spirits...</h2>
                <ul class="cocktail-results-list"></ul>
                <nav role="nav" class="results-nav cocktail-nav">
                    <button class="see-previous-cocktails">Previous</button>
                    <button class="see-more-cocktails">Next</button>
                </nav>
            </div>
            <div class="general-pairing-top">
            </div>
            <div class="food-results">
                <h2>And get cooking!</h2>
                <ul class="food-results-list" id="food-results-list">
                </ul>
                <nav role="nav" class="results-nav food-nav">
                    <button class="see-previous-food">Previous</button>
                    <button class="see-more-food">Next</button>
                </nav>
            </div>
            <div class="general-pairing">
                <h3 class="general-pairing"></h3>
                <p class="general-pairing"></p>
            </div>
        </div>
    `);
    $('header').append(`<button class="new-search">New Search</button>`);
    $('.see-previous-cocktails').css('display', 'none');
    $('.see-previous-food').css('display', 'none');
    if (cocktailResponse.drinks.length <= 4) {
        $('.see-more-cocktails').css('display', 'none');
    };
    if (foodResponse.results.length <= 4) {
        $('.see-more-food').css('display', 'none');
    };
    let displayNumFood = 4;
    let displayNumCocktail = 4;
    getResultsCocktail(cocktailResponse, displayNumCocktail);
    getResultsFood(foodResponse, displayNumFood);
    handleNavCocktails(cocktailResponse, displayNumCocktail);
    handleNavFood(foodResponse, displayNumFood);
    handleToggle();
    handleNewSearch();
    handleResize();
}

//check response for wine pairings
function checkStatusWine(responseJson, searchTerm) {
    if (responseJson.pairedWines.length != 0) {
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
                checkStatusWine(responseJson, searchTerm);
            }
        )
    }
}


//check responses and proceed with display if valid
function checkStatus(cocktailResponse, foodResponse, wineURLArr) {
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
        let cocktailResponse = values[0];
        let foodResponse = values[1];
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
    return combinedArr;
}

//build URL for call to Spoonaculur for food recipes
function buildFoodURL(dish, cuisine, ingredients, diet, course) {
    let spoonURLFood = (spoonURL + 'recipes/searchComplex?limitLicense=false&number=24');
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
        window.scrollTo(0, 0);
    })
}

//listen for user to click get started button and load content
function start() {
    $('.js-start').on('click', function(event) {
        $('main').html(`
        <form class="search-parameters">
        <h2>Search for Recipes</h2>
        <fieldset name="cocktail-search" class="cocktail-search">
            <legend>The important stuff:</legend>
            <label for="cocktail">Find me a cocktail with:<br>(Please separate items by a comma.)</label>
            <input type="text" name="cocktail" placeholder="tequila" id="cocktail">
        </fieldset>
        <fieldset name="food-search" class="food-search">
            <legend>Oh and also, let's eat something:</legend>
            <fieldset name="required-parameters" class="required-parameters">
                <legend class="sub-legend">Search by (at least of one the following):</legend>
                <div class="filter-container required">
                <div class="filter-box required">
                    <label for="dish">Dish:</label>
                    <input type="text" name="dish" placeholder="quiche" id="dish">
                </div>
                <div class="filter-box required">
                    <label for="cuisine">Cuisine:</label>
                    <select name="cuisine" id="cuisine">
                        <option></option>
                        <option value="african">African</option>
                        <option value="american">American</option>
                        <option value="cajun">Cajun</option>
                        <option value="caribbean">Caribbean</option>
                        <option value="chinese">Chinese</option>
                        <option value="eastern european">Eastern European</option>
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
                </div>
                <div class="filter-box required">
                    <label for="ingredients">Ingredients (separate by comma):</label>
                    <input type="text" name="ingredients" placeholder="bacon" id="ingredients">
                </div>
                </div>
            </fieldset>
            <fieldset name="filters" class="optional-parameters">
                <legend class="sub-legend">Filter by:</legend>
                <div class="filter-container">
                <div class="filter-box">
                    <label for="diet">Diet:</label>
                    <select name="diet" id="diet">
                        <option></option>
                        <option value="paleo">Paleo</option>
                        <option value="pescetarian">Pescetarian</option>
                        <option value="vegan">Vegan</option><
                        <option value="vegetarian">Vegetarian</option>
                    </select>
                </div>
                <div class="filter-box">
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
                </div>
                </div>
            </fieldset>
        </fieldset>
        <input type="submit" class="submit-button" value="Find Recipes">
        </form>`);
        $('header').addClass('smallbanner');
        $('h1').addClass('smallbanner');
        $('img.logo').addClass('smallbanner');
    })
    $('img.logo').on('click', function(event) {
        location.reload();
    })
    handleSubmit();
}

$(start);