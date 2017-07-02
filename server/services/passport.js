const passport = require('passport'),
      User = require('../models/user'),
      config = require('../config'),
      JwtStrategy = require('passport-jwt').Strategy,
      ExtractJwt = require('passport-jwt').ExtractJwt,
      LocalStrategy = require('passport-local');

// creat local Strategy
const localOptions = { usernameField: 'email'};
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {

  User.findOne({ email: email }, (err, user) => {
    if(err) { return done(err); }
    if(!user) { return done(null, false)}

    //compare passwords to supplied and db


    user.comparePassword(password, (err, isMatch) => {
      if (err) { return done(err); }
      if(!isMatch) { return done(null, false); }

      return done(null, user);
    })
  })
})

// Set up options for jwt stragegy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

//create jwt Strategy

const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  //check if user ID exists, if it does call done with user, if not call done without a user object

  User.findById(payload.sub, (err,user) => {
    if (err) { return done(err, false); }

    if (user) {
      done(null, user);
    } else {
      done(null, false)
    }
  });

});


//tell passport to use this strategy

passport.use(jwtLogin);
passport.use(localLogin);
