var controllers = require ('./controllers');

module.exports = function (app, passport) {
  app
    .get ('/', controllers.loginGet)
    .get ('/login', controllers.loginGet)
    .post ('/login', passport.authenticate ('local_login', {
      successRedirect: '/profile',
      failureRedirect: '/login'
    }))
    .get ('/profile', controllers.isLoggedIn, controllers.profileGet)
		.get ('/logout', controllers.isLoggedIn, controllers.logoutGet);

  //===============facebook==========================
  //=================================================

  app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

  // handle the callback after facebook has authenticated the user
  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
      successRedirect : '/profile',
      failureRedirect : '/'
    })
  );

  return (app);
}
