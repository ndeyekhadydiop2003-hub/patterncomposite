// Interface Component - définit l'interface commune
export interface FileSystemComponent {
  name: string;
  getSize(): number;
  display(indent?: number): string;
  isComposite(): boolean;
}

// Leaf - représente les objets finaux (fichiers)
export class File implements FileSystemComponent {
  constructor(public name: string, private size: number) {}

  getSize(): number {
    return this.size;
  }

  display(indent: number = 0): string {
    const prefix = "  ".repeat(indent);
    return `${prefix}📄 ${this.name} (${this.size} KB)`;
  }

  isComposite(): boolean {
    return false;
  }
}

// Composite - représente les conteneurs (dossiers)
export class Folder implements FileSystemComponent {
  private children: FileSystemComponent[] = [];

  constructor(public name: string) {}

  add(component: FileSystemComponent): void {
    this.children.push(component);
  }

  remove(component: FileSystemComponent): void {
    const index = this.children.indexOf(component);
    if (index > -1) {
      this.children.splice(index, 1);
    }
  }

  getChildren(): FileSystemComponent[] {
    return [...this.children];
  }

  getSize(): number {
    return this.children.reduce((total, child) => total + child.getSize(), 0);
  }

  display(indent: number = 0): string {
    const prefix = "  ".repeat(indent);
    let result = `${prefix}📁 ${this.name} (${this.getSize()} KB total)`;
    
    for (const child of this.children) {
      result += "\n" + child.display(indent + 1);
    }
    
    return result;
  }

  isComposite(): boolean {
    return true;
  }
}

// Créer une structure de démonstration
export function createDemoStructure(): Folder {
  const root = new Folder("projet");
  
  const src = new Folder("src");
  src.add(new File("index.ts", 15));
  src.add(new File("app.ts", 25));
  
  const components = new Folder("components");
  components.add(new File("Button.tsx", 8));
  components.add(new File("Card.tsx", 12));
  components.add(new File("Modal.tsx", 18));
  
  src.add(components);
  
  const assets = new Folder("assets");
  assets.add(new File("logo.png", 45));
  assets.add(new File("styles.css", 10));
  
  root.add(src);
  root.add(assets);
  root.add(new File("package.json", 2));
  root.add(new File("README.md", 5));
  
  return root;
}
