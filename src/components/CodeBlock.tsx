import React, { useState } from 'react';

interface CodeBlockProps {
  code: string;
  language?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'typescript' }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className="relative border border-border-light rounded-lg overflow-hidden my-4 bg-neutral-light">
      <div className="flex justify-between items-center px-4 py-2 border-b border-border-light/85 bg-neutral-light text-xs font-sans text-neutral-600 dark:text-neutral-300 font-medium">
        <span>{language.toUpperCase()}</span>
        <button
          onClick={copyToClipboard}
          className="hover:text-brand focus:outline-none transition-colors cursor-pointer"
          type="button"
        >
          {copied ? 'Copied!' : 'Copy Code'}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto font-mono text-sm text-neutral-dark text-left leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
