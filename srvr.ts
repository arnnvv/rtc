import WebSocket, { WebSocketServer } from "ws";

const port: number = 8080;
const ws = new WebSocketServer({ port });
let senderSocket: null | WebSocket = null;
let receiverSocket: null | WebSocket = null;

ws.on("connection", (wss: WebSocket) => {
  wss.on("error", console.error);
  wss.on("message", (data: any) => {
    const message = JSON.parse(data);
    if (message.type === "sender") {
      senderSocket = wss;
      console.log("sender set");
    } else if (message.type === "receiver") {
      receiverSocket = wss;
      console.log("receiver set");
    } else if (message.type === "create-offer") {
      if (wss! === senderSocket) return;
      console.log("ofefr receibved");
      receiverSocket?.send(
        JSON.stringify({ type: "create-offer", sdp: message.sdp }),
      );
    } else if (message.type === "create-answer") {
      if (wss! === receiverSocket) return;
      console.log("answer receibved");
      senderSocket?.send(
        JSON.stringify({ type: "create-answer", sdp: message.sdp }),
      );
    } else if (message.type === "ice-candidate") {
      if (wss === senderSocket)
        receiverSocket?.send(
          JSON.stringify({
            type: "ice-candidate",
            candidate: message.candidate,
          }),
        );
      else if (wss === receiverSocket)
        senderSocket?.send(
          JSON.stringify({
            type: "ice-candidate",
            candidate: message.candidate,
          }),
        );
    }
  });
});
