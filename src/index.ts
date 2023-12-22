#!/usr/bin/env Node
import { server as WebSocketServer, connection } from "websocket";
import http from "http";
import { UserManager } from "./UserManager";
import {
  IncommingMessages,
  InitMessageType,
  SupportedMessages,
  UpVotedMessagesType,
  UserMessagesType,
} from "./messages";
import { InMemoryStore } from "./store/InMemoryStore";
import { retryDelay } from "@trpc/client/dist/internals/retryDelay";

const server = http.createServer(function (request: any, response: any) {
  console.log(new Date() + " Received request for " + request.url);
  response.writeHead(404);
  response.end();
});
server.listen(8080, function () {
  console.log(new Date() + " Server is listening on port 8080");
});

const userManager = new UserManager();
const store = new InMemoryStore();

const wsServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false,
});

function originIsAllowed(origin: string) {
  return true;
}

wsServer.on("request", function (request) {
  if (!originIsAllowed(request.origin)) {
    request.reject();
    console.log(
      new Date() + " Connection from origin " + request.origin + " rejected.",
    );
    return;
  }

  var connection = request.accept("echo-protocol", request.origin);
  console.log(new Date() + " Connection accepted.");
  connection.on("message", function (message) {
    if (message.type === "utf8") {
      try {
        messageHandler(ws, JSON.parse(message.utf8Data));
      } catch (err) {}
      //console.log("Received Message: " + message.utf8Data);
      //connection.sendUTF(message.utf8Data);
    } else if (message.type === "binary") {
      console.log(
        "Received Binary Message of " + message.binaryData.length + " bytes",
      );
      connection.sendBytes(message.binaryData);
    }
  });
  connection.on("close", function (reasonCode, description) {
    console.log(
      new Date() + " Peer " + connection.remoteAddress + " disconnected.",
    );
  });
});

function messageHandler(ws: connection, message: IncommingMessages) {
  if (message.type === SupportedMessages.JoinRoom) {
    const payload = message.payload;
    userManager.addUser(payload.name, payload.userId, payload.roomId, ws);
  }
  if (message.type === SupportedMessages.SendMessage) {
    const payload = message.payload;
    const user = userManager.getUser(payload.roomId, payload.userId);
    if (!user) {
      console.error("User not Found");
      return;
    }
    store.addChat(payload.userId, user.name, payload.roomId, payload.message);
  }
  if (message.type === SupportedMessages.UpVoteMessage) {
    const payload = message.payload;
    store.upVote(payload.userId, payload.roomId, payload.chatId);
  }
}
