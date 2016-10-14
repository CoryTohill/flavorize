angular.module('app')

 .factory('SaveRecipeFactory', ($http, UserRecipe) => {
    return {
      save (recipe) {
        const key = UserRecipe.getRecipeKey();
        if (key === "") {
          return $http.post(`https://flavorize-front-end-capstone.firebaseio.com/recipes.json`, recipe);
        } else {
          return $http.put(`https://flavorize-front-end-capstone.firebaseio.com/recipes/${key}.json`, recipe);
        }
      }
    };
  });
