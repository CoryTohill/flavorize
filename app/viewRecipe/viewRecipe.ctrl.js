angular.module('app')

  .controller('ViewRecipeCtrl', function (UserRecipe, $location) {
    const view = this;
    let currentUser = null;

    // determines if a user is logged in and gets the uid if they are
    if (firebase.auth().currentUser) {
      currentUser = firebase.auth().currentUser.uid;
    }

    view.recipe = UserRecipe.getRecipe();

    //shows or hides the edit recipe button based on which user is logged in
    if (currentUser === view.recipe.uid) {
      view.belongsToUser = true;
    } else {
      view.belongsToUser = false;
    }
  });
