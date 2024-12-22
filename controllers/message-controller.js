const { User, Message } = require('../models');
const { Op } = require('sequelize');

const messageController = {
  getMessagePage: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 20;
      const offset = (page - 1) * limit;
      const selectedUserId = req.query.userId;

      // Get all users except the current user
      const users = await User.findAll({
        attributes: ['id', 'name'],
        where: {
          id: { [Op.ne]: req.user.id },
        },
        raw:true,
      });

      // Get messages for the current user
      const { count, rows: allMessages } = await Message.findAndCountAll({
        where: {
          [Op.or]: [{ senderId: req.user.id }, { recipientId: req.user.id }],
        },
        include: [
          { model: User, as: 'sender', attributes: ['id', 'name'] },
          { model: User, as: 'recipient', attributes: ['id', 'name'] },
        ],
        nest: true,
        raw: true,
        order: [['createdAt', 'DESC']],
        limit: limit,
        offset: offset,
      });

      // Prepare message lists for each user
      const processedUsers = users.map((user) => ({
        id: user.id,
        name: user.name,
        messages: allMessages.filter(
          (msg) => msg.senderId === user.id || msg.recipientId === user.id
        ),
      }));

      console.log('users', processedUsers);
      console.log('messages', allMessages);

      const totalPages = Math.ceil(count / limit);

      res.render('messages', {
        users: processedUsers,
        selectedUserId: selectedUserId,
        messages: allMessages,
        currentUserId: req.user.id,
        currentPage: page,
        totalPages: totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      });
    } catch (error) {
      console.error('Error loading message page:', error);
      res.status(500).send('Error loading message page');
    }
  },

  sendMessage: async (req, res) => {
    try {
      const { recipientId, content } = req.body;
      const senderId = req.user.id;

      if (!recipientId || !content)
        throw new Error('RecipientId and content are required');

      const message = await Message.create({ senderId, recipientId, content });

      const fullMessage = await Message.findOne({
        where: { id: message.id },
        include: [
          { model: User, as: 'sender', attributes: ['id', 'name'] },
          { model: User, as: 'recipient', attributes: ['id', 'name'] },
        ],
      });

      const io = req.app.get('io');
      io.to(senderId).to(recipientId).emit('newMessage', fullMessage);

      res.json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
      console.error('Error sending message:', error);
      res
        .status(500)
        .json({ success: false, message: 'Failed to send message' });
    }
  },
};

module.exports = messageController;
