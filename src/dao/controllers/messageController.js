import { messagesModel } from "../models/messages.model.js";

class MessageController {
  async getMessages() {
    try {
      let messages = await messagesModel.find();
      return messages;
    } catch (error) {
      console.log(error);
    }
  }
}

const messageController = new MessageController();
export default messageController;
