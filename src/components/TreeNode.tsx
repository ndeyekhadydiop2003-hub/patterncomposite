import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, FileText, Folder, FolderOpen, Trash2 } from "lucide-react";
import { FileSystemComponent, Folder as FolderClass } from "@/lib/composite-pattern";
import { cn } from "@/lib/utils";

interface TreeNodeProps {
  node: FileSystemComponent;
  depth?: number;
  onRemove?: (node: FileSystemComponent) => void;
}

export function TreeNode({ node, depth = 0, onRemove }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const isFolder = node.isComposite();
  const children = isFolder ? (node as FolderClass).getChildren() : [];

  return (
    <div className="select-none">
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: depth * 0.05 }}
        className={cn(
          "group flex items-center gap-2 py-1.5 px-2 rounded-md cursor-pointer transition-all duration-200",
          "hover:bg-node-hover",
          isFolder ? "text-folder" : "text-file"
        )}
        style={{ paddingLeft: `${depth * 20 + 8}px` }}
        onClick={() => isFolder && setIsExpanded(!isExpanded)}
      >
        {isFolder && (
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </motion.div>
        )}
        
        {isFolder ? (
          isExpanded ? (
            <FolderOpen className="w-5 h-5" />
          ) : (
            <Folder className="w-5 h-5" />
          )
        ) : (
          <FileText className="w-5 h-5" />
        )}
        
        <span className="font-mono text-sm">{node.name}</span>
        
        <span className="ml-auto text-xs text-muted-foreground font-mono">
          {node.getSize()} KB
        </span>

        {onRemove && depth > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(node);
            }}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/20 rounded transition-all"
          >
            <Trash2 className="w-3.5 h-3.5 text-destructive" />
          </button>
        )}
      </motion.div>

      <AnimatePresence>
        {isFolder && isExpanded && children.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {children.map((child, index) => (
              <TreeNode
                key={`${child.name}-${index}`}
                node={child}
                depth={depth + 1}
                onRemove={onRemove}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
