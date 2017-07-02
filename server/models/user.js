const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs')
const Schema = mongoose.Schema;

const userSchema = new Schema ({
  email: { type: String, unique: true, lowercase: true },
  password: String
});

// run this before saving (pre => save)
userSchema.pre('save', function(next) {
  // get's access to the user model
  const user = this;
  // generate a salt then run callback
  bcrypt.genSalt(10, (err, salt) => {
    if(err) {return next(err)}

    // hash pw using salt
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if(err) {return next(err)}
      // overwrite pw with hash
      user.password = hash;
      next();
    });
  });
})

userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if(err) {
      return callback(err)
    }

    callback(null, isMatch)
  })
}

const ModelClass = mongoose.model('user', userSchema);

module.exports = ModelClass;
