angular.module('app', ['ngRoute', 'ui.bootstrap'])

//****************** Pairing Page***********************

  .controller('PairingCtrl', function (FoodPairingFactory, UserRecipe) {

    const pairing = this;
    pairing.userIngredients = UserRecipe.getRecipe();
    pairing.searchedIngredients = [];
    pairing.showSelectIngredient = false;

    // pairing.setUserRecipe = function () {
    //   UserRecipe.setRecipe(pairing.userIngredients);
    // }

    function getPairingSuggestions () {
      // clears the suggestions displayed
      pairing.pairings = [];
      // gets all food ids from user ingredients object
      const userIngredientsIds = pairing.userIngredients.map((obj) => obj.id);

      // if statement prevents factory from firing if user has no ingredients selected
      if (0 < userIngredientsIds.length) {
        FoodPairingFactory.suggestPairings(userIngredientsIds)
          .then((data) => { return pairing.pairings = data; });
      }
    };

    // changes value for ng-show to the opposite of what it is currently set as
    pairing.toggleSelectElement = function () {
      pairing.showSelectIngredient = !pairing.showSelectIngredient;
    };

    // calls API search for available foods based on user text
    pairing.searchIngredients = function (ingredient) {
      // prevents user from searching without entering text
      if (ingredient === '' || 'undefined') {
        alert("Search field must not be blank")
      } else {
        FoodPairingFactory.searchIngredients(ingredient)
          .then((data) => {
            return pairing.searchedIngredients = data;
          });
      };
    };

    pairing.addIngredient = function (ingredientInfo) {

      // if user added ingredient from suggestion list, the suggestion name is used
      if (pairing.userText === '') {
        pairing.userText = ingredientInfo.name;
      }

      // parses ingredient if what is passed in is not alreay an object
      if (typeof ingredientInfo !== "object") {
        ingredientInfo = JSON.parse(ingredientInfo);
      }
      ingredientInfo.userIngredientName = pairing.userText;

      pairing.userIngredients.push(ingredientInfo);

      getPairingSuggestions();

      // resets the user text input
      pairing.userText = '';
    };

    // removes selected ingredient from user array and gets new suggestions
    pairing.removeIngredient = function (ingredient) {
      const index = pairing.userIngredients.indexOf(ingredient);
      pairing.userIngredients.splice(index, 1);

      getPairingSuggestions();
    };
  })


  .factory('FoodPairingFactory', ($http) => {
    return {
      searchIngredients (ingredient) {
        const searchRequest = {
          method: 'GET',
          url: `https://api.foodpairing.com/ingredients?q=${ingredient}?order=matches[all][rel]`,
          headers: {
            'X-Application-ID': '83dc83f5',
            'X-Application-Key': 'f1a7be912dca2656623166a8a1715478'
          }
        };
        return $http(searchRequest).then((response) => data = response.data);
      },

      suggestPairings (ingredientIds) {
        const Ids = ingredientIds.join();
        const pairingRequest = {
          method: 'GET',
          url: `https://api.foodpairing.com/ingredients/${Ids}/pairings?order=matches[all][rel]`,
          headers: {
            'X-Application-ID': '83dc83f5',
            'X-Application-Key': 'f1a7be912dca2656623166a8a1715478'
          }
        };
        return $http(pairingRequest).then((response) => data = response.data);
      }
    };
  })

//**************************** User Recipe Object Factory *****************************

  .factory('UserRecipe', () => {
    // will eventually be a call to firebase to get recipe info if editing a recipe
    const userRecipe = [];

    console.log("userRecipe",userRecipe)

    return {
      getRecipe () {
        console.log("factory get userRecipe", userRecipe);
        return userRecipe;
      },
      setRecipe (recipe) {
        userRecipe = recipe;
      }
    }
  })



//**************************** Recipe Page *****************************

  .controller('RecipeCtrl', function (UserRecipe) {
    const recipe = this;

    recipe.userIngredients = UserRecipe.getRecipe();
    console.log("recipe one",recipe.userIngredients);


  })


  .controller('MainNavCtrl', function () {
    const mainNav = this;

  })


  .controller('RecipeEditorCtrl', function () {
    const recipeEditor = this;

    // defines the default tab to display when switchen to recipeEditor route
    recipeEditor.viewTab = "Food Pairing";

    recipeEditor.tabs = ["Recipe", "Food Pairing", "Nutrition"];

    recipeEditor.changeTab = function (newTab) {
      recipeEditor.viewTab = newTab;
    };
  })
