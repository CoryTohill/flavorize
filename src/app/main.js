angular.module('app', ['ngRoute', 'ui.bootstrap'])



//**************************** User Recipe Object Factory *****************************

  .factory('UserRecipe', ($http, $timeout) => {
    // will eventually be a call to firebase to get recipe info if editing a recipe
    let userRecipe = {"ingredients": []};

    console.log("userRecipe",userRecipe)

    return {
      getRecipe () {
        console.log("factory get userRecipe", userRecipe);
        return userRecipe;
      },
      setRecipe (newRecipe) {
        userRecipe = newRecipe;
      },
      getUserRecipes (uid) {
        return $timeout()
          .then(() => firebase.database()
                        .ref('/recipes')
                        .orderByChild('uid')
                        .equalTo(uid)
                        .once('value'))
          .then(snap => snap.val())
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
        .then(() => $location.path('/userHome'))
    }

  })



  .controller('UserHomeCtrl', function (AuthFactory, UserRecipe, $location) {
    const userHome = this;
    const currentUser = firebase.auth().currentUser.uid;

    UserRecipe.getUserRecipes(currentUser)
      .then((response) => userHome.userRecipes = response);

    userHome.viewRecipe = function (recipe) {
      UserRecipe.setRecipe(recipe);
      $location.path('/viewRecipe');
    }

  })

  .controller('ViewRecipeCtrl', function (UserRecipe) {
    const view = this;
    view.recipe = UserRecipe.getRecipe();
    console.log("view.recipe", view.recipe)
  })

