const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const products = [];
const msgs = [];

// app.use(express.static(__dirname + '/public'));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("pages/index");
});

io.on("connection", (socket) => {
  console.log("a user connected");
  // send chat to the user that just connected
  socket.emit("send products", products);
  // // listening and sending mssgs to all users
  socket.on("send products", (product) => {
    products.push({
      socketId: socket.id,
      name: product.name,
      price: product.price,
      url: product.photoUrl,
    });
    console.log(products);
    // io.sockets.emit('chat message', msgs);
  });
  socket.emit("chat message", msgs);
  // listening and sending mssgs to all users
  socket.on("chat message", (userInfo) => {
    msgs.push({ email: userInfo.email, userMsg: userInfo.message });
    console.log(msgs);
    io.sockets.emit("chat message", msgs);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(3000, () => {
  console.log("listening on PORT:3000");
});

server.on("error", (error) => console.log(`Server error: ${error}`));
