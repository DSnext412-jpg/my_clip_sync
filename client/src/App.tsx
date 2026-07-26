import { useState, useCallback, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
import LandingPage from "@/components/LandingPage";
import CreateRoom from "@/components/CreateRoom";
import JoinRoom from "@/components/JoinRoom";
import RoomComponent from "@/components/Room";
import { useTheme } from "@/hooks/useTheme";
import type { Room } from "@/types";

type Page = "landing" | "create" | "join" | "room";

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [page, setPage] = useState<Page>("landing");
  const [roomData, setRoomData] = useState<Room | null>(null);

  const goToCreate = useCallback(() => setPage("create"), []);
  const goToJoin = useCallback(() => setPage("join"), []);
  const goToLanding = useCallback(() => {
    setRoomData(null);
    setPage("landing");
  }, []);
  const enterRoom = useCallback((data: Room) => {
    setRoomData(data);
    setPage("room");
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && page !== "landing") {
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
