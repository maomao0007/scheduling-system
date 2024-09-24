const { User } = require("../models");
const chatController = {
  getChat: async(req, res, next) => {
    try {
      const users = await User.findAll({
        attributes: ["id", "name"],
        raw: true,
      });
     res.render("chat", {
       title: "Chat",
       isChatPage: true,
       users: users,
       currentUserId: req.user.id,
       isAdmin: req.user.isAdmin || false,
     });
    } catch (err){
      next(err)
    } 
  }
};

module.exports = chatController;
