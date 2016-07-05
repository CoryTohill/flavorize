angular.module('app')

  .factory('FoodPairingFactory', ($http, UserRecipe) => {
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

      suggestPairings () {
        const recipe = UserRecipe.getRecipe();
        let userIngredientIds = [];

        // gets all food ids from user ingredients object if they have a flavor profile that isn't ignored
        recipe.ingredients.forEach(function (ingredient) {
          if (ingredient.flavorProfile && ingredient.flavorProfile !== 'ignore') {
            userIngredientIds.push(ingredient.flavorProfile.id)
          }
        })

        // format the ingredient Ids into a string with commas between values
        userIngredientIds = userIngredientIds.join();

        const pairingRequest = {
          method: 'GET',
          url: `https://api.foodpairing.com/ingredients/${userIngredientIds}/pairings?order=matches[all][rel]`,
          headers: {
            'X-Application-ID': '83dc83f5',
            'X-Application-Key': 'f1a7be912dca2656623166a8a1715478'
          }
        };
        return $http(pairingRequest).then((response) => data = response.data);
      }
    };
  })
