import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import CopyButton from "./CopyButton";
import Image from "next/image";

const CodeBlock = ({ language, code }: { language: string; code: string }) => {
  const trimmedCode = code
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n");

  return (
    <div className="my-3 rounded-lg overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-base)]">
      <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border-subtle)] bg-[var(--bg-input)]">
        <div className="flex items-center gap-1.5">
          <Image src={`/${language}.png`} alt={language} width={12} height={12} className="object-contain" />
          <span className="text-[10px] uppercase tracking-widest text-[var(--text-faint)]">
            {language || "plaintext"}
          </span>
        </div>
        <CopyButton code={trimmedCode} />
      </div>

      <SyntaxHighlighter
        language={language || "plaintext"}
        style={atomOneDark}
        customStyle={{
          padding: "0.875rem",
          background: "transparent",
          margin: 0,
          fontSize: "0.8rem",
        }}
        showLineNumbers
        wrapLines
      >
        {trimmedCode}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;