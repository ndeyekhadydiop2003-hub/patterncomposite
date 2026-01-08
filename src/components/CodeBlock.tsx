import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  title?: string;
  className?: string;
}

export function CodeBlock({ code, title, className }: CodeBlockProps) {
  return (
    <div className={cn("rounded-lg overflow-hidden border border-code-border", className)}>
      {title && (
        <div className="bg-code-header px-4 py-2 border-b border-code-border">
          <span className="text-xs font-mono text-muted-foreground">{title}</span>
        </div>
      )}
      <pre className="bg-code-bg p-4 overflow-x-auto">
        <code className="text-sm font-mono text-code-text whitespace-pre">
          {code}
        </code>
      </pre>
    </div>
  );
}
