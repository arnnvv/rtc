import { Server } from "socket.io";
import express, { Request, Response } from "express";
import http from "http";

const app = express();
const server = http.createServer(app);
const port: number = 3000;
const io = new Server(server);

io.on("connection", (socket) => {
  socket.on("message", (message) => {
    console.log("A new user message:", message);
    io.emit("message", message);
  });
});

app.use(express.static("./public/"));

app.get("/", (req: Request, res: Response) => {
  return res.sendFile("./public/index.html");
});

server.listen(port, () => console.log(`Server listing at port ${port}`));
