angular.module('app')

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


    // removes selected ingredient from user array
    recipeEditor.removeIngredient = function (ingredient) {
      const index = recipeEditor.userIngredients.indexOf(ingredient);
      recipeEditor.userIngredients.splice(index, 1);

      // gets new suggestions if the deleted ingredient has a flavor profile selected other than ignore
      if (ingredient.flavorProfile && ingredient.flavorProfile !== "ignore") {
        recipeEditor.pairings = [];

        FoodPairingFactory.suggestPairings()
          .then((data) => {
            recipeEditor.pairings = data
        })
      };
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

    recipeEditor.saveRecipe = function (test) {
      console.log(recipeEditor.userIngredients);
    }
  })
