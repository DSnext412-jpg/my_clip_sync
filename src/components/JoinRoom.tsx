import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { connectSocket, getSocket } from "@/lib/socket";
import toast from "react-hot-toast";
import type { Room } from "@/types";

interface JoinRoomProps {
  onRoomJoined: (room: Room) => void;
  onBack: () => void;
}

export default function JoinRoom({ onRoomJoined, onBack }: JoinRoomProps) {
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  const handleJoin = useCallback(() => {
    const code = roomCode.trim().toLowerCase();

    if (!code) {
      setError("Please enter a room code.");
      return;
    }

    setIsJoining(true);
    setError("");

    try {
      const socket = connectSocket();

      const onJoined = (room: Room) => {
        socket.off("room_joined", onJoined);
        socket.off("room_error", onError);
        toast.success(`Joined "${room.roomName}"`);
        onRoomJoined(room);
      };

      const onError = (msg: string) => {
        socket.off("room_joined", onJoined);
        socket.off("room_error", onError);
        setError(msg);
        setIsJoining(false);
      };

      socket.on("room_joined", onJoined);
      socket.on("room_error", onError);

      socket.emit("join_room", code);

      setTimeout(() => {
        socket.off("room_joined", onJoined);
        socket.off("room_error", onError);
        setIsJoining(false);
      }, 10000);
    } catch {
      setError("Failed to connect to server. Please try again.");
      setIsJoining(false);
    }
  }, [roomCode, onRoomJoined]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <LogIn className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle>Join a Room</CardTitle>
                <CardDescription>Enter the room code to join</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Room Code</label>
              <Input
                placeholder="Enter room code..."
                value={roomCode}
                onChange={(e) => {
                  setRoomCode(e.target.value.replace(/\s/g, ""));
                  setError("");
                }}
                maxLength={30}
                className="font-mono text-center text-lg tracking-widest"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleJoin();
                  }
                }}
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-destructive bg-destructive/10 rounded-lg p-3"
              >
                {error}
              </motion.p>
            )}

            <Button
              className="w-full"
              size="lg"
              onClick={handleJoin}
              disabled={isJoining}
            >
              {isJoining ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Joining...
                </span>
              ) : (
                "Join Room"
              )}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
