angular.module('app')
  .config(($routeProvider) => (
    $routeProvider
      .when('/pairing', {
        controller: 'PairingCtrl',
        controllerAs: 'pairing',
        templateUrl: '/app/pairing.html'
      })
      .when('/recipe', {
        controller: 'RecipeCtrl',
        controllerAs: 'recipe',
        templateUrl: '/app/recipe.html'
      })
  ));
