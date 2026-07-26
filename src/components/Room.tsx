import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import Editor, { OnMount } from "@monaco-editor/react";
import Toolbar from "./Toolbar";
import StatusBar from "./StatusBar";
import ImageBoard from "./ImageBoard";
import ImportDialog from "./ImportDialog";
import { getSocket, connectSocket, disconnectSocket } from "@/lib/socket";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";
import type {
  Room as RoomType,
  RoomImage,
  RoomUser,
  ConnectionStatus,
} from "@/types";

interface RoomProps {
  initialRoom: RoomType;
  onLeave: () => void;
  theme: string;
  onToggleTheme: () => void;
}

export default function Room({ initialRoom, onLeave, theme, onToggleTheme }: RoomProps) {
  const [room, setRoom] = useState<RoomType>(initialRoom);
  const [content, setContent] = useState(initialRoom.content);
  const [users, setUsers] = useState<RoomUser[]>(initialRoom.users);
  const [images, setImages] = useState<RoomImage[]>(initialRoom.images);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("connected");
  const [userId, setUserId] = useState("");
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("");
  const [importState, setImportState] = useState<{ open: boolean; fileName: string; fileContent: string }>({
    open: false,
    fileName: "",
    fileContent: "",
  });

  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const isLocalChange = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Connect socket and set up real-time listeners
  useEffect(() => {
    const socket = connectSocket();
    setUserId(socket.id || "");
    setConnectionStatus("connected");

    const handleTextUpdated = (newContent: string) => {
      isLocalChange.current = true;
      setContent(newContent);
      setLastUpdated(formatDate(Date.now()));
      setTimeout(() => {
        isLocalChange.current = false;
      }, 100);
    };

    const handleImageAdded = (image: RoomImage) => {
      setImages((prev) => [...prev, image]);
    };

    const handleImageDeleted = (imageId: string) => {
      setImages((prev) => prev.filter((img) => img.id !== imageId));
    };

    const handleUserJoined = (user: RoomUser, allUsers: RoomUser[]) => {
      setUsers(allUsers);
      toast(`${user.name} joined the room`, { icon: "👋" });
    };

    const handleUserLeft = (leftUserId: string, allUsers: RoomUser[]) => {
      const leftUser = allUsers.find((u) => u.id === leftUserId);
      setUsers(allUsers);
      if (leftUser) {
        toast(`${leftUser.name} left the room`, { icon: "🚪" });
      }
    };

    const handleTypingStatus = (userId: string, isTyping: boolean) => {
      setTypingUsers((prev) => {
        if (isTyping) {
          if (!prev.includes(userId)) return [...prev, userId];
          return prev;
        }
        return prev.filter((id) => id !== userId);
      });
    };

    const handleError = (msg: string) => {
      toast.error(msg);
    };

    socket.on("text_updated", handleTextUpdated);
    socket.on("image_added", handleImageAdded);
    socket.on("image_deleted", handleImageDeleted);
    socket.on("user_joined", handleUserJoined);
    socket.on("user_left", handleUserLeft);
    socket.on("typing_status", handleTypingStatus);
    socket.on("room_error", handleError);

    socket.io.on("reconnect", () => {
      setConnectionStatus("connected");
      toast.success("Reconnected!");
    });

    socket.io.on("reconnect_attempt", () => {
      setConnectionStatus("reconnecting");
    });

    (socket as any).on("disconnect", () => {
      setConnectionStatus("disconnected");
    });

    return () => {
      socket.off("text_updated", handleTextUpdated);
      socket.off("image_added", handleImageAdded);
      socket.off("image_deleted", handleImageDeleted);
      socket.off("user_joined", handleUserJoined);
      socket.off("user_left", handleUserLeft);
      socket.off("typing_status", handleTypingStatus);
      socket.off("room_error", handleError);
    };
  }, [initialRoom.roomCode]);

  // Handle editor changes
  const handleEditorChange = useCallback(
    (value: string | undefined) => {
      if (value === undefined) return;
      setContent(value);

      const socket = getSocket();

      // Debounce text updates
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        socket.emit("text_change", value);
      }, 300);

      // Typing indicator
      socket.emit("typing", true);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("typing", false);
      }, 1000);
    },
    []
  );

  // Update editor content when receiving remote changes
  useEffect(() => {
    if (editorRef.current && isLocalChange.current) {
      isLocalChange.current = false;
    }
  }, [content]);

  // Handle image upload
  const handleImageUpload = useCallback(
    (dataUrl: string, name: string, size: number, type: string) => {
      const socket = getSocket();
      socket.emit("upload_image", { dataUrl, name, size, type });
    },
    []
  );

  // Handle image delete
  const handleImageDelete = useCallback((imageId: string) => {
    const socket = getSocket();
    socket.emit("delete_image", imageId);
  }, []);

  // Copy entire workspace
  const copyWorkspace = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success("Copied Successfully");
    } catch {
      toast.error("Failed to copy");
    }
  }, [content]);

  // Import file
  const importFile = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".txt,.md";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result as string;
        setImportState({ open: true, fileName: file.name, fileContent: text });
      };
      reader.readAsText(file);
    };
    input.click();
  }, []);

  const handleImportReplace = useCallback(() => {
    const text = importState.fileContent;
    const socket = getSocket();
    setContent(text);
    socket.emit("text_change", text);
    setImportState((prev) => ({ ...prev, open: false }));
    toast.success("Imported Successfully");
  }, [importState.fileContent]);

  const handleImportAppend = useCallback(() => {
    const text = importState.fileContent;
    const socket = getSocket();
    const newContent = content + "\n" + text;
    setContent(newContent);
    socket.emit("text_change", newContent);
    setImportState((prev) => ({ ...prev, open: false }));
    toast.success("Imported Successfully");
  }, [importState.fileContent, content]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "o": {
            e.preventDefault();
            importFile();
            break;
          }
          case "Shift":
            if (e.key.toUpperCase() === "C") {
              e.preventDefault();
              copyWorkspace();
            }
            break;
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toUpperCase() === "C") {
        e.preventDefault();
        copyWorkspace();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [copyWorkspace, importFile]);

  // Handle paste images
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) {
            e.preventDefault();
            const reader = new FileReader();
            reader.onload = (ev) => {
              const dataUrl = ev.target?.result as string;
              handleImageUpload(dataUrl, file.name, file.size, file.type);
            };
            reader.readAsDataURL(file);
          }
        }
      }
    };
    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [handleImageUpload]);

  // Compute stats
  const wordCount = useMemo(
    () => (content.trim() ? content.trim().split(/\s+/).length : 0),
    [content]
  );
  const charCount = useMemo(() => content.length, [content]);
  const lineCount = useMemo(() => (content ? content.split("\n").length : 0), [content]);

  const isConnected = connectionStatus === "connected";

  const typingNames = useMemo(
    () =>
      typingUsers
        .map((id) => users.find((u) => u.id === id)?.name)
        .filter((n): n is string => !!n),
    [typingUsers, users]
  );

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Connecting to room...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <Toolbar
        roomName={room.roomName}
        roomCode={room.roomCode}
        userCount={users.length}
        connectionStatus={connectionStatus}
        theme={theme}
        onToggleTheme={onToggleTheme}
        onLeave={onLeave}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Editor */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 relative">
            <Editor
              height="100%"
              defaultLanguage="plaintext"
              theme={theme === "dark" ? "vs-dark" : "vs"}
              value={content}
              onChange={handleEditorChange}
              onMount={(editor) => {
                editorRef.current = editor;
              }}
              options={{
                minimap: { enabled: false },
                wordWrap: "on",
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
                fontSize: 14,
                fontFamily: "'Cascadia Code', 'Fira Code', 'JetBrains Mono', monospace",
                padding: { top: 12 },
                smoothScrolling: true,
                cursorBlinking: "smooth",
                cursorSmoothCaretAnimation: "on",
                bracketPairColorization: { enabled: true },
                suggest: { showWords: false },
                quickSuggestions: false,
                renderWhitespace: "selection",
                contextmenu: true,
                folding: false,
                glyphMargin: false,
                lineDecorationsWidth: 8,
                lineNumbersMinChars: 3,
              }}
              loading={
                <div className="h-full flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                    <p className="text-xs text-muted-foreground">Loading editor...</p>
                  </div>
                </div>
              }
            />
          </div>
          <StatusBar
            wordCount={wordCount}
            charCount={charCount}
            lineCount={lineCount}
            lastUpdated={lastUpdated}
            isConnected={isConnected}
            typingUsers={typingNames}
          />
        </div>

        {/* Right: Image Board */}
        <motion.div
          animate={{ width: showRightPanel ? 280 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="border-l border-border/50 overflow-hidden shrink-0"
        >
          {showRightPanel && (
            <ImageBoard
              images={images}
              userId={userId}
              onUpload={handleImageUpload}
              onDelete={handleImageDelete}
            />
          )}
        </motion.div>
      </div>

      <ImportDialog
        isOpen={importState.open}
        fileName={importState.fileName}
        onReplace={handleImportReplace}
        onAppend={handleImportAppend}
        onCancel={() => setImportState((prev) => ({ ...prev, open: false }))}
      />
    </div>
  );
}
