angular.module('app')

  .controller('LoginCtrl', function (AuthFactory, $location) {
    const auth = this;

    auth.login = function (button) {
      AuthFactory.login(auth.user.email, auth.user.password)
        // .then((loginInfo) => auth.currentUser = loginInfo.uid)
        .then(() => $location.path('/'))
        .catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          alert(errorMessage);
        });
    };

    auth.register = function (variable) {
      AuthFactory.register(auth.user.email, auth.user.password)
        .then(() => $location.path('/'))
        .catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          alert(errorMessage);
        });
    };
  });
