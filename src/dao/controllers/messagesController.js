import { messagesModel } from "../models/messages.model.js";

class MessagesController {
  async getMessages() {
    try {
      let messages = await messagesModel.find();
      return messages;
    } catch (error) {
      console.log(error);
    }
  }

  async addMessage({ user, message }) {
    try {
      await messagesModel.create({ user, message });
      return {
        status: "success",
        message: "Message added successfully",
      };
    } catch (error) {
      console.log(error);
      return {
        status: "error",
      };
    }
  }
}

const messagesController = new MessagesController();
export default messagesController;
