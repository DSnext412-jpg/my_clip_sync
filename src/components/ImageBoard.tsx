import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Image,
  Upload,
  X,
  Download,
  Maximize2,
  Minimize2,
  Trash2,
  ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatBytes, validateImageFile } from "@/lib/utils";
import toast from "react-hot-toast";
import type { RoomImage } from "@/types";

interface ImageBoardProps {
  images: RoomImage[];
  userId: string;
  onUpload: (dataUrl: string, name: string, size: number, type: string) => void;
  onDelete: (imageId: string) => void;
}

export default function ImageBoard({ images, userId, onUpload, onDelete }: ImageBoardProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<RoomImage | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      const error = validateImageFile(file);
      if (error) {
        toast.error(error);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        onUpload(dataUrl, file.name, file.size, file.type);
        toast.success("Image uploaded!");
      };
      reader.readAsDataURL(file);
    },
    [onUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handlePaste = useCallback(
    (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) handleFile(file);
        }
      }
    },
    [handleFile]
  );

  useEffect(() => {
    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [handlePaste]);

  const handleDownload = useCallback((image: RoomImage) => {
    const link = document.createElement("a");
    link.href = image.dataUrl;
    link.download = image.name;
    link.click();
    toast.success("Downloading image...");
  }, []);

  return (
    <div
      className={`relative flex flex-col h-full transition-colors duration-200 ${
        isDragOver ? "bg-primary/5" : ""
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Image className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Images</span>
          <span className="text-xs text-muted-foreground">({images.length})</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="h-8"
        >
          <Upload className="w-3.5 h-3.5 mr-1" />
          Upload
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpg,image/jpeg,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
      </div>

      {/* Drop zone hint */}
      {isDragOver && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="text-center">
            <ImageIcon className="w-12 h-12 text-primary mx-auto mb-2" />
            <p className="text-sm font-medium">Drop image here</p>
          </div>
        </div>
      )}

      {/* Image gallery */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        <AnimatePresence>
          {images.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full text-center py-12"
            >
              <ImageIcon className="w-10 h-10 text-muted-foreground/40 mb-3" />
              <p className="text-sm text-muted-foreground/60 mb-1">No images yet</p>
              <p className="text-xs text-muted-foreground/40">
                Drag & drop, paste, or upload images
              </p>
            </motion.div>
          ) : (
            [...images].reverse().map((image) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                layout
                className="group relative rounded-xl overflow-hidden border border-border/50 bg-card"
              >
                <img
                  src={image.dataUrl}
                  alt={image.name}
                  className="w-full h-32 object-cover cursor-pointer"
                  onClick={() => setFullscreenImage(image)}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => setFullscreenImage(image)}
                    className="p-1.5 rounded-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                  >
                    <Maximize2 className="w-4 h-4 text-white" />
                  </button>
                  <button
                    onClick={() => handleDownload(image)}
                    className="p-1.5 rounded-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                  >
                    <Download className="w-4 h-4 text-white" />
                  </button>
                  <button
                    onClick={() => {
                      onDelete(image.id);
                      toast.success("Image deleted");
                    }}
                    className="p-1.5 rounded-lg bg-red-500/60 backdrop-blur-sm hover:bg-red-500/80 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                </div>
                <div className="px-2 py-1.5 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="truncate mr-2">{image.name}</span>
                  <span className="shrink-0">{formatBytes(image.size)}</span>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Fullscreen overlay */}
      <AnimatePresence>
        {fullscreenImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setFullscreenImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-[90vw] max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-4 right-4 flex gap-2 z-10">
                <button
                  onClick={() => handleDownload(fullscreenImage)}
                  className="p-2 rounded-lg bg-black/40 hover:bg-black/60 text-white transition-colors"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    onDelete(fullscreenImage.id);
                    setFullscreenImage(null);
                    toast.success("Image deleted");
                  }}
                  className="p-2 rounded-lg bg-red-500/60 hover:bg-red-500/80 text-white transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setFullscreenImage(null)}
                  className="p-2 rounded-lg bg-black/40 hover:bg-black/60 text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <img
                src={fullscreenImage.dataUrl}
                alt={fullscreenImage.name}
                className="max-w-full max-h-[85vh] rounded-xl object-contain"
              />
              <p className="text-center text-sm text-white/70 mt-2">
                {fullscreenImage.name} · {formatBytes(fullscreenImage.size)}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
