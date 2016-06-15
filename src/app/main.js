angular.module('app', ['ngRoute', 'ui.bootstrap'])

//****************** Pairing Page***********************

  .controller('PairingCtrl', function (FoodPairingFactory) {
    const pairing = this;

    pairing.userIngredients = [];
    pairing.searchedIngredients = [];
    pairing.showSelectIngredient = false;

    function getPairingSuggestions () {
      // clears the suggestions displayed
      pairing.pairings = [];
      // gets all food ids from user ingredients object
      const userIngredientsIds = pairing.userIngredients.map((obj) => obj.id);

      // if statement prevents factory from firing if user has no ingredients selected
      if (0 < userIngredientsIds.length) {
        FoodPairingFactory.suggestPairings(userIngredientsIds)
          .then((data) => { return pairing.pairings = data; });
      }
    };

    // changes value for ng-show to the opposite of what it is currently set as
    pairing.toggleSelectElement = function () {
      pairing.showSelectIngredient = !pairing.showSelectIngredient;
    };

    // calls API search for available foods based on user text
    pairing.searchIngredients = function (ingredient) {
      FoodPairingFactory.searchIngredients(ingredient)
        .then((data) => {
          return pairing.searchedIngredients = data;
        });
    };

    pairing.addIngredient = function (ingredient) {
      // resets the user text input
      pairing.ingredient = '';

      // parses ingredient if what is passed in is not alreay an object
      if (typeof ingredient !== "object") {
        ingredient = JSON.parse(ingredient);
      }

      pairing.userIngredients.push(ingredient);

      getPairingSuggestions();
    };

    // removes selected ingredient from user array and gets new suggestions
    pairing.removeIngredient = function (ingredient) {
      const index = pairing.userIngredients.indexOf(ingredient);
      pairing.userIngredients.splice(index, 1);

      getPairingSuggestions();
    };
  })


  .factory('FoodPairingFactory', ($http) => {
    return {
      searchIngredients (ingredient) {
        const searchRequest = {
          method: 'GET',
          url: `https://api.foodpairing.com/ingredients?q=${ingredient}?order=matches[all][rel]`,
          headers: {
            'X-Application-ID': '83dc83f5',
            'X-Application-Key': 'f1a7be912dca2656623166a8a1715478'
          }
        };
        return $http(searchRequest).then((response) => data = response.data);
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
        };
        return $http(pairingRequest).then((response) => data = response.data);
      }
    };
  })



//**************************** Recipe Page *****************************

  .controller('RecipeCtrl', function () {
    const recipe = this;



  })
