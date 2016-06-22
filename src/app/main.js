angular.module('app', ['ngRoute', 'ui.bootstrap'])



//**************************** User Recipe Object Factory *****************************

  .factory('UserRecipe', ($http, $timeout) => {
    // will eventually be a call to firebase to get recipe info if editing a recipe
    let userRecipe = {"ingredients": []};
    let recipeKey = "";

    console.log("userRecipe",userRecipe)

    return {
      getRecipe () {
        console.log("factory get userRecipe", userRecipe);
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
        console.log("logout")
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



  .factory('SaveRecipeFactory', ($http, UserRecipe) => {

    return {
      save (recipe) {
        const key = UserRecipe.getRecipeKey();
        if (key === "") {
          return $http.post(`https://flavorize-front-end-capstone.firebaseio.com/recipes.json`, recipe)
        } else {
          return $http.put(`https://flavorize-front-end-capstone.firebaseio.com/recipes/${key}.json`, recipe)
        }
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
    auth.logout = function () {
      AuthFactory.logout()
        .then(() => $location.path('/'))
    }

  })



  .controller('UserHomeCtrl', function (AuthFactory, UserRecipe, $location) {
    const userHome = this;
    const currentUser = firebase.auth().currentUser.uid;

    UserRecipe.getUserRecipes(currentUser)
      .then((response) => userHome.userRecipes = response);

    userHome.newRecipe = function () {
      console.log("clicked")
      $location.path('/recipeEditor');
    }

    userHome.viewRecipe = function (recipe) {
      // determines which unique firebase key belongs to the recipe selected
      const recipesValues = Object.values(userHome.userRecipes);
      const recipesKeys = Object.keys(userHome.userRecipes);
      const index = recipesValues.indexOf(recipe);
      const key = recipesKeys[index];

      // sets the current recipe and its unique key from firebase
      UserRecipe.setRecipeKey(key);

      UserRecipe.setRecipe(recipe);
      // change to view recipe page
      $location.path('/viewRecipe');
    }

  })

  .controller('ViewRecipeCtrl', function (UserRecipe, $location) {
    const view = this;
    const currentUser = firebase.auth().currentUser.uid;

    view.recipe = UserRecipe.getRecipe();
    console.log("view",view.recipe)

    //shows or hides the edit recipe button based on which user is logged in
    if (currentUser === view.recipe.uid) {
      view.belongsToUser = true;
    } else {
      view.belongsToUser = false;
    };

    view.editRecipe = function () {
      $location.path('/recipeEditor')
    }
  })

