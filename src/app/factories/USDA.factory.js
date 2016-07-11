angular.module('app')

  .factory('USDAFactory', ($http) => {
    const apiKey = "4H9cuHC4fIMlaTZgpPo0CClPGIm57pDalvQuiCPh";

    return {
      searchUSDAIngredients (ingredient) {
        return $http.get(`http://api.nal.usda.gov/ndb/search/?format=json&q=${ingredient}&sort=r&max=25&offset=0&subset=1&api_key=${apiKey}`)
          .then((response) => response.data.list.item);
      },
      getNutritionInfo (ndbno) {
        return $http.get(`http://api.nal.usda.gov/ndb/nutrients/?format=json&api_key=${apiKey}&nutrients=205&nutrients=204&nutrients=208&nutrients=269&ndbno=${ndbno}`)
          .then((response) => response.data.report.foods);
      }
    };
  });
