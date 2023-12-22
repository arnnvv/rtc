interface User {
  name: string;
  id: string;
}

interface Room {
  users: User[];
}

export class UserManager {
  private users: Map<string, Room>;
  constructor() {
    this.users = new Map<string, Room>();
  }
  addUser(name: string, userId: string, roomId: string, socket: WebSocket) {
    if (!this.users.get(roomId)) {
      this.users.set(roomId, {
        users: [],
      });
    }
    this.users.get(roomId)?.users.push({
      id: userId,
      name,
    });
  }
  removeUser(roomId: string, userId: string) {
    const users = this.room.get(roomId)?.users;
    if (users) {
      users.filter(({ id }) => userId);
    }
  }
}
