angular.module('app', ['ngRoute', 'ui.bootstrap'])
  .controller('PairingCtrl', function (FoodPairingFactory) {
    const pairing = this;
    pairing.searchedIngredients = [];
    pairing.ingredientIds = [];
    pairing.selectedIngredients = [];


    // calls API search for available foods based on user text
    pairing.searchIngredients = function (ingredient) {
      FoodPairingFactory.ingredientInfo(ingredient)
        .then((data) => {
          return pairing.searchedIngredients = data;
        })
    };

    pairing.addIngredient = function (ingredient) {
      ingredient = JSON.parse(ingredient);
      pairing.selectedIngredients.push(ingredient.name);

      pairing.ingredientIds.push(ingredient.id);
      FoodPairingFactory.suggestPairings(pairing.ingredientIds)
        .then((data) => {
          return pairing.pairings = data;
        })
    };

  })

  .factory('FoodPairingFactory', ($http) => {
    return {
      ingredientInfo (ingredient) {
        const searchRequest = {
          method: 'GET',
          url: `https://api.foodpairing.com/ingredients?q=${ingredient}?order=matches[all][rel]`,
          headers: {
            'X-Application-ID': '83dc83f5',
            'X-Application-Key': 'f1a7be912dca2656623166a8a1715478'
          }
        };

        return $http(searchRequest).then((response) => data = response.data)
      },

      suggestPairings (ingredientIds) {
        const Ids = ingredientIds.join();
        const pairingRequest = {
          method: 'GET',
          url: `https://api.foodpairing.com/ingredients/${Ids}/pairings?order=matches[all][rel]`,
          headers: {
            'X-Application-ID': '83dc83f5',
            'X-Application-Key': 'f1a7be912dca2656623166a8a1715478'
          }
        }
        return $http(pairingRequest).then((response) => data = response.data);
      }
    }
  })
