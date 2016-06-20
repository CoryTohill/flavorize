angular.module('app', ['ngRoute', 'ui.bootstrap'])



//**************************** User Recipe Object Factory *****************************

  .factory('UserRecipe', ($http) => {
    // will eventually be a call to firebase to get recipe info if editing a recipe
    const userRecipe = {"ingredients": []};

    console.log("userRecipe",userRecipe)

    return {
      getRecipe () {
        console.log("factory get userRecipe", userRecipe);
        return userRecipe;
      },
      getAllRecipes () {
        return $http.get(`https://flavorize-front-end-capstone.firebaseio.com/recipes.json`);
      },
    }
  })


//**************************** Firebase Authorization *****************************

  .factory('AuthFactory', ($timeout) => {
    let currentUser = null;

    return {
      login (email, password) {
        return $timeout().then(() => (
          firebase.auth().signInWithEmailAndPassword(email, password)
        )).then((loginResponse) => currentUser = loginResponse.uid);
      },

      logout () {
       return $timeout().then(() => (
          firebase.auth().signOut().then(function() {
            // Sign-out successful.
            currentUser = null;
          }, function(error) {
            // An error happened.
            alert('Error Loggin Out');
          })
        ))
      },

      getUser () {
        return currentUser;
      }
    };
  })



  .factory('SaveRecipeFactory', ($http) => {

    return {
      save (recipe) {

        return $http.post(`https://flavorize-front-end-capstone.firebaseio.com/recipes.json`, recipe)
      }
    }
  })



  .controller('LoginCtrl', function (AuthFactory, $location) {
    const auth = this;

    auth.login = function () {
      AuthFactory.login(auth.user.email, auth.user.password)
        // .then((loginInfo) => auth.currentUser = loginInfo.uid)
        .then(() => $location.path('/recipeEditor'))
    }

  })



  .controller('UserHomeCtrl', function (AuthFactory, UserRecipe) {
    const userHome = this;
    const uid = AuthFactory.getUser();
    UserRecipe.getAllRecipes()
      .then((response) => userHome.userRecipes = response.data);





  })

