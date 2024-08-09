const bcrypt = require('bcryptjs'); 
const { User } = require('../models');
const { imgFileHandler } = require("../helpers/file-helpers");

const userController = {
  signUpPage: (req, res) => {
    res.render('signup');
  },

  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck)
      throw new Error('Passwords do not match!');
    User.findOne({ where: { email: req.body.email } })
      .then((user) => {
        if (user) throw new Error('Email already exists!');
        return bcrypt.hash(req.body.password, 10);
      })
      .then((hash) =>
        User.create({
          name: req.body.name,
          email: req.body.email,
          password: hash,
        })
      )
      .then(() => {
        req.flash('success_messages', 'Successfully registered！');
        res.redirect('/signin');
      })
      .catch((err) => next(err));
  },
  signInPage: (req, res) => {
    res.render('signin');
  },
  signIn: (req, res) => {
    req.flash('success_messages', 'Successfully logged in！');
    res.redirect('/schedules');
  },
  logout: (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err); 
        }
        req.flash('success_messages', 'Successfully logged out！');
        res.redirect('/signin');
    });
  },
  getProfile: (req, res, next) => {
    User.findByPk(req.params.id, {
      raw: true
    })
    .then((user) => {
      if(!user) throw new Error("This user does not exist!")
      return res.render("users/profile", { user });
    })
    .catch((err) => next(err))
  },
  getEditProfile: async (req, res, next) => {
     try{
      const id = req.params.id
      await User.findByPk(id, { raw: true })
      
      if (!id) throw new Error("This user does not exist !");
      res.render("users/edit")

     } catch(err) {
    next(err)
     }
  },
   putProfile: (req, res, next) => {
    const { file } = req;
    Promise.all([
    User.findByPk(req.params.id), 
    imgFileHandler(file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error("This user does not exist!");
        return user.update({
          image: filePath || user.image
        })
      })
      .then(() =>{
        res.render("users/profile");
      })
      .catch((err) => next(err));
  }
};
module.exports = userController;