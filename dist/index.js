#!/usr/bin/env Node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const websocket_1 = require("websocket");
const http_1 = __importDefault(require("http"));
const UserManager_1 = require("./UserManager");
const InMemoryStore_1 = require("./store/InMemoryStore");
const outgoingMessages_1 = require("./messages/outgoingMessages");
const incomingMessages_1 = require("./messages/incomingMessages");
const server = http_1.default.createServer(function (request, response) {
    console.log(new Date() + " Received request for " + request.url);
    response.writeHead(404);
    response.end();
});
server;
const userManager = new UserManager_1.UserManager();
const store = new InMemoryStore_1.InMemoryStore();
server.listen(8080, function () {
    console.log(new Date() + " Server is listening on port 8080");
});
const wsServer = new websocket_1.server({
    httpServer: server,
    autoAcceptConnections: false,
});
function originIsAllowed(origin) {
    return true;
}
wsServer.on("request", function (request) {
    console.log("inside connect");
    if (!originIsAllowed(request.origin)) {
        request.reject();
        console.log(new Date() + " Connection from origin " + request.origin + " rejected.");
        return;
    }
    var connection = request.accept("echo-protocol", request.origin);
    console.log(new Date() + " Connection accepted.");
    connection.on("message", function (message) {
        if (message.type === "utf8") {
            try {
                messageHandler(connection, JSON.parse(message.utf8Data));
            }
            catch (err) { }
            //console.log("Received Message: " + message.utf8Data);
            //connection.sendUTF(message.utf8Data);
        }
        else if (message.type === "binary") {
            console.log("Received Binary Message of " + message.binaryData.length + " bytes");
            connection.sendBytes(message.binaryData);
        }
    });
    connection.on("close", function (reasonCode, description) {
        console.log(new Date() + " Peer " + connection.remoteAddress + " disconnected.");
    });
});
function messageHandler(ws, message) {
    if (message.type === incomingMessages_1.SupportedMessages.JoinRoom) {
        const payload = message.payload;
        userManager.addUser(payload.name, payload.userId, payload.roomId, ws);
    }
    if (message.type === incomingMessages_1.SupportedMessages.SendMessage) {
        const payload = message.payload;
        const user = userManager.getUser(payload.roomId, payload.userId);
        if (!user) {
            console.error("User not Found");
            return;
        }
        let chat = store.addChat(payload.userId, user.name, payload.roomId, payload.message);
        if (!chat)
            return;
        const OutgoingPayload = {
            type: outgoingMessages_1.SupportedMessage.AddChat,
            payload: {
                roomId: payload.roomId,
                message: payload.message,
                name: user.name,
                upvotes: 0,
            },
        };
        userManager.broadcast(payload.roomId, payload.userId, OutgoingPayload);
    }
    if (message.type === incomingMessages_1.SupportedMessages.UpVoteMessage) {
        const payload = message.payload;
        const chat = store.upvote(payload.userId, payload.roomId, payload.chatId);
        if (!chat)
            return;
        const OutgoingPayload = {
            type: outgoingMessages_1.SupportedMessage.UpdateChat,
            payload: {
                chatId: payload.chatId,
                roomId: payload.roomId,
                upvotes: chat.upvotes.length,
            },
        };
        userManager.broadcast(payload.roomId, payload.userId, OutgoingPayload);
    }
}
