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
    const id = req.user.id
    const profileUserId = req.params.id;
    Promise.all([
      User.findByPk(id, { raw: true }),
      User.findByPk(profileUserId, { raw: true }),
    ])

      .then(([user, profileUser]) => {
        if (!profileUser) throw new Error("This user does not exist!");
        return res.render("users/profile", {
          user, // This is for the header
          profileUser, // This is for the profile
        });
      })
      .catch((err) => next(err));
},
  getEditProfile: async (req, res, next) => {
     try{
      const id = req.user.id
      const profileUserId = req.params.id 

      const [user, profileUser] = await Promise.all([
        User.findByPk(id, { raw: true }),
        User.findByPk(profileUserId, { raw: true }),
      ])
      if (!profileUser) { throw new Error("This user does not  exist !")
      }
      if (Number(id) !== Number(profileUserId)) {
        throw new Error("You don't have permission to edit this profile!");
      }

      res.render("users/edit", {
        user, // This is for the header
        profileUser, // This is for the profile
      });

     } catch(err) {
    next(err)
     }
  },
   putProfile: async (req, res, next) => {
    try {
    const { file } = req;
    const id = req.user.id
    const profileUserId = req.params.id 
    
    if (Number(id) !== Number(profileUserId)) {
      throw new Error("You don't have permission to edit this profile!");
    }
    const [user, profileUser, filePath] = await Promise.all([
      User.findByPk(id,{ raw: true }),
      User.findByPk(profileUserId),
      imgFileHandler(file)
    ]);

    if (!profileUser) throw new Error("This user does not exist !");
    
    await profileUser.update({
      image: filePath || profileUser.image,
       });
        res.render("users/profile", {
          user, // This is for the header
          profileUser, // This is for the profile
        });
    } catch(err) {
      next(err)
    }
  }
};
module.exports = userController;