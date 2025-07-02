"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageDto = exports.ChatUserDto = void 0;
class ChatUserDto {
    id;
    firstName;
    lastName;
    email;
    profilePicture;
}
exports.ChatUserDto = ChatUserDto;
class MessageDto {
    id;
    content;
    createdAt;
    sender;
    conversation;
    type;
    mediaUrl;
}
exports.MessageDto = MessageDto;
//# sourceMappingURL=chat-user.dto.js.map