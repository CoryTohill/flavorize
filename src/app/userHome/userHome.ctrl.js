angular.module('app')

  .controller('UserHomeCtrl', function (AuthFactory, UserRecipe, $location, deleteRecipeFactory) {
    const userHome = this;
    const currentUser = firebase.auth().currentUser.uid;

    UserRecipe.getUserRecipes(currentUser)
      .then((response) => userHome.userRecipes = response);

    userHome.newRecipe = function () {
      // resets the current recipe
      UserRecipe.setRecipe({"ingredients": []});
      // resets the recipe key
      UserRecipe.setRecipeKey("");

      $location.path('/recipeEditor');
    }

    userHome.editRecipe = function (recipe) {
      // determines the unique firebase key for the recipe selected
      const recipesValues = Object.values(userHome.userRecipes);
      const recipesKeys = Object.keys(userHome.userRecipes);
      const index = recipesValues.indexOf(recipe);
      const key = recipesKeys[index];

      UserRecipe.setRecipeKey(key);

      UserRecipe.setRecipe(recipe);

      $location.path('/recipeEditor')
    }

    userHome.deleteRecipe = function (recipe) {
      // determines the unique firebase key for the recipe selected
      const recipesValues = Object.values(userHome.userRecipes);
      const recipesKeys = Object.keys(userHome.userRecipes);
      const index = recipesValues.indexOf(recipe);
      const key = recipesKeys[index];

      deleteRecipeFactory.delete(key)
        // updates the recipes on the current page after the selected recipe is deleted
        .then(() => UserRecipe.getUserRecipes(currentUser))
        .then((response) => userHome.userRecipes = response);
    }

    userHome.viewRecipe = function (recipe) {
      UserRecipe.setRecipe(recipe);
      // change to view recipe page
      $location.path('/viewRecipe');
    }

  })
