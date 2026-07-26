import { Moon, Sun, Copy, Users, DoorOpen, Check, ClipboardCopy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConnectionStatus } from "@/types";
import toast from "react-hot-toast";

interface ToolbarProps {
  roomName: string;
  roomCode: string;
  userCount: number;
  connectionStatus: ConnectionStatus;
  theme: string;
  onToggleTheme: () => void;
  onLeave: () => void;
}

export default function Toolbar({
  roomName,
  roomCode,
  userCount,
  connectionStatus,
  theme,
  onToggleTheme,
  onLeave,
}: ToolbarProps) {
  const copyRoomCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
      toast.success("Room code copied to clipboard!");
    } catch {
      toast.error("Failed to copy room code.");
    }
  };

  const connectionLabel = {
    connected: "Connected",
    connecting: "Connecting...",
    reconnecting: "Reconnecting...",
    disconnected: "Disconnected",
  }[connectionStatus];

  return (
    <header className="glass-strong border-b border-border/50 px-4 h-14 flex items-center justify-between shrink-0 z-40">
      <div className="flex items-center gap-4 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <h2 className="font-semibold text-sm truncate">{roomName}</h2>
          <span className="text-xs text-muted-foreground hidden sm:inline">/</span>
          <code className="text-xs font-mono bg-primary/10 text-primary px-2 py-0.5 rounded hidden sm:inline">
            {roomCode}
          </code>
        </div>
        <Button variant="ghost" size="icon" onClick={copyRoomCode} className="h-8 w-8" title="Copy room code">
          <ClipboardCopy className="w-3.5 h-3.5" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mr-2">
          <span
            className={`connection-dot ${connectionStatus}`}
          />
          <span className="hidden sm:inline">{connectionLabel}</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mr-3">
          <Users className="w-3.5 h-3.5" />
          <span>{userCount}</span>
        </div>

        <Button variant="ghost" size="icon" onClick={onToggleTheme} className="h-8 w-8" title="Toggle theme">
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
        <Button variant="ghost" size="icon" onClick={onLeave} className="h-8 w-8 text-destructive hover:text-destructive" title="Leave room">
          <DoorOpen className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}
