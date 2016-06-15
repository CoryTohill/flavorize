angular.module('app')
  .config(($routeProvider) => (
    $routeProvider
      .when('/recipeEditor', {
        controller: 'RecipeEditorCtrl',
        controllerAs: 'recipeEditor',
        templateUrl: '/app/recipeEditor.html'
      })
      .when('/recipe', {
        controller: 'RecipeCtrl',
        controllerAs: 'recipe',
        templateUrl: '/app/recipe.html'
      })
  ));
