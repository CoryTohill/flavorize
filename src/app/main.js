angular.module('app', ['ngRoute', 'ui.bootstrap'])

//****************** Pairing Page***********************

 //  .controller('PairingCtrl', function (FoodPairingFactory, UserRecipe) {

 //    const pairing = this;

 //    }

 //    // recipeEditor.getPairingSuggestions = function () {
 //    //   // clears the suggestions displayed
 //    //   pairing.pairings = [];


 //    //   // if statement prevents factory from firing if user has no ingredients selected
 //    //   if (0 < userIngredientIds.length) {
 //    //     FoodPairingFactory.suggestPairings(userIngredientIds)
 //    //       .then((data) => { return pairing.pairings = data; });
 //    //   }
 //    // };

 //    // recipeEditor.getPairingSuggestions();
 // })


  .factory('FoodPairingFactory', ($http, UserRecipe) => {
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

      suggestPairings () {
        const userIngredients = UserRecipe.getRecipe();
        let userIngredientIds = [];

        // gets all food ids from user ingredients object if they have a flavor profile that isn't ignored
        userIngredients.forEach(function (ingredient) {
          if (ingredient.flavorProfile && ingredient.flavorProfile !== 'ignore') {
            userIngredientIds.push(ingredient.flavorProfile.id)
          }
        })

        // format the ingredient Ids into a string with commas between values
        userIngredientIds = userIngredientIds.join();

        const pairingRequest = {
          method: 'GET',
          url: `https://api.foodpairing.com/ingredients/${userIngredientIds}/pairings?order=matches[all][rel]`,
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
    }
  })



//**************************** Recipe Page *****************************



  .controller('MainNavCtrl', function () {
    const mainNav = this;

  })




  .controller('RecipeEditorCtrl', function (UserRecipe, FoodPairingFactory, $timeout, $scope) {
    const recipeEditor = this;

    recipeEditor.userIngredients = UserRecipe.getRecipe();
    recipeEditor.searchedIngredients = [];

    // defines the default tab to display when switchen to recipeEditor route
    recipeEditor.viewTab = "Food Pairing";

    recipeEditor.tabs = ["Recipe", "Food Pairing", "Nutrition"];

    recipeEditor.changeTab = function (newTab) {
      recipeEditor.viewTab = newTab;
    };


    function updatePairings () {
      recipeEditor.pairings = [];

      FoodPairingFactory.suggestPairings()
        .then((data) => recipeEditor.pairings = data);
    }


    recipeEditor.addFlavorProfile = function (ingredient, selectedProfile) {

      // won't update pairing suggestions if user chooses the ignore option unless profile was previously something else
      if (selectedProfile !== "ignore") {
        ingredient.flavorProfile = JSON.parse(selectedProfile);
        updatePairings();

      } else if (ingredient.flavorProfile) {
        ingredient.flavorProfile = selectedProfile;
        updatePairings();

      } else {
        ingredient.flavorProfile = "ignore";
      }
    }


    // removes selected ingredient from user array and gets new suggestions
    recipeEditor.removeIngredient = function (ingredient) {
      recipeEditor.pairings = [];
      const index = recipeEditor.userIngredients.indexOf(ingredient);
      recipeEditor.userIngredients.splice(index, 1);

      FoodPairingFactory.suggestPairings()
        .then((data) => {
          recipeEditor.pairings = data
        })
        ;
    };


    // calls API search for available foods based on user text
    recipeEditor.searchIngredients = function (ingredient) {
      // prevents user from searching without entering text
      if (ingredient === ('' || 'undefined')) {
        alert("Search field must not be blank")
      } else {
        recipeEditor.userIngredients.userIngredientName = ingredient;
        FoodPairingFactory.searchIngredients(ingredient)
          .then((data) => {
            return recipeEditor.searchedIngredients = data;
          });
      };
    };


    recipeEditor.addIngredient = function (ingredientName) {
      // tests if user inputs text correctly before running
      if (ingredientName === ('' || undefined)) {
        alert("Incorrect Text Input");
      } else {
        const ingredient = {};

        ingredient.userIngredientName = ingredientName;

        FoodPairingFactory.searchIngredients(ingredientName)
          .then((data) => {
            return ingredient.searchedIngredients = data;
          })

        recipeEditor.userIngredients.push(ingredient);

        // resets the user text input
        recipeEditor.userText = '';
      };
    };
  })
