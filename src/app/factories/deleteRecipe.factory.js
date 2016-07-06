angular.module('app')
  .factory("deleteRecipeFactory", ($http) => {
    return {
      delete (key) {
        return $http.delete(`https://flavorize-front-end-capstone.firebaseio.com/recipes/${key}.json`);
      }
    };
  });
