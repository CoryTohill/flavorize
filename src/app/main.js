angular.module('app', ['ngRoute', 'ui.bootstrap'])
  .controller('PairingCtrl', function (FoodPairingFactory) {
    const pairing = this;
    pairing.searchedIngredients = ''

    pairing.searchIngredients = function (ingredient) {
      console.log(ingredient);
      FoodPairingFactory.ingredientInfo(ingredient)
        .then((data) => {
          return pairing.searchedIngredients = data;
        }).then(console.log)
    }

    pairing.addIngredient = function (test) {
      console.log(test);
    }

  })

  .factory('FoodPairingFactory', ($http) => {
    return {
      ingredientInfo (ingredient) {
        let request = {
          method: 'GET',
          url: `https://api.foodpairing.com/ingredients?q=${ingredient}?order=matches[all][rel]`,
          headers: {
            'X-Application-ID': '83dc83f5',
            'X-Application-Key': 'f1a7be912dca2656623166a8a1715478'
          }
        };

        return $http(request).then((response) => data = response.data)
      }
    }
  })
