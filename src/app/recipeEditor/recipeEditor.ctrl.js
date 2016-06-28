angular.module('app')

  .controller('RecipeEditorCtrl', function (UserRecipe, FoodPairingFactory, SaveRecipeFactory, AuthFactory, USDAFactory) {
    const recipeEditor = this;
    const uid = firebase.auth().currentUser.uid;
    const key = UserRecipe.getRecipeKey();

    recipeEditor.recipe = UserRecipe.getRecipe();
    recipeEditor.recipe.uid = uid;
    recipeEditor.searchedIngredients = [];

    // gets pairings on page load if there is at least 1 ingredient present
    if (recipeEditor.recipe.ingredients[0]) {
      updatePairings();
    }


    // defines the default tab to display when switching to recipeEditor route
    recipeEditor.viewTab = "Recipe";
    recipeEditor.tabs = ["Recipe", "Food Pairing", "Nutrition"];



    // *************************** nutrition ************************************




    recipeEditor.changeTab = function (newTab) {
      recipeEditor.viewTab = newTab;
    };


    // recipeEditor.addNutritionProfile = function (ingredient, selectedProfile) {
    //   console.log("selected USDA profile: ", JSON.parse(selectedProfile))
    //   // won't nutrition info if user chooses the ignore option unless profile was previously something else
    //   if (selectedProfile !== "ignore") {
    //     ingredient.nutritionProfile = JSON.parse(selectedProfile);
    //     getNutritionInfo(ingredient.nutritionProfile);

    //   } else if (ingredient.nutritionProfile) {
    //     ingredient.nutritionProfile = selectedProfile;

    //   } else {
    //     ingredient.nutritionProfile = "ignore";
    //   }
    //   console.log("final ingredient: ", ingredient)
    // // }
    // nutrients
    // }

    recipeEditor.getNutritionInfo = function (ingredient) {
      // console.log("NUT",ndbno)
      ingredient.nutritionProfile = {};
      console.log("INGR", ingredient)
      USDAFactory.getNutritionInfo(ingredient.ndbno)
        // .then((x) => console.log(x[0].name))
        .then((response) => {
          console.log("RESPONSE", response[0]);
          if (response[0] === undefined) {
            alert("No nutrional information available for selected ingredient, please choose the next best option.")
            return ingredient;
          } else {
            ingredient.nutritionProfile.name = response[0].name;
            ingredient.nutritionProfile.nutrients = response[0].nutrients;
            ingredient.nutritionProfile.USDAUnit = response[0].measure;
            return ingredient
          }
        })
        .then((x) => console.log(x))
    }








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
      const index = recipeEditor.recipe.ingredients.indexOf(ingredient);
      recipeEditor.recipe.ingredients.splice(index, 1);

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

        // if ingredient added has parenthesis, the text in the parenthesis is added to additional info
        if (ingredientName.includes("(")) {
          const startIndex = ingredientName.indexOf("(");
          const endIndex = ingredientName.indexOf(")");
          ingredient.userIngredientName = ingredientName.slice(0, startIndex - 1);
          ingredient.additionalInfo = ingredientName.slice(startIndex + 1, endIndex);
        } else {
          ingredient.userIngredientName = ingredientName;
        }


        FoodPairingFactory.searchIngredients(ingredient.userIngredientName)
          .then((data) => {
            return ingredient.searchedIngredients = data;
          })

        USDAFactory.searchUSDAIngredients(ingredient.userIngredientName)
          .then((data) => ingredient.searchedUSDAIngredients = data)

        recipeEditor.recipe.ingredients.push(ingredient);

        // resets the user text input
        recipeEditor.userText = '';
      };
    };

    recipeEditor.saveRecipe = function () {
      SaveRecipeFactory.save(recipeEditor.recipe, key)
        .then((response)=> {
          // if it is a new save, the key is saved so any subsequent saves will update, not post new recipes
          if (response.data.name) {
            UserRecipe.setRecipeKey(response.data.name);
          };
        })
      console.log(recipeEditor.recipe);
    }
  })
