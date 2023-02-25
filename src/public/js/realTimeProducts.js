const socket = io();

let productsList = document.getElementById("productsList");
let addProductForm = document.getElementById("addProductForm");
let deleteProductForm = document.getElementById("deleteProductForm");

deleteProductForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let id = e.target[0].value.trim();
  socket.emit("deleteProduct", id);
  e.target.reset();
});

addProductForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let product = {
    title: e.target[0].value,
    description: e.target[1].value,
    code: e.target[2].value,
    price: e.target[3].value,
    status: e.target[4].value,
    stock: e.target[5].value,
    category: e.target[6].value,
    thumbnails: [e.target[7].value, e.target[8].value],
  };
  socket.emit("addProduct", product);
  e.target.reset();
});

socket.on("products", (products) => {
  let divContent = products.map((el) => `<h2>${el.title}</h2>`).join("");
  productsList.innerHTML = divContent;
});

socket.on("addProductRes", (response) => {
  alert(response);
});

socket.on("deleteProductRes", (response) => {
  alert(response);
});
