angular.module('app')

  .factory('AuthFactory', ($timeout, $location) => {
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
            alert('Error Logging Out');
          })
        ));
      },

      register (email, password) {
        return $timeout().then(() => (
          firebase.auth().createUserWithEmailAndPassword(email, password)
        ));
      },

      getUser () {
        return currentUser;
      }
    };
  });
