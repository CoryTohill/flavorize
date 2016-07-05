angular.module('app')

  .controller('RecipeEditorCtrl', function (UserRecipe, FoodPairingFactory, SaveRecipeFactory, AuthFactory, USDAFactory, uploadFactory) {
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


    recipeEditor.getNutritionInfo = function (ingredient) {
      ingredient.nutritionProfile = {};

      USDAFactory.getNutritionInfo(ingredient.ndbno)
        .then((response) => {
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
    }



    recipeEditor.updateNutritionValues = function () {
      recipeEditor.recipe.sugar = 0;
      recipeEditor.recipe.fat = 0;
      recipeEditor.recipe.carbs = 0;
      recipeEditor.recipe.calories = 0;


      angular.forEach(recipeEditor.recipe.ingredients, function (ingredient) {
        const USDAAmount = ingredient.nutritionProfile.USDAAmount;

        angular.forEach(ingredient.nutritionProfile.nutrients, function (nutrient){

          // determines what type of nutrient it is based on its nutrient_id,
          // and adds the amount based on user input into the correct category
          switch (nutrient.nutrient_id) {
            case "269":
              recipeEditor.recipe.sugar += Number(nutrient.value) * USDAAmount;
              break;

            case "204":
              recipeEditor.recipe.fat += Number(nutrient.value) * USDAAmount;
              break;

            case "205":
              recipeEditor.recipe.carbs += Number(nutrient.value) * USDAAmount;
              break;

            case "208":
              recipeEditor.recipe.calories += Number(nutrient.value) * USDAAmount;
          }
        })
      })
      recipeEditor.updateNutritionValuesPerServing();
    }

    recipeEditor.updateNutritionValuesPerServing = function () {
      // calculates the nutrient values per serving
      recipeEditor.recipe.sugarPerServing = recipeEditor.recipe.sugar / recipeEditor.recipe.servings;
      recipeEditor.recipe.fatPerServing = recipeEditor.recipe.fat / recipeEditor.recipe.servings;
      recipeEditor.recipe.carbsPerServing = recipeEditor.recipe.carbs / recipeEditor.recipe.servings;
      recipeEditor.recipe.caloriesPerServing = recipeEditor.recipe.calories / recipeEditor.recipe.servings;
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

        // if ingredient added has parenthesis, only the text before the parenthesis is used,
        // and the text in the parenthesis is added to additional info
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
    }

    recipeEditor.uploadImage = function () {
      const input = document.querySelector('[type="file"]')
      const file = input.files[0]

      const randomInteger = Math.random() * 1e17
      const getFileExtension = file.type.split('/').slice(-1)[0]
      const randomPath = `${randomInteger}.${getFileExtension}`

      uploadFactory.send(file, randomPath)
        .then(res => {
          recipeEditor.recipe.photoURL = res.downloadURL;
          return res.downloadURL
        })
    }
  })

