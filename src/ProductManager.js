import fs from "fs";

/*Debe guardar objetos con el siguiente formato:
  id (se debe incrementar automáticamente, no enviarse desde el cuerpo)
  title (nombre del producto)
  description (descripción del producto)
  price (precio)
  thumbnail (ruta de imagen)
  code (código identificador)
  stock (número de piezas disponibles)*/
class Product {
  constructor(id, title, description, price, thumbnail, code, stock) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.price = price;
    this.thumbnail = thumbnail;
    this.code = code;
    this.stock = stock;
  }
}

//Realizar una clase de nombre “ProductManager”, el cual permitirá trabajar con múltiples productos.
//Éste debe poder agregar, consultar, modificar y eliminar un producto y manejarlo en persistencia de archivos (basado en entregable 1).
export default class ProductManager {
  constructor(path) {
    //La clase debe contar con una variable this.path, el cual se inicializará desde el constructor y debe recibir la ruta a trabajar desde el momento de generar su instancia.
    this.path = path;
  }

  //Debe tener un método getProducts, el cual debe leer el archivo de productos y devolver todos los productos en formato de arreglo.
  async getProducts() {
    let fileExists = fs.existsSync(this.path);
    if (fileExists) {
      let data = await fs.promises.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } else {
      return [];
    }
  }

  //Debe tener un método addProduct el cual debe recibir un objeto con el formato previamente especificado, asignarle un id autoincrementable y guardarlo en el arreglo (recuerda siempre guardarlo como un array en el archivo).
  async addProduct(title, description, price, thumbnail, code, stock) {
    let products = await this.getProducts();
    let productExists = products.findIndex((product) => product.code === code) !== -1;
    let aFieldIsEmpty = !(title && description && price && thumbnail && code && stock);
    if (productExists || aFieldIsEmpty) {
      console.log(`Product not added.\nErrors:${productExists ? "\nProduct already exists." : ""} ${aFieldIsEmpty ? "\nMust complete all fields." : ""}`);
    } else {
      let id = products.length + 1;
      let newProduct = new Product(id, title, description, price, thumbnail, code, stock);
      products.push(newProduct);
      await fs.promises.writeFile(this.path, JSON.stringify(products,null,2));
      console.log(`Product ${title} added with ID ${id}`);
    }
  }

  //Debe tener un método getProductById, el cual debe recibir un id, y tras leer el archivo, debe buscar el producto con el id especificado y devolverlo en formato objeto
  async getProductById(id) {
    let products = await this.getProducts();
    let product = products.find((product) => product.id === id);
    if (product) {
      return product;
    } else {
      console.log("Product not found.");
    }
  }

  //Debe tener un método updateProduct, el cual debe recibir el id del producto a actualizar, así también como el campo a actualizar (puede ser el objeto completo, como en una DB), y debe actualizar el producto que tenga ese id en el archivo. NO DEBE BORRARSE SU ID
  async updateProduct(id, title, description, price, thumbnail, code, stock) {
    let products = await this.getProducts();
    let productIndex = products.findIndex((product) => product.id === id);
    let productExists = productIndex !== -1;
    if (productExists) {
      products[productIndex].title = title;
      products[productIndex].description = description;
      products[productIndex].price = price;
      products[productIndex].thumbnail = thumbnail;
      products[productIndex].code = code;
      products[productIndex].stock = stock;
      await fs.promises.writeFile(this.path, JSON.stringify(products,null,2));
      console.log(`Product ${title} with ID ${id} updated successfully`);
    } else {
      console.log("Product not found.");
    }
  }
  
  //Debe tener un método deleteProduct, el cual debe recibir un id y debe eliminar el producto que tenga ese id en el archivo.
  async deleteProduct(id) {
    let products = await this.getProducts();
    let productIndex = products.findIndex((product) => product.id === id);
    let productExists = productIndex !== -1;
    if (productExists) {
      products[productIndex] = {};
      //ACLARACIÓN: se deja el objeto vacío en vez de eliminarse ya que el id autoincremental se genera según products.length. De otro modo se generaría un conflicto al generar nuevos productos con ids repetidos
      await fs.promises.writeFile(this.path, JSON.stringify(products,null,2));
      console.log(`Product with ID ${id} deleted successfully`);
    } else {
      console.log("Product not found.");
    }
  }
}

//exports.ProductManager = (path) => new ProductManager(path);

//PROCESO DE TESTING
//console.clear();

//Se creará una instancia de la clase “ProductManager”
//ACLARACIÓN: debe estar creada la carpeta files
//let pm = new ProductManager("../files/products.json");

//Se llamará “getProducts” recién creada la instancia, debe devolver un arreglo vacío []
//pm.getProducts().then(products => console.log(products));

//Se llamará al método “addProduct” con los campos:title: “producto prueba”, description:”Este es un producto prueba”, price:200, thumbnail:”Sin imagen”, code:”abc123”, stock:25
//El objeto debe agregarse satisfactoriamente con un id generado automáticamente SIN REPETIRSE
//pm.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);

//Se llamará el método “getProducts” nuevamente, esta vez debe aparecer el producto recién agregado
//pm.getProducts().then(products => console.log(products));

//Se llamará al método “getProductById” y se corroborará que devuelva el producto con el id especificado, en caso de no existir, debe arrojar un error.
//pm.getProductById(1).then(product => console.log(product));

//Se llamará al método “updateProduct” y se intentará cambiar un campo de algún producto, se evaluará que no se elimine el id y que sí se haya hecho la actualización.
//pm.updateProduct(1, "producto prueba modificado", "Este es un producto prueba modificado", 300, "Sin imagen modificado", "abc123 modificado", 36);

//Se llamará al método “deleteProduct”, se evaluará que realmente se elimine el producto o que arroje un error en caso de no existir.
//pm.deleteProduct(1);
