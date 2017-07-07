const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret)
}

exports.signin = function(req, res, next) {
  res.json({ token: tokenForUser(req.user)})
}

exports.signup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if(!email || !password) {return res.status(422).json({error: 'Email & Password Required'})}

  User.findOne({ email: email}, (err, existingUser) => {
    if(err) {return next(err)}

    if (existingUser) {
      return res.status(422).send({error: 'email in use'})
    }

    const user = new User({
      email: email,
      password: password
    });

    user.save((err, user) => {
      if(err) { return next(err)}

      res.json({token: tokenForUser(user)});
    })
  })
}
