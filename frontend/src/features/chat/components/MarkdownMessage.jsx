import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const components = {
  p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
  strong: ({ children }) => (
    <strong className="font-semibold text-white">{children}</strong>
  ),
  h1: ({ children }) => (
    <h1 className="mb-3 mt-6 text-2xl font-semibold first:mt-0">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-3 mt-6 text-xl font-semibold first:mt-0">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-2 mt-5 text-lg font-semibold first:mt-0">{children}</h3>
  ),
  ul: ({ children }) => <ul className="mb-4 list-disc pl-6">{children}</ul>,
  ol: ({ children }) => <ol className="mb-4 list-decimal pl-6">{children}</ol>,
  li: ({ children }) => <li className="mb-1">{children}</li>,
  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-[#7ab7ff] underline"
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="mb-4 border-l-2 border-[#424242] pl-4 text-[#b4b4b4]">
      {children}
    </blockquote>
  ),
  pre: ({ children }) => (
    <pre className="mb-4 overflow-x-auto rounded-xl bg-[#171717] p-4 text-sm">
      {children}
    </pre>
  ),
  code: ({ className, children }) =>
    className ? (
      <code className={className}>{children}</code>
    ) : (
      <code className="rounded bg-[#424242] px-1.5 py-0.5 text-[0.9em]">
        {children}
      </code>
    ),
  table: ({ children }) => (
    <div className="mb-4 overflow-x-auto">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border-b border-[#424242] px-3 py-2 text-left font-semibold">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-b border-[#333] px-3 py-2">{children}</td>
  ),
};

function MarkdownMessage({ content }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {content}
    </ReactMarkdown>
  );
}

export default MarkdownMessage;
