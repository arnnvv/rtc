import WebSocket, { WebSocketServer } from "ws";

const port: number = 8080;
const ws = new WebSocketServer({ port });
let senerSocket: null | WebSocket = null;
let receiverSocket: null | WebSocket = null;

ws.on("connection", (wss: WebSocket) => {
  wss.on("error", console.error);
  wss.on("message", (data: any) => {
    const message = JSON.parse(data);
    if (message.type === "sender") senerSocket = wss;
    else if (message.type === "receiver") receiverSocket = wss;
  });
  wss.send("hello");
});
