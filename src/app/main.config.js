angular.module('app')
  .config(($routeProvider) => (
    $routeProvider
      .when('/recipeEditor', {
        controller: 'RecipeEditorCtrl',
        controllerAs: 'recipeEditor',
        templateUrl: '/app/recipeEditor/recipeEditor.html'
      })
      .when('/login', {
        controller: 'LoginCtrl',
        controllerAs: 'auth',
        templateUrl: '/app/login.html'
      })
      .when('/userHome', {
        controller: 'UserHomeCtrl',
        controllerAs: 'userHome',
        templateUrl: '/app/userHome.html'
      })
  ));
