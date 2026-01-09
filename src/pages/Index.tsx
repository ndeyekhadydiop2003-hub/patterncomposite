import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, FolderPlus, RotateCcw, Code2, GitBranch, Layers, Info, FileText, Folder as FolderIcon } from "lucide-react";
import { TreeNode } from "@/components/TreeNode";
import { CodeBlock } from "@/components/CodeBlock";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createDemoStructure,
  File,
  Folder,
  FileSystemComponent,
} from "@/lib/composite-pattern";

const componentCode = `// Interface Component
interface FileSystemComponent {
  name: string;
  getSize(): number;
  display(): string;
  isComposite(): boolean;
}`;

const leafCode = `// Leaf - objets finaux (fichiers)
class File implements FileSystemComponent {
  constructor(
    public name: string, 
    private size: number
  ) {}

  getSize(): number {
    return this.size;
  }

  isComposite(): boolean {
    return false;
  }
}`;

const compositeCode = `// Composite - conteneurs (dossiers)
class Folder implements FileSystemComponent {
  private children: FileSystemComponent[] = [];

  add(component: FileSystemComponent) {
    this.children.push(component);
  }

  getSize(): number {
    return this.children.reduce(
      (total, child) => total + child.getSize(), 
      0
    );
  }

  isComposite(): boolean {
    return true;
  }
}`;

export default function Index() {
  const [root, setRoot] = useState<Folder>(createDemoStructure);
  const [newItemName, setNewItemName] = useState("");
  const [newItemSize, setNewItemSize] = useState("10");
  const [selectedNode, setSelectedNode] = useState<FileSystemComponent | null>(null);

  const resetStructure = useCallback(() => {
    setRoot(createDemoStructure());
    setSelectedNode(null);
  }, []);

  const addFile = useCallback(() => {
    if (!newItemName.trim()) return;
    const newRoot = createDemoStructure();
    const size = parseInt(newItemSize) || 10;
    newRoot.add(new File(newItemName, size));
    // Copy existing children
    root.getChildren().forEach((child) => {
      if (child.name !== newItemName) {
        if (child.isComposite()) {
          newRoot.add(child as Folder);
        } else {
          newRoot.add(child as File);
        }
      }
    });
    setRoot(newRoot);
    setNewItemName("");
  }, [newItemName, newItemSize, root]);

  const addFolder = useCallback(() => {
    if (!newItemName.trim()) return;
    const newFolder = new Folder(newItemName);
    const newRoot = new Folder(root.name);
    root.getChildren().forEach((child) => newRoot.add(child));
    newRoot.add(newFolder);
    setRoot(newRoot);
    setNewItemName("");
  }, [newItemName, root]);

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
                Design Pattern Structurel · JavaScript/TypeScript
              </p>
            </div>
          </motion.div>
        </div>
      </header>

      <main className="container py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Interactive Demo */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
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
                    Les deux implémentent la même interface{" "}
                    <code className="text-accent">FileSystemComponent</code>
                  </span>
                </li>
              </ul>
            </div>
          </motion.section>

          {/* Right Column - Code Examples */}
          <motion.section
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Code2 className="w-5 h-5 text-accent" />
              <h2 className="text-xl font-semibold">Implémentation</h2>
            </div>

            <CodeBlock code={componentCode} title="Component Interface" />
            <CodeBlock code={leafCode} title="Leaf (File)" />
            <CodeBlock code={compositeCode} title="Composite (Folder)" />

            {/* Pattern Benefits */}
            <div className="border-gradient rounded-lg p-4 bg-card">
              <h3 className="font-semibold mb-3 text-accent">Avantages</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 rounded-md bg-muted">
                  <span className="font-medium">Uniformité</span>
                  <p className="text-muted-foreground text-xs mt-1">
                    Traite objets simples et composés de manière identique
                  </p>
                </div>
                <div className="p-3 rounded-md bg-muted">
                  <span className="font-medium">Extensibilité</span>
                  <p className="text-muted-foreground text-xs mt-1">
                    Facile d'ajouter de nouveaux types de composants
                  </p>
                </div>
                <div className="p-3 rounded-md bg-muted">
                  <span className="font-medium">Récursivité</span>
                  <p className="text-muted-foreground text-xs mt-1">
                    Les opérations se propagent naturellement
                  </p>
                </div>
                <div className="p-3 rounded-md bg-muted">
                  <span className="font-medium">Simplicité</span>
                  <p className="text-muted-foreground text-xs mt-1">
                    Code client simplifié grâce à l'interface commune
                  </p>
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="container py-6 text-center text-sm text-muted-foreground">
          Design Pattern Composite · GoF · JavaScript/TypeScript
        </div>
      </footer>
    </div>
  );
}
