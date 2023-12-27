"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpVotedMessages = exports.UserMessages = exports.initMessages = exports.SupportedMessages = void 0;
const zod_1 = __importDefault(require("zod"));
var SupportedMessages;
(function (SupportedMessages) {
    SupportedMessages["JoinRoom"] = "JOIN_ROOM";
    SupportedMessages["SendMessage"] = "SEND_MESSAGE";
    SupportedMessages["UpVoteMessage"] = "UPVOTE_MESSAGE";
})(SupportedMessages || (exports.SupportedMessages = SupportedMessages = {}));
exports.initMessages = zod_1.default.object({
    name: zod_1.default.string(),
    userId: zod_1.default.string(),
    roomId: zod_1.default.string(),
});
exports.UserMessages = zod_1.default.object({
    userId: zod_1.default.string(),
    roomId: zod_1.default.string(),
    message: zod_1.default.string(),
});
exports.UpVotedMessages = zod_1.default.object({
    userId: zod_1.default.string(),
    roomId: zod_1.default.string(),
    chatId: zod_1.default.string(),
});
