import type { Server as HTTPServer } from "http";
import type { Socket as ServerSocket } from "socket.io";

export interface ImageData {
  id: string;
  dataUrl: string;
  name: string;
  size: number;
  type: string;
  uploadedBy: string;
  createdAt: number;
}

export interface UserData {
  id: string;
  name: string;
  isTyping: boolean;
}

export interface RoomData {
  roomName: string;
  roomCode: string;
  content: string;
  images: ImageData[];
  users: UserData[];
  createdAt: number;
  lastUpdated: number;
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

export interface ServerToClientEvents {
  room_joined: (room: RoomData) => void;
  room_created: (room: RoomData) => void;
  text_updated: (content: string) => void;
  image_added: (image: ImageData) => void;
  image_deleted: (imageId: string) => void;
  user_joined: (user: UserData, users: UserData[]) => void;
  user_left: (userId: string, users: UserData[]) => void;
  typing_status: (userId: string, isTyping: boolean) => void;
  room_error: (message: string) => void;
}

export interface InterServerEvents {}

export interface SocketData {
  userId: string;
  userName: string;
  roomCode: string | null;
}

export type TypedServerSocket = ServerSocket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
