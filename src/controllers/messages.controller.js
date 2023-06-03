import { messagesService } from "../dao/factory.js";

class MessagesController {
  async sendMessage({ user, message }) {
    try {
      let result = await messagesService.send({ user, message });
      if (result) {
        return { status: "success", message: "Message sent successfully" };
      } else {
        return { status: "error", message: "error trying to send message" };
      }
    } catch (error) {
      return { status: "error", message: "error trying to send message" };
    }
  }
}

const messagesController = new MessagesController();
export default messagesController;
