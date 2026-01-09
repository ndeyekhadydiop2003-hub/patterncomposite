import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-javascript";

interface CodeBlockProps {
  code: string;
  title?: string;
  className?: string;
  language?: "typescript" | "javascript";
}

export function CodeBlock({ code, title, className, language = "typescript" }: CodeBlockProps) {
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code, language]);

  return (
    <div className={cn("rounded-lg overflow-hidden border border-code-border", className)}>
      {title && (
        <div className="bg-code-header px-4 py-2 border-b border-code-border">
          <span className="text-xs font-mono text-muted-foreground">{title}</span>
        </div>
      )}
      <pre className="bg-code-bg p-4 overflow-x-auto">
        <code
          ref={codeRef}
          className={`text-sm font-mono whitespace-pre language-${language}`}
        >
          {code}
        </code>
      </pre>
    </div>
  );
}
