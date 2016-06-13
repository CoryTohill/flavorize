angular.module('app')
  .config(($routeProvider) => (
    $routeProvider
      .when('/pairing', {
        controller: 'PairingCtrl',
        controllerAs: 'pairing',
        templateUrl: '/app/pairing.html'
      })
  ));
