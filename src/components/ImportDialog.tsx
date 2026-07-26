import { motion, AnimatePresence } from "framer-motion";
import { FileText, Replace, ArrowDownToLine } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImportDialogProps {
  isOpen: boolean;
  fileName: string;
  onReplace: () => void;
  onAppend: () => void;
  onCancel: () => void;
}

export default function ImportDialog({
  isOpen,
  fileName,
  onReplace,
  onAppend,
  onCancel,
}: ImportDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="glass-strong rounded-2xl p-6 max-w-sm w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Import File</h3>
                <p className="text-xs text-muted-foreground truncate max-w-[200px]">{fileName}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-5">
              How would you like to import this file?
            </p>
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={onReplace}
              >
                <Replace className="w-4 h-4 mr-2" />
                Replace current content
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={onAppend}
              >
                <ArrowDownToLine className="w-4 h-4 mr-2" />
                Append to current content
              </Button>
              <Button variant="ghost" className="w-full mt-2" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
