//ALL METHODS MUST RECEIVE SAME PARAMETERS AND RETURNS SAME OBJECTS AS MONGO.SERVICE

export class CartsMemoryService {
  async getCart(cid) {}
  async addProduct(cid, pid, qty) {}
  async deleteProduct(cid, pid) {}
  async updateProductQty(cid, pid, qty) {}
  async deleteProducts(cid) {}
}

export class ProductsMemoryService {
  async getProducts(query, options) {}
  async getProduct(pid) {}
  async getProductByCode(code) {}
  async deleteProduct(pid) {}
  async createProduct(product) {}
  async updateProduct(pid, field, value) {}
}

export class MessagesMemoryService {
  async getMessages() {}
  async addMessage(data) {}
}
