import { Server } from "socket.io";
import express, { Request, Response } from "express";
import http from "http";

const app = express();
const server = http.createServer(app);
const port: number = 9000;
const io = new Server(server);

io.on("connection", (socket) => {
  console.log(`Socket Connected: ${socket.id}`);
});

app.use(express.static("./public/"));

app.get("/", (req: Request, res: Response) => {
  return res.sendFile("./public/index.html");
});

server.listen(port, () => console.log(`Server listing at port ${port}`));
