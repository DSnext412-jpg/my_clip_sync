import type { RoomData, ImageData, UserData } from "./types";

const rooms = new Map<string, RoomData>();

function generateUserName(): string {
  const adjectives = [
    "Red", "Blue", "Green", "Yellow", "Purple", "Orange", "Pink", "Brown",
    "Black", "White", "Gray", "Gold", "Silver", "Crimson", "Teal", "Navy",
    "Lime", "Coral", "Indigo", "Violet", "Turquoise", "Magenta", "Tan", "Plum",
    "Olive", "Cyan", "Peach", "Mint", "Lavender", "Rose"
  ];
  const animals = [
    "Tiger", "Falcon", "Panda", "Wolf", "Eagle", "Shark", "Fox", "Bear",
    "Owl", "Dolphin", "Hawk", "Lion", "Cheetah", "Phoenix", "Raven", "Viper",
    "Jaguar", "Leopard", "Rhino", "Cougar", "Lynx", "Cobra", "Stallion",
    "Koala", "Otter", "Badger", "Husky", "Mustang", "Condor", "Panther"
  ];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];
  return `${adj} ${animal}`;
}

function validateRoomCode(code: string): boolean {
  return /^[a-zA-Z0-9_-]{4,30}$/.test(code);
}

function validateRoomName(name: string): boolean {
  return name.trim().length >= 1 && name.trim().length <= 50;
}

function sanitizeText(text: string): string {
  return text.slice(0, 500000);
}

export function createRoom(roomCode: string, roomName: string): RoomData {
  if (!validateRoomCode(roomCode)) {
    throw new Error("Invalid room code. Use 4-30 characters (letters, numbers, dash, underscore).");
  }
  if (!validateRoomName(roomName)) {
    throw new Error("Room name must be 1-50 characters.");
  }
  if (rooms.has(roomCode.toLowerCase())) {
    throw new Error("Room code already exists. Please choose another.");
  }

  const room: RoomData = {
    roomName: roomName.trim(),
    roomCode: roomCode.toLowerCase(),
    content: "",
    images: [],
    users: [],
    createdAt: Date.now(),
    lastUpdated: Date.now(),
  };
  rooms.set(roomCode.toLowerCase(), room);
  return room;
}

export function joinRoom(roomCode: string): RoomData {
  const room = rooms.get(roomCode.toLowerCase());
  if (!room) {
    throw new Error("Room not found. Please check the room code and try again.");
  }
  return room;
}

export function leaveRoom(roomCode: string, userId: string): UserData[] {
  const room = rooms.get(roomCode.toLowerCase());
  if (!room) return [];
  room.users = room.users.filter((u) => u.id !== userId);
  if (room.users.length === 0) {
    rooms.delete(roomCode.toLowerCase());
  }
  return room.users;
}

export function updateText(roomCode: string, content: string): string {
  const room = rooms.get(roomCode.toLowerCase());
  if (!room) throw new Error("Room not found.");
  room.content = sanitizeText(content);
  room.lastUpdated = Date.now();
  return room.content;
}

export function addImage(
  roomCode: string,
  imageData: { dataUrl: string; name: string; size: number; type: string },
  userId: string
): ImageData {
  const room = rooms.get(roomCode.toLowerCase());
  if (!room) throw new Error("Room not found.");

  const allowedTypes = ["image/png", "image/jpg", "image/jpeg", "image/webp"];
  if (!allowedTypes.includes(imageData.type)) {
    throw new Error("Only PNG, JPG, JPEG, and WEBP images are allowed.");
  }
  if (imageData.size > 10 * 1024 * 1024) {
    throw new Error("Image size must be under 10MB.");
  }
  if (room.images.length >= 50) {
    throw new Error("Maximum 50 images per room.");
  }

  const image: ImageData = {
    id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    dataUrl: imageData.dataUrl,
    name: imageData.name,
    size: imageData.size,
    type: imageData.type,
    uploadedBy: userId,
    createdAt: Date.now(),
  };
  room.images.push(image);
  room.lastUpdated = Date.now();
  return image;
}

export function deleteImage(roomCode: string, imageId: string): void {
  const room = rooms.get(roomCode.toLowerCase());
  if (!room) throw new Error("Room not found.");
  room.images = room.images.filter((img) => img.id !== imageId);
  room.lastUpdated = Date.now();
}

export function addUser(roomCode: string, userId: string): { user: UserData; users: UserData[] } {
  const room = rooms.get(roomCode.toLowerCase());
  if (!room) throw new Error("Room not found.");

  const userName = generateUserName();
  const user: UserData = { id: userId, name: userName, isTyping: false };
  room.users.push(user);
  return { user, users: room.users };
}

export function setTyping(roomCode: string, userId: string, isTyping: boolean): void {
  const room = rooms.get(roomCode.toLowerCase());
  if (!room) return;
  const user = room.users.find((u) => u.id === userId);
  if (user) {
    user.isTyping = isTyping;
  }
}

export function getRoom(roomCode: string): RoomData | undefined {
  return rooms.get(roomCode.toLowerCase());
}

export function getAllRooms(): Map<string, RoomData> {
  return rooms;
}
