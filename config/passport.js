var localStrategy = require ('passport-local').Strategy,
    facebookStrategy = require ('passport-facebook').Strategy,
    userModel = require ('mongoose').model ('users');

module.exports = function (passport) {
  passport.serializeUser (function (user, done) {
		done (null, user.id);
	});
	passport.deserializeUser (function (id, done) {
		userModel.findById (id, function (err, user) {
			done (err, user);
		});
	});

  //===============Local Login Strategy==========================
  //=============================================================
  passport.use ('local_login', new localStrategy ({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  function (req, email, password, done) {
    userModel.findOne ({'local.email': email, 'local.password': password}, {'local.email': 1, facebook: 1}, function (err, response) {
      if (err) {
        return (done (err));
      }
      else if (response) {
        return (done (null, response));
      }
      return (done (null, false));
    });
  }));

  //===============Local signup Strategy=============
  //=================================================

  passport.use ('local_signup', new localStrategy ({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  function (req, email, password, done) {
    process.nextTick (function () {
      userModel.findOne ({'local.email': email}, {_id: 1}, function (err, response) {
        if (err) {
          return (done (err));
        }
        else if (response) {
          return (done (null, false));
        }
        else {
          var newUser = new userModel ();

          newUser.local.email = email;
          newUser.local.password = password;

          newUser.save (function (err) {
            if (err) {
              throw (err);
            }
            else {
              return (done (null, newUser));
            }
          });
        }
      });
    });
  }));

  //========facebook Signup+Login Strategy===========
  //=================================================
  passport.use (new facebookStrategy ({
    clientID: '570197129796800', // your App ID
    clientSecret: '8eb2c4d9dcd49cc7ddab9c0c97d4659e', // your App Secret
    callbackURL: 'http://localhost:8080/auth/facebook/callback'
  },
  function (token, refreshToken, profile, done) {
    process.nextTick (function () {
      userModel.findOne ({'facebook.id': profile.id}, function (err, response) {
        if (err) {
          return (done (err));
        }
        else if (response) {
          return (done (null, response));
        }
        else {
          var newUser = new userModel ();

          newUser.facebook.id    = profile.id; // set the users facebook id
          newUser.facebook.token = token; // we will save the token that facebook provides to the user
          newUser.facebook.displayName  = profile.displayName; // look at the passport user profile to see how names are returned

          // save our user to the database
          newUser.save(function(err) {
            if (err) {
              throw err;
            }
            // if successful, return the new user
            return done(null, newUser);
          });
        }
      });
    });
  }));
};
//Beware of the Callback Hell :-S
