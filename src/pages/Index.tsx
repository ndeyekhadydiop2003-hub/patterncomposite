import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, FolderPlus, RotateCcw, GitBranch, Layers, Info, FileText, Folder as FolderIcon } from "lucide-react";
import { TreeNode } from "@/components/TreeNode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createDemoStructure,
  File,
  Folder,
} from "@/lib/composite-pattern";

// Helper function to get all folders recursively
function getAllFolders(node, path = "") {
  const folders = [];
  const currentPath = path ? `${path}/${node.name}` : node.name;
  
  if (node.isComposite()) {
    folders.push({ folder: node, path: currentPath });
    node.getChildren().forEach((child) => {
      if (child.isComposite()) {
        folders.push(...getAllFolders(child, currentPath));
      }
    });
  }
  
  return folders;
}

// Helper function to find a folder by path
function findFolderByPath(root, path) {
  if (path === root.name) return root;
  
  const parts = path.split("/").slice(1);
  let current = root;
  
  for (const part of parts) {
    const found = current.getChildren().find(
      (child) => child.isComposite() && child.name === part
    );
    if (found) {
      current = found;
    } else {
      return null;
    }
  }
  
  return current;
}

// Deep clone function for the tree structure
function cloneTree(node) {
  if (!node.isComposite()) {
    return new File(node.name, node.size);
  }
  
  const clonedFolder = new Folder(node.name);
  node.getChildren().forEach((child) => {
    clonedFolder.add(cloneTree(child));
  });
  
  return clonedFolder;
}

export default function Index() {
  const [root, setRoot] = useState(createDemoStructure);
  const [newItemName, setNewItemName] = useState("");
  const [newItemSize, setNewItemSize] = useState("10");
  const [selectedNode, setSelectedNode] = useState(null);
  const [targetFolderPath, setTargetFolderPath] = useState("");

  // Get all available folders for the select
  const availableFolders = useMemo(() => getAllFolders(root), [root]);

  // Set default target folder to root if not set
  useMemo(() => {
    if (!targetFolderPath && availableFolders.length > 0) {
      setTargetFolderPath(availableFolders[0].path);
    }
  }, [availableFolders, targetFolderPath]);

  const resetStructure = useCallback(() => {
    setRoot(createDemoStructure());
    setSelectedNode(null);
    setTargetFolderPath("");
  }, []);

  const addFile = useCallback(() => {
    if (!newItemName.trim() || !targetFolderPath) return;
    
    const newRoot = cloneTree(root);
    const targetFolder = findFolderByPath(newRoot, targetFolderPath);
    
    if (targetFolder) {
      const size = parseInt(newItemSize) || 10;
      targetFolder.add(new File(newItemName, size));
      setRoot(newRoot);
      setNewItemName("");
    }
  }, [newItemName, newItemSize, root, targetFolderPath]);

  const addFolder = useCallback(() => {
    if (!newItemName.trim() || !targetFolderPath) return;
    
    const newRoot = cloneTree(root);
    const targetFolder = findFolderByPath(newRoot, targetFolderPath);
    
    if (targetFolder) {
      targetFolder.add(new Folder(newItemName));
      setRoot(newRoot);
      setNewItemName("");
    }
  }, [newItemName, root, targetFolderPath]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4"
          >
            <div className="p-3 rounded-xl bg-primary/10 glow-primary">
              <Layers className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gradient">
                Composite Pattern
              </h1>
              <p className="text-muted-foreground">
                Design Pattern Structurel · JavaScript
              </p>
            </div>
          </motion.div>
        </div>
      </header>

      <main className="container py-8 max-w-4xl mx-auto">
        <div className="flex flex-col gap-8">
          {/* Interactive Demo Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <GitBranch className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Démo Interactive</h2>
            </div>

            {/* File Tree */}
            <div className="border-gradient rounded-lg p-4 bg-card">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground font-mono">
                  Système de fichiers
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetStructure}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
              <TreeNode 
                node={root} 
                selectedNode={selectedNode}
                onSelect={setSelectedNode}
              />
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Taille totale:{" "}
                  <span className="text-primary font-mono font-bold">
                    {root.getSize()} KB
                  </span>
                </p>
              </div>
            </div>

            {/* Details Panel */}
            <AnimatePresence mode="wait">
              {selectedNode && (
                <motion.div
                  key={selectedNode.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="border-gradient rounded-lg p-4 bg-card"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Info className="w-4 h-4 text-accent" />
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Détails de l'élément
                    </h3>
                  </div>
                  
                  <div className="space-y-3">
                    {/* Name */}
                    <div className="flex items-center gap-3 p-3 rounded-md bg-muted">
                      {selectedNode.isComposite() ? (
                        <FolderIcon className="w-5 h-5 text-folder" />
                      ) : (
                        <FileText className="w-5 h-5 text-file" />
                      )}
                      <div>
                        <p className="text-xs text-muted-foreground">Nom</p>
                        <p className="font-mono font-medium">{selectedNode.name}</p>
                      </div>
                    </div>

                    {/* Type */}
                    <div className="flex items-center justify-between p-3 rounded-md bg-muted">
                      <div>
                        <p className="text-xs text-muted-foreground">Type</p>
                        <p className="font-medium">
                          {selectedNode.isComposite() ? (
                            <span className="text-folder">Composite (Folder)</span>
                          ) : (
                            <span className="text-file">Leaf (File)</span>
                          )}
                        </p>
                      </div>
                      <code className="text-xs bg-background px-2 py-1 rounded text-accent">
                        isComposite(): {String(selectedNode.isComposite())}
                      </code>
                    </div>

                    {/* Size */}
                    <div className="p-3 rounded-md bg-muted">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-xs text-muted-foreground">Taille</p>
                          <p className="font-mono font-bold text-lg text-primary">
                            {selectedNode.getSize()} KB
                          </p>
                        </div>
                        <code className="text-xs bg-background px-2 py-1 rounded text-accent">
                          getSize()
                        </code>
                      </div>
                      <div className="mt-3 pt-3 border-t border-border">
                        <p className="text-xs text-muted-foreground flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          La même méthode <code className="text-accent">getSize()</code> est utilisée pour les fichiers et les dossiers
                        </p>
                        {selectedNode.isComposite() && (
                          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-folder" />
                            Pour un dossier, la taille est calculée récursivement
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Add Controls */}
            <div className="border-gradient rounded-lg p-4 bg-card space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Ajouter un élément
              </h3>
              
              {/* Target Folder Selector */}
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">
                  Dossier de destination
                </label>
                <Select value={targetFolderPath} onValueChange={setTargetFolderPath}>
                  <SelectTrigger className="bg-muted border-border">
                    <SelectValue placeholder="Sélectionner un dossier..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableFolders.map(({ path }) => (
                      <SelectItem key={path} value={path}>
                        <span className="flex items-center gap-2">
                          <FolderIcon className="w-4 h-4 text-folder" />
                          {path}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Nom..."
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="flex-1 bg-muted border-border"
                />
                <Input
                  type="number"
                  placeholder="Taille (KB)"
                  value={newItemSize}
                  onChange={(e) => setNewItemSize(e.target.value)}
                  className="w-24 bg-muted border-border"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={addFile}
                  variant="outline"
                  className="flex-1 border-file/50 text-file hover:bg-file/10"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Fichier
                </Button>
                <Button
                  onClick={addFolder}
                  variant="outline"
                  className="flex-1 border-folder/50 text-folder hover:bg-folder/10"
                >
                  <FolderPlus className="w-4 h-4 mr-2" />
                  Dossier
                </Button>
              </div>
            </div>

            {/* Explanation */}
            <div className="border-gradient rounded-lg p-4 bg-card">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                Comment ça marche ?
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">→</span>
                  <span>
                    <strong className="text-foreground">File</strong> (Leaf) : représente
                    un fichier avec une taille fixe
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">→</span>
                  <span>
                    <strong className="text-foreground">Folder</strong> (Composite) :
                    contient d'autres éléments et calcule sa taille récursivement
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">→</span>
                  <span>
                    Les deux classes partagent les mêmes méthodes{" "}
                    <code className="text-accent">getSize()</code> et <code className="text-accent">isComposite()</code>
                  </span>
                </li>
              </ul>
            </div>
          </motion.section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="container py-6 text-center text-sm text-muted-foreground">
          Design Pattern Composite · GoF · JavaScript ES6
        </div>
      </footer>
    </div>
  );
}
