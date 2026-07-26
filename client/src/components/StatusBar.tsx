import { motion } from "framer-motion";

interface StatusBarProps {
  wordCount: number;
  charCount: number;
  lineCount: number;
  lastUpdated: string;
  isConnected: boolean;
  typingUsers: string[];
}

export default function StatusBar({
  wordCount,
  charCount,
  lineCount,
  lastUpdated,
  isConnected,
  typingUsers,
}: StatusBarProps) {
  return (
    <footer className="glass-strong border-t border-border/50 px-4 h-8 flex items-center justify-between shrink-0 text-xs text-muted-foreground z-40">
      <div className="flex items-center gap-4">
        <span>{wordCount} words</span>
        <span className="hidden sm:inline">{charCount} chars</span>
        <span className="hidden sm:inline">{lineCount} lines</span>
      </div>
      <div className="flex items-center gap-4">
        {typingUsers.length > 0 && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-primary"
          >
            {typingUsers.length === 1
              ? `${typingUsers[0]} is typing...`
              : `${typingUsers.join(", ")} are typing...`}
          </motion.span>
        )}
        {lastUpdated && (
          <span className="hidden sm:inline">Updated {lastUpdated}</span>
        )}
        <span className="flex items-center gap-1">
          <span className={`connection-dot ${isConnected ? "connected" : "disconnected"}`} />
          {isConnected ? "Connected" : "Disconnected"}
        </span>
      </div>
    </footer>
  );
}
