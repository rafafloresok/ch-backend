//Desarrollar un servidor express que, en su archivo app.js importe al archivo de ProductManager que actualmente tenemos.
import express from "express";
import ProductManager from "./ProductManager.js";

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const pm = new ProductManager("../files/products.json");

//El servidor debe contar con los siguientes endpoints:
//ruta ‘/products’, la cual debe leer el archivo de productos y devolverlos dentro de un objeto. Agregar el soporte para recibir por query param el valor ?limit= el cual recibirá un límite de resultados.
//Si no se recibe query de límite, se devolverán todos los productos
//Si se recibe un límite, sólo devolver el número de productos solicitados
app.get("/products", async (req, res) => {
  let limit = req.query.limit;
  let products = await pm.getProducts();
  res.send({ products: products.slice(0, limit) });
});

//ruta ‘/products/:pid’, la cual debe recibir por req.params el pid (product Id), y devolver sólo el producto solicitado, en lugar de todos los productos.
app.get("/products/:pid", async (req, res) => {
  let id = parseInt(req.params.pid);
  let product = await pm.getProductById(id);
  if (product) {
    res.send(product);
  } else {
    res.send({error: 'el producto no existe'});
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
