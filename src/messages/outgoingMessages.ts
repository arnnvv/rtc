export enum SupportedMessage {
  AddChat = "ADD_CHAT",
  UpdateChat = "UPDATE_CHAT",
}

type MessagaePayload = {
  roomId: string;
  message: string;
  name: string;
  upvotes: number;
  chatId?: string;
};

export type OutgoingMessage =
  | {
      type: SupportedMessage.AddChat;
      payload: MessagaePayload;
    }
  | {
      type: SupportedMessage.UpdateChat;
      payload: Partial<MessagaePayload>;
    };
