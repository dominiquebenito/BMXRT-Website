/* Author: Dominique Benito
 * Date: November 05, 2015
 * Note: Verifying username and password / actions needed to sign up
 */

var APPLICATION_ID = "hSwI4WHttYwUvux9ArkLXrWg3owoH5GXWLBJlCIy";
var SECRET_KEY = "mHmGDEW42xYFcCoZld9X9EZOVR4VH91JbkQonkTl";

Parse.initialize(APPLICATION_ID, SECRET_KEY);

function validate(pswrd1, pswrd2) {
  if (pswrd1 != pswrd2) {
    alert("Passwords do not match");
    return false;
  }

  return true;
}

function createUser(form) {
  if(!validate(form.pswrd.value, form.pswrd2.value))
    return;

  var currentUser = Parse.User.current();
  if (currentUser) 
    Parse.User.logOut();

  var user = new Parse.User();
  user.set("fullname", form.name.value);
  user.set("username", form.userid.value)
  user.set("password", form.pswrd.value);
  user.set("email", form.email.value);

  var currentUser = Parse.User.current();
  if (currentUser)
      Parse.User.logOut();
  
  user.signUp(null, {
    success: function(user) {
      sessionStorage.setItem('user', form.userid.value);
      var NewUser = Parse.Object.extend(form.userid.value);
      var newUser = new NewUser();

      var date = new Date().toUTCString().split(" ").slice(1, 5);
      var dateString = date[1].concat(" ").concat(date[0]).concat(", ").concat(date[2]).concat(" ").concat(date[3]);

      newUser.set("completionTime", 0.0);
      newUser.set("reactionTime", 0.0);
      newUser.set("heartRate", [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])
      newUser.set("bpm", 0);

      newUser.save(null, {
        success: function(gameScore) {
          console.log(newUser);
          location.href="home.html";
        },
        error: function(gameScore, error) {
          alert('Failed to create account, with error code: ' + error.message);
        }
      });
    },
    error: function(user, error) {
      alert("Error: " + error.code + " " + error.message);
    }
  });
}

function loginUser(form) {
  var currentUser = Parse.User.current();
  if (currentUser)
      Parse.User.logOut();
  
  Parse.User.logIn(form.userid.value, form.pswrd.value, {
    success: function(user) {
      sessionStorage.setItem('user', form.userid.value);
      location.href="home.html";
    },
    error: function(user, error) {
      alert("Error: " + error.code + " " + error.message);
    }
  });
}