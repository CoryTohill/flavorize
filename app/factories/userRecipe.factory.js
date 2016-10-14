angular.module('app')

  .factory('UserRecipe', ($http, $timeout) => {
    let userRecipe = {"ingredients": []};
    let recipeKey = "";

    return {
      getRecipe () {
        return userRecipe;
      },

      setRecipe (newRecipe) {
        userRecipe = newRecipe;
      },

      getRecipeKey () {
        return recipeKey;
      },

      setRecipeKey (newKey) {
        recipeKey = newKey;
      },

      getUserRecipes (uid) {
        return $timeout()
          .then(() => firebase.database()
                        .ref('/recipes')
                        .orderByChild('uid')
                        .equalTo(uid)
                        .once('value'))
          .then(snap => snap.val());
      }
    };
  });
