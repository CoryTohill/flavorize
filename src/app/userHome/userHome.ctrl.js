angular.module('app')

  .controller('UserHomeCtrl', function (AuthFactory, UserRecipe, $location) {
    const userHome = this;
    const currentUser = firebase.auth().currentUser.uid;

    UserRecipe.getUserRecipes(currentUser)
      .then((response) => userHome.userRecipes = response);

    userHome.newRecipe = function () {
      UserRecipe.setRecipe({"ingredients": []});
      $location.path('/recipeEditor');
    }

    userHome.editRecipe = function (recipe) {
      const recipesValues = Object.values(userHome.userRecipes);
      const recipesKeys = Object.keys(userHome.userRecipes);
      const index = recipesValues.indexOf(recipe);
      const key = recipesKeys[index];

      UserRecipe.setRecipeKey(key);

      UserRecipe.setRecipe(recipe);

      $location.path('/recipeEditor')
    }

    userHome.viewRecipe = function (recipe) {
      UserRecipe.setRecipe(recipe);
      // change to view recipe page
      $location.path('/viewRecipe');
    }

  })
