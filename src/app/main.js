angular.module('app', ['ngRoute', 'ui.bootstrap'])



//**************************** User Recipe Object Factory *****************************

  .factory('UserRecipe', () => {
    // will eventually be a call to firebase to get recipe info if editing a recipe
    const userRecipe = [];

    console.log("userRecipe",userRecipe)

    return {
      getRecipe () {
        console.log("factory get userRecipe", userRecipe);
        return userRecipe;
      },
    }
  })









