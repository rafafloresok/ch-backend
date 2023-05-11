import { cartsModel } from "../models/carts.model.js";
import { productsModel } from "../models/products.model.js";
import { messagesModel } from "../models/messages.model.js";
import { usersModel } from "../models/users.model.js";

export class CartsMongoDao {
  async create(docs) {
    try {
      let result = await cartsModel.create(docs);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async getOne(conditions, projection) {
    try {
      let result = await cartsModel.findOne(conditions, projection).populate("products.productId");
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async updateOne(filter, update) {
    try {
      let result = await cartsModel.updateOne(filter, update);
      if (result.matchedCount) {
        return result;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export class ProductsMongoDao {
  async getPaginated(filter, options) {
    try {
      let result = await productsModel.paginate(filter, options);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async getOne(conditions, projection) {
    try {
      let result = await productsModel.findOne(conditions, projection);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async deleteOne(conditions) {
    try {
      let result = await productsModel.deleteOne(conditions);
      if (result.deletedCount) {
        return result;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async create(docs) {
    try {
      let result = await productsModel.create(docs);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async updateOne(filter, update) {
    try {
      let result = await productsModel.updateOne(filter, update);
      if (result.matchedCount) {
        return result;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export class MessagesMongoDao {
  async get(filter, projection) {
    try {
      let result = await messagesModel.find(filter, projection);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async create(docs) {
    try {
      let result = await messagesModel.create(docs);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export class UsersMongoDao {
  async getOne(conditions, projection) {
    try {
      let result = await usersModel.findOne(conditions, projection);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async create(docs) {
    try {
      let result = await usersModel.create(docs);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async updateOne(filter, update) {
    try {
      let result = await usersModel.updateOne(filter, update);
      if (result.matchedCount) {
        return result;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
