import { useState, useCallback, useEffect, useRef } from "react";
import { Toaster } from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
import LandingPage from "@/components/LandingPage";
import CreateRoom from "@/components/CreateRoom";
import JoinRoom from "@/components/JoinRoom";
import RoomComponent from "@/components/Room";
import { useTheme } from "@/hooks/useTheme";
import { connectSocket } from "@/lib/socket";
import type { Room } from "@/types";

type Page = "landing" | "create" | "join" | "room" | "rejoining";

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [page, setPage] = useState<Page>("landing");
  const [roomData, setRoomData] = useState<Room | null>(null);
  const rejoiningRef = useRef(false);

  const goToCreate = useCallback(() => { setPage("create"); window.location.hash = ""; }, []);
  const goToJoin = useCallback(() => { setPage("join"); window.location.hash = ""; }, []);
  const goToLanding = useCallback(() => {
    setRoomData(null);
    setPage("landing");
    window.location.hash = "";
  }, []);
  const enterRoom = useCallback((data: Room) => {
    setRoomData(data);
    setPage("room");
    window.location.hash = data.roomCode;
  }, []);

  // Rejoin room from URL hash on mount
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;

    rejoiningRef.current = true;
    setPage("rejoining");

    const socket = connectSocket();

    const onJoined = (room: Room) => {
      socket.off("room_joined", onJoined);
      socket.off("room_error", onError);
      rejoiningRef.current = false;
      enterRoom(room);
    };

    const onError = (msg: string) => {
      socket.off("room_joined", onJoined);
      socket.off("room_error", onError);
      rejoiningRef.current = false;
      window.location.hash = "";
      setPage("landing");
    };

    socket.on("room_joined", onJoined);
    socket.on("room_error", onError);
    socket.emit("join_room", hash);

    return () => {
      socket.off("room_joined", onJoined);
      socket.off("room_error", onError);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && page !== "landing" && page !== "rejoining") {
        goToLanding();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [page, goToLanding]);

  return (
    <div className="min-h-screen animated-gradient">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "12px",
            background: "hsl(var(--card))",
            color: "hsl(var(--foreground))",
            border: "1px solid hsl(var(--border))",
          },
          success: {
            iconTheme: { primary: "#22c55e", secondary: "#fff" },
          },
          error: {
            iconTheme: { primary: "#ef4444", secondary: "#fff" },
          },
        }}
      />
      <AnimatePresence mode="wait">
        {page === "landing" && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
          >
            <LandingPage
              onCreateRoom={goToCreate}
              onJoinRoom={goToJoin}
              theme={theme}
              onToggleTheme={toggleTheme}
            />
          </motion.div>
        )}
        {page === "create" && (
          <motion.div
            key="create"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
          >
            <CreateRoom onRoomCreated={enterRoom} onBack={goToLanding} />
          </motion.div>
        )}
        {page === "join" && (
          <motion.div
            key="join"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
          >
            <JoinRoom onRoomJoined={enterRoom} onBack={goToLanding} />
          </motion.div>
        )}
        {page === "rejoining" && (
          <motion.div
            key="rejoining"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              <p className="text-sm text-muted-foreground">Rejoining room...</p>
            </div>
          </motion.div>
        )}
        {page === "room" && (
          <motion.div
            key="room"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
          >
            {roomData && <RoomComponent initialRoom={roomData} onLeave={goToLanding} theme={theme} onToggleTheme={toggleTheme} />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
