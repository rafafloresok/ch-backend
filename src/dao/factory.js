import { config } from "../config/config.js";
import { DB } from "../utils/utils.js";

export let cartsService;
export let productsService;
export let messagesService;

switch (config.persistence) {
  case "mongo":
    DB.connectDB();
    let { CartsMongoService, ProductsMongoService, MessagesMongoService } = await import("./services/mongo.service.js");
    cartsService = new CartsMongoService();
    productsService = new ProductsMongoService();
    messagesService = new MessagesMongoService();
    break;
  
  case "memory":
    let { CartsMemoryService, ProductsMemoryService, MessagesMemoryService } = await import("./services/memory.service.js");
    cartsService = new CartsMemoryService();
    productsService = new ProductsMemoryService();
    messagesService = new MessagesMemoryService();
    break;
  
  default:
    break;
}
