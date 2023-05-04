import { messagesService } from "../factory.js";

class MessagesController {
  async getMessages() {
    try {
      let messages = await messagesService.getMessages();
      return messages;
    } catch (error) {
      console.log(error);
    }
  }

  async addMessage({ user, message }) {
    try {
      await messagesService.addMessage({ user, message });
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
