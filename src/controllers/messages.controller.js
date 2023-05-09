import { messagesService } from "../dao/factory.js";

class MessagesController {
  async getMessages() {
    try {
      let messages = await messagesService.get();
      return messages;
    } catch (error) {
      console.log(error);
    }
  }

  async sendMessage({ user, message }) {
    try {
      await messagesService.send({ user, message });
      return {
        status: "success",
        message: "Message sent successfully",
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
