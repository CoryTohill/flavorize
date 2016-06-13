angular.module('app', ['ngRoute', 'ui.bootstrap'])
  .controller('PairingCtrl', function () {
    const pairing = this;

    pairing.addIngredient = function (ingredient) {
      console.log(ingredient);
    }

  })
