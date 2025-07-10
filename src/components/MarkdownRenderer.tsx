import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer = ({
  content,
  className = "",
}: MarkdownRendererProps) => {
  return (
    <div
      className={`prose prose-sm max-w-none prose-headings:my-1 prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0 ${className}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Стилизация заголовков
          h1: ({ children }) => (
            <h1 className="text-lg font-bold text-gray-900 mb-2 mt-2 first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-base font-bold text-gray-900 mb-1 mt-2 first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-sm font-semibold text-gray-900 mb-1 mt-1 first:mt-0">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-sm font-semibold text-gray-900 mb-1 mt-1 first:mt-0">
              {children}
            </h4>
          ),
          h5: ({ children }) => (
            <h5 className="text-xs font-semibold text-gray-900 mb-1 mt-1 first:mt-0">
              {children}
            </h5>
          ),
          h6: ({ children }) => (
            <h6 className="text-xs font-medium text-gray-900 mb-1 mt-1 first:mt-0">
              {children}
            </h6>
          ),
          // Стилизация параграфов
          p: ({ children }) => (
            <p className="text-gray-700 mb-1 leading-relaxed">{children}</p>
          ),
          // Стилизация жирного текста
          strong: ({ children }) => (
            <strong className="font-bold text-gray-900">{children}</strong>
          ),
          // Стилизация курсива
          em: ({ children }) => (
            <em className="italic text-gray-800">{children}</em>
          ),
          // Стилизация списков
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-1 space-y-0.5 text-gray-700">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-1 space-y-0.5 text-gray-700">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-gray-700 leading-relaxed">{children}</li>
          ),
          // Стилизация ссылок
          a: ({ children, href }) => (
            <a
              href={href}
              className="text-blue-600 hover:text-blue-800 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          // Стилизация блоков кода
          code: ({ children, className }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm font-mono">
                  {children}
                </code>
              );
            }
            return (
              <code className="block bg-gray-100 text-gray-800 p-3 rounded text-sm font-mono overflow-x-auto">
                {children}
              </code>
            );
          },
          // Стилизация блоков кода
          pre: ({ children }) => (
            <pre className="bg-gray-100 text-gray-800 p-3 rounded text-sm font-mono overflow-x-auto mb-3">
              {children}
            </pre>
          ),
          // Стилизация цитат
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 mb-3">
              {children}
            </blockquote>
          ),
          // Стилизация горизонтальных линий
          hr: () => <hr className="border-gray-300 my-4" />,
          // Стилизация таблиц
          table: ({ children }) => (
            <div className="overflow-x-auto mb-3">
              <table className="min-w-full border border-gray-300">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gray-50">{children}</thead>
          ),
          tbody: ({ children }) => <tbody>{children}</tbody>,
          tr: ({ children }) => (
            <tr className="border-b border-gray-300">{children}</tr>
          ),
          th: ({ children }) => (
            <th className="px-3 py-2 text-left font-semibold text-gray-900">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-3 py-2 text-gray-700">{children}</td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
