import zod from "zod";

export enum SupportedMessages {
  JoinRoom = "JOIN_ROOM",
  SendMessage = "SEND_MESSAGE",
  UpVoteMessage = "UPVOTE_MESSAGE",
}

export type IncommingMessages =
  | {
      type: SupportedMessages.JoinRoom;
      payload: InitMessageType;
    }
  | {
      type: SupportedMessages.SendMessage;
      payload: UserMessagesType;
    }
  | {
      type: SupportedMessages.UpVoteMessage;
      payload: UpVotedMessagesType;
    };

export const initMessages = zod.object({
  name: zod.string(),
  userId: zod.string(),
  roomId: zod.string(),
});

export type InitMessageType = zod.infer<typeof initMessages>;

export const UserMessages = zod.object({
  userId: zod.string(),
  roomId: zod.string(),
  message: zod.string(),
});

export type UserMessagesType = zod.infer<typeof UserMessages>;

export const UpVotedMessages = zod.object({
  userId: zod.string(),
  roomId: zod.string(),
  chatId: zod.string(),
});

export type UpVotedMessagesType = zod.infer<typeof UpVotedMessages>;
