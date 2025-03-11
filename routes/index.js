var express = require('express');
var router = express.Router();
var chatController = require('../controllers/chatController')
var messageController = require('../controllers/messageController');

/* GET home page. */
router.post('/chat-api/create', chatController.createChat);
router.get('/chat-api/chat-list/:userId', chatController.getChatList);
router.get('/chat-api/chat/:chatId', chatController.getChatData);

router.get('/chat-api/messages/:chatId', messageController.getListOfMessages);

module.exports = router;
