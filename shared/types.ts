export interface RoomImage {
  id: string;
  dataUrl: string;
  name: string;
  size: number;
  type: string;
  uploadedBy: string;
  createdAt: number;
}

export interface RoomUser {
  id: string;
  name: string;
  isTyping: boolean;
}

export interface Room {
  roomName: string;
  roomCode: string;
  content: string;
  images: RoomImage[];
  users: RoomUser[];
  createdAt: number;
  lastUpdated: number;
}

export interface ServerToClientEvents {
  room_joined: (room: Room) => void;
  room_created: (room: Room) => void;
  text_updated: (content: string) => void;
  image_added: (image: RoomImage) => void;
  image_deleted: (imageId: string) => void;
  user_joined: (user: RoomUser, users: RoomUser[]) => void;
  user_left: (userId: string, users: RoomUser[]) => void;
  typing_status: (userId: string, isTyping: boolean) => void;
  room_error: (message: string) => void;
  disconnected: () => void;
}

export interface ClientToServerEvents {
  create_room: (roomName: string, roomCode: string) => void;
  join_room: (roomCode: string) => void;
  leave_room: () => void;
  text_change: (content: string) => void;
  upload_image: (imageData: { dataUrl: string; name: string; size: number; type: string }) => void;
  delete_image: (imageId: string) => void;
  typing: (isTyping: boolean) => void;
}
