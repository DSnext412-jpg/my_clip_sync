import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function generateRoomCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function validateRoomCode(code: string): string | null {
  if (code.length < 4) return "Room code must be at least 4 characters.";
  if (code.length > 30) return "Room code must be at most 30 characters.";
  if (!/^[a-zA-Z0-9_-]+$/.test(code)) return "Only letters, numbers, dash (-), and underscore (_) allowed.";
  return null;
}

export function validateImageFile(file: File): string | null {
  const allowedTypes = ["image/png", "image/jpg", "image/jpeg", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return "Only PNG, JPG, JPEG, and WEBP images are allowed.";
  }
  if (file.size > 10 * 1024 * 1024) {
    return "Image size must be under 10MB.";
  }
  return null;
}
