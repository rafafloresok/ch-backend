import { messagesService } from "../dao/factory.js";

class MessagesController {
  async getMessages() {
    let result = await messagesService.get();
    if (result) {
      return result;
    } else {
      return {
        status: "error",
        message: "Something went wrong, try again later",
      };
    }
  }

  async sendMessage({ user, message }) {
    let result = await messagesService.send({ user, message });
    if (result) {
      return {
        status: "success",
        message: "Message sent successfully",
      };
    } else {
      return {
        status: "error",
        message: "Something went wrong, try again later",
      };
    }
  }
}

const messagesController = new MessagesController();
export default messagesController;
