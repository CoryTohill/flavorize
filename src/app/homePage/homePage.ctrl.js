angular.module('app')

  .controller('HomePageCtrl', function (AllRecipesFactory, UserRecipe, $location) {
    const home = this;

    // gets all recipes from firebase
    AllRecipesFactory.getRecipes()
      .then((response) => home.homeRecipes = response);

    // sets the recipe to view before changing to viewRecipe page
    home.viewRecipe = function (recipe) {
      UserRecipe.setRecipe(recipe);
      $location.path('/viewRecipe');
    };
  });
