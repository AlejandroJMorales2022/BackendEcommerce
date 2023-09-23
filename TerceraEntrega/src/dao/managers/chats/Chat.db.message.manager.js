const chatMessageModel = require('../../models/chat.messages.model');


class ChatMessageManager {

    getAll(){
        return chatMessageModel.find().sort({ datetime: 1 }).lean();
    }

    create(message){
        return chatMessageModel.create(message);
    }

}
module.exports = new ChatMessageManager();