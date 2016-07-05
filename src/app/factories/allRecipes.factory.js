angular.module('app')

  .factory('AllRecipesFactory', ($timeout) => {
    return {
      getRecipes () {
        return $timeout()
          .then(() => firebase.database()
                        .ref('/recipes')
                        .once('value'))
          .then(snap => snap.val())
      }
      }
  })
