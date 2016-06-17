angular.module('app')
  .config(() => (
    firebase.initializeApp({
      apiKey: "AIzaSyCptyoC-x5hm4Ut5Nu2a_CqHdCkH21A458",
      authDomain: "flavorize-front-end-capstone.firebaseapp.com",
      databaseURL: "https://flavorize-front-end-capstone.firebaseio.com",
      storageBucket: "flavorize-front-end-capstone.appspot.com",
  })));

