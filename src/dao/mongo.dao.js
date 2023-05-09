import { cartsModel } from "../models/carts.model.js";
import { productsModel } from "../models/products.model.js";
import { messagesModel } from "../models/messages.model.js";
import { usersModel } from "../models/users.model.js";

export class CartsMongoDao {
  async create(docs) {
    return await cartsModel.create(docs);
  }
  async getOne(conditions, projection) {
    return await cartsModel.findOne(conditions, projection).populate("products.productId");
  }
  async updateOne(filter, update) {
    return await cartsModel.updateOne(filter, update);
  }
}

export class ProductsMongoDao {
  async getPaginated(filter, options) {
    return await productsModel.paginate(filter, options);
  }
  async getOne(conditions, projection, options) {
    return await productsModel.findOne(conditions, projection);
  }
  async deleteOne(conditions, options) {
    return await productsModel.deleteOne(conditions);
  }
  async create(docs) {
    return await productsModel.create(docs);
  }
  async updateOne(filter, update) {
    return await productsModel.updateOne(filter, update);
  }
}

export class MessagesMongoDao {
  async get(filter, projection) {
    return await messagesModel.find(filter, projection);
  }
  async create(docs) {
    return await messagesModel.create(docs);
  }
}

export class UsersMongoDao {
  async getOne(conditions, projection) {
    return await usersModel.findOne(conditions, projection);
  }
  async create(docs) {
    return await usersModel.create(docs);
  }
  async updateOne(filter, update) {
    return await usersModel.updateOne(filter, update);
  }
}
