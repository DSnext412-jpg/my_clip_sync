import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Wand2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { connectSocket, getSocket } from "@/lib/socket";
import { generateRoomCode, validateRoomCode } from "@/lib/utils";
import toast from "react-hot-toast";
import type { Room } from "@/types";

interface CreateRoomProps {
  onRoomCreated: (room: Room) => void;
  onBack: () => void;
}

export default function CreateRoom({ onRoomCreated, onBack }: CreateRoomProps) {
  const [roomName, setRoomName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleGenerateCode = useCallback(() => {
    setRoomCode(generateRoomCode());
    setError("");
  }, []);

  const handleCreate = useCallback(async () => {
    const name = roomName.trim();
    const code = roomCode.trim();

    if (!name) {
      setError("Please enter a room name.");
      return;
    }
    if (name.length > 50) {
      setError("Room name must be at most 50 characters.");
      return;
    }

    const codeError = validateRoomCode(code);
    if (codeError) {
      setError(codeError);
      return;
    }

    setIsCreating(true);
    setError("");

    try {
      const socket = connectSocket();

      const onCreated = (room: Room) => {
        socket.off("room_created", onCreated);
        socket.off("room_error", onError);
        toast.success("Room created successfully!");
        onRoomCreated(room);
      };

      const onError = (msg: string) => {
        socket.off("room_created", onCreated);
        socket.off("room_error", onError);
        setError(msg);
        setIsCreating(false);
      };

      socket.on("room_created", onCreated);
      socket.on("room_error", onError);

      socket.emit("create_room", name, code);

      setTimeout(() => {
        socket.off("room_created", onCreated);
        socket.off("room_error", onError);
        setIsCreating(false);
      }, 10000);
    } catch {
      setError("Failed to connect to server. Please try again.");
      setIsCreating(false);
    }
  }, [roomName, roomCode, onRoomCreated]);

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
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle>Create a Room</CardTitle>
                <CardDescription>Set up your collaborative workspace</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Room Name</label>
              <Input
                placeholder="e.g. Study Group, Project Alpha"
                value={roomName}
                onChange={(e) => {
                  setRoomName(e.target.value);
                  setError("");
                }}
                maxLength={50}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Room Code</label>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g. dragon123"
                  value={roomCode}
                  onChange={(e) => {
                    setRoomCode(e.target.value.replace(/\s/g, ""));
                    setError("");
                  }}
                  maxLength={30}
                  className="font-mono"
                />
                <Button variant="outline" onClick={handleGenerateCode} title="Generate random code">
                  <Wand2 className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                4-30 characters. Letters, numbers, dash (-), underscore (_).
              </p>
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
              onClick={handleCreate}
              disabled={isCreating}
            >
              {isCreating ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </span>
              ) : (
                "Create Room"
              )}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
