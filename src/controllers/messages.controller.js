import { messagesService } from "../dao/factory.js";
import { logger } from "../utils/logger.js";

class MessagesController {
  async getMessages() {
    let result = await messagesService.get();
    if (result) {
      return result;
    } else {
      logger.debug("error trying to get messages");
      return {
        status: "error",
        message: "error trying to get messages",
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
      logger.debug("error trying to send message");
      return {
        status: "error",
        message: "error trying to send message",
      };
    }
  }
}

const messagesController = new MessagesController();
export default messagesController;
