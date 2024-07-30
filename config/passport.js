const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
// set up Passport strategy
passport.use(
  new LocalStrategy(
    // customize user field
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    // authenticate user
    (req, email, password, cb) => {
      User.findOne({ where: { email } }).then((user) => {
        if (!user)
          return cb(
            null,
            false,
            req.flash('error_messages', 'Incorrect username or password ！')
          );
        bcrypt.compare(password, user.password).then((res) => {
          if (!res)
            return cb(
              null,
              false,
              req.flash('error_messages', 'Incorrect username or password！')
            );
          return cb(null, user);
        });
      });
    }
  )
);
// serialize and deserialize user
passport.serializeUser((user, cb) => {
  cb(null, user.id);
});
passport.deserializeUser((id, cb) => {
  User.findByPk(id).then((user) => {
    user = user.toJSON();
    return cb(null, user);
  });
});
module.exports = passport;
