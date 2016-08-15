 angular.module('app')

  .config(($routeProvider) => (
    $routeProvider
      .when('/', {
        controller: 'HomePageCtrl',
        controllerAs: 'home',
        templateUrl: 'app/homePage/homePage.html'
      })
      .when('/recipeEditor', {
        controller: 'RecipeEditorCtrl',
        controllerAs: 'recipeEditor',
        templateUrl: 'app/recipeEditor/recipeEditor.html'
      })
      .when('/login', {
        controller: 'LoginCtrl',
        controllerAs: 'auth',
        templateUrl: 'app/login/login.html'
      })
      .when('/userHome', {
        controller: 'UserHomeCtrl',
        controllerAs: 'userHome',
        templateUrl: 'app/userHome/userHome.html'
      })
      .when('/viewRecipe', {
        controller: 'ViewRecipeCtrl',
        controllerAs: 'view',
        templateUrl: 'app/viewRecipe/viewRecipe.html'
      })
  ));
