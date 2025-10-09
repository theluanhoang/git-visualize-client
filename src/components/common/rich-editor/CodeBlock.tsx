'use client';

import { NodeViewProps } from '@tiptap/react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import React, { useState } from 'react';

export default function CodeBlock({ node, updateAttributes, editor }: NodeViewProps) {
  const [copied, setCopied] = useState<boolean>(false);
  const language = (node.attrs.language as string) || 'bash';
  const code = node.textContent || '';
  const isBash = language.toLowerCase() === 'bash' || language.toLowerCase() === 'sh';
  const isEmpty = !code.trim();

const copyToClipboard = async (): Promise<void> => {
    try {
      let textToCopy = code;

      if (isBash) {
        textToCopy = code
          .split('\n')
          .map(line => {
            return line.replace(/^\$\s?/, '');
          })
          .join('\n')
          .trim();
      }

      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const newLanguage = e.target.value;
    const oldIsBash = isBash;
    const newIsBash = newLanguage.toLowerCase() === 'bash' || newLanguage.toLowerCase() === 'sh';
    
    updateAttributes({ language: newLanguage });
    
    if (editor) {
      editor.commands.command(({ tr, state }) => {
        const { selection } = state;
        const { $from } = selection;
        const content = $from.parent.textContent;
        const pos = $from.start();
        
        if (!oldIsBash && newIsBash) {
          const trimmed = content.trim();
          if (!trimmed || (!trimmed.startsWith('$ ') && !trimmed.startsWith('$'))) {
            tr.insertText('$ ', pos);
          }
        } else if (oldIsBash && !newIsBash) {
          if (content.startsWith('$ ')) {
            tr.delete(pos, pos + 2);
          } else if (content.startsWith('$')) {
            tr.delete(pos, pos + 1);
          }
        }
        
        return true;
      });
    }
  };

  return (
    <NodeViewWrapper className="code-block-wrapper not-prose">
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 my-4">
        <div className="flex items-center justify-between px-4 py-3" contentEditable={false}>
          <div className="flex items-center gap-3">
            <p className="inline-flex items-center text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">
              {language}
            </p>
            <select
              value={language}
              onChange={handleLanguageChange}
              className="text-xs border border-gray-300 rounded px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="tsx">TSX</option>
              <option value="jsx">JSX</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="css">CSS</option>
              <option value="html">HTML</option>
              <option value="bash">Bash</option>
              <option value="sh">Shell</option>
              <option value="json">JSON</option>
              <option value="sql">SQL</option>
              <option value="php">PHP</option>
              <option value="go">Go</option>
              <option value="rust">Rust</option>
              <option value="cpp">C++</option>
              <option value="c">C</option>
              <option value="swift">Swift</option>
              <option value="kotlin">Kotlin</option>
            </select>
          </div>
          <button
            onClick={copyToClipboard}
            className="px-3 py-1.5 rounded-md border border-gray-300 bg-white text-gray-800 text-sm hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50"
            type="button"
            disabled={isEmpty}
          >
            {copied ? 'Copied ✓' : 'Copy'}
          </button>
        </div>
        <div className="px-4 pb-4">
          {isBash ? (
            <div className="h-full w-full bg-gray-900 text-green-400 font-mono rounded-lg flex flex-col border border-gray-800">
              <div className="flex items-center justify-between px-3 py-1.5 bg-gray-800 border-b border-gray-700 rounded-t-lg" contentEditable={false}>
                <div className="text-xs text-gray-300">Bash Terminal</div>
                <div className="flex space-x-1">
                  <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                  <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                </div>
              </div>
              <div className="px-3 py-2 overflow-x-auto terminal-scrollbar min-h-[100px] relative">
                <div className="text-sm leading-relaxed">
                  <NodeViewContent 
                    className="inline-block whitespace-pre font-mono text-green-400 min-w-full outline-none align-top"
                  />
                </div>
                {isEmpty && (
                  <div className="text-gray-500 text-sm italic pointer-events-none absolute top-2 left-[26px]" contentEditable={false}>
                    Enter your bash commands...
                  </div>
                )}
              </div>
              <style jsx>{`
                .terminal-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
                .terminal-scrollbar::-webkit-scrollbar-track { background: #2d3748; border-radius: 4px; }
                .terminal-scrollbar::-webkit-scrollbar-thumb { background: #4a5568; border-radius: 4px; border: 1px solid #2d3748; }
                .terminal-scrollbar::-webkit-scrollbar-thumb:hover { background: #718096; }
                .terminal-scrollbar::-webkit-scrollbar-thumb:active { background: #a0aec0; }
                .terminal-scrollbar::-webkit-scrollbar-corner { background: #2d3748; }
              `}</style>
            </div>
          ) : (
            <div className="relative">
              <pre className="overflow-auto rounded-md bg-gray-50 border border-gray-200 p-3 text-sm text-gray-900 leading-relaxed min-h-[100px] m-0">
                <NodeViewContent 
                  className="font-mono whitespace-pre block outline-none"
                />
              </pre>
              {isEmpty && (
                <div className="text-gray-400 text-sm italic pointer-events-none absolute top-3 left-3" contentEditable={false}>
                  Enter your {language} code...
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </NodeViewWrapper>
  );
}