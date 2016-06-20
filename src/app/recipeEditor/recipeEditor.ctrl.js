angular.module('app')

  .controller('RecipeEditorCtrl', function (UserRecipe, FoodPairingFactory, SaveRecipeFactory, AuthFactory) {
    const recipeEditor = this;
    const uid = AuthFactory.getUser();

    recipeEditor.recipe = UserRecipe.getRecipe();
    recipeEditor.recipe.uid = uid;
    recipeEditor.searchedIngredients = [];


    // defines the default tab to display when switchen to recipeEditor route
    recipeEditor.viewTab = "Food Pairing";

    recipeEditor.tabs = ["Recipe", "Food Pairing", "Nutrition"];

    recipeEditor.changeTab = function (newTab) {
      recipeEditor.viewTab = newTab;
    };


    function updatePairings () {
      console.log("update")
      recipeEditor.pairings = [];

      FoodPairingFactory.suggestPairings()
        .then((data) => recipeEditor.pairings = data);
    }


    recipeEditor.addFlavorProfile = function (ingredient, selectedProfile) {
      console.log("flavorProfile",ingredient)
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
      console.log("fin")
    }


    // removes selected ingredient from user array
    recipeEditor.removeIngredient = function (ingredient) {
      const index = recipeEditor.recipe.indexOf(ingredient);
      recipeEditor.recipe.splice(index, 1);

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
        recipeEditor.recipe.ingredients.userIngredientName = ingredient;
        FoodPairingFactory.searchIngredients(ingredient)
          .then((data) => {
            return recipeEditor.recipe.ingredients.searchedIngredients = data;
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

        recipeEditor.recipe.ingredients.push(ingredient);

        // resets the user text input
        recipeEditor.userText = '';
      };
    };

    recipeEditor.saveRecipe = function (test) {
      SaveRecipeFactory.save(recipeEditor.recipe)
      console.log(recipeEditor.recipe);
    }
  })
