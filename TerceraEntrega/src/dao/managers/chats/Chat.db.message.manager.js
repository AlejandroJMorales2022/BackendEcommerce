const chatMessageModel = require('../../models/chat.messages.model');
const BaseManager = require('../base.manager');

class ChatMessageManager extends BaseManager {

    constructor() {
        super(chatMessageModel);
    }

    getAll() {
        return chatMessageModel.find().sort({ datetime: 1 }).lean();
    }

    create(message) {
        return chatMessageModel.create(message);
    }

}
module.exports = new ChatMessageManager();