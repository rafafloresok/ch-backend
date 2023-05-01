import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import { __dirname, DB } from "./utils/utils.js";
import path from "path";
import cookieParser from "cookie-parser";
import passport from "passport";
import { initializePassport } from "./config/passport.config.js";
import { config } from "./config/config.js";

import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import sessionsRouter from "./routes/sessions.router.js";

import productController from "./dao/controllers/productController.js";
import { messagesModel } from "./dao/models/messages.model.js";

const app = express();

app.engine(
  "handlebars",
  engine({
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
  })
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "../views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

initializePassport();
app.use(passport.initialize());

app.use(express.static(path.join(__dirname, "../public")));
app.use("/", viewsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/products", productsRouter);

const httpServer = app.listen(config.port, () => {
  console.log(`App listening on port ${config.port}`);
});
const io = new Server(httpServer);
io.on("connection", async (socket) => {
  console.log("New client connected");

  socket.on("deleteProduct", async (id) => {
    let response = await productController.deleteProductSocket(id);
    socket.emit("deleteProductRes", response);
    if (response.success) {
      socket.broadcast.emit("productListUpdated");
    }
  });

  socket.on("addProduct", async (product) => {
    let response = await productController.addProductSocket(product);
    socket.emit("addProductRes", response);
    if (response.success) {
      socket.broadcast.emit("productListUpdated");
    }
  });

  socket.on("newMessage", async ({ user, message }) => {
    await messagesModel.create({ user: user, message: message });
    io.emit("messagesListUpdated");
  });
});

DB.connectDB();

io.on("error", (error) => console.error(error));
