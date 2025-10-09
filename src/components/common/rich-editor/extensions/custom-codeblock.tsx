'use client';

import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import CodeBlock from '../CodeBlock';

export const CustomCodeBlock = Node.create({
  name: 'codeBlock',
  
  group: 'block',
  
  content: 'text*',  // IMPORTANT: Cho phép chứa text
  
  marks: '', // Không cho phép marks trong code block
  
  code: true,
  
  defining: true,

  addAttributes() {
    return {
      language: {
        default: 'bash',
        parseHTML: (element) => {
          return element.getAttribute('data-language') || 
                 element.getAttribute('class')?.replace('language-', '') || 
                 'bash';
        },
        renderHTML: (attributes) => ({
          'data-language': attributes.language,
          class: `language-${attributes.language}`,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'pre',
        preserveWhitespace: 'full',
        getAttrs: (node) => {
          if (typeof node === 'string') return null;
          const codeElement = node.querySelector('code');
          const language = codeElement?.getAttribute('class')?.replace('language-', '') || 'bash';
          return { language };
        },
      },
      {
        tag: 'code',
        preserveWhitespace: 'full',
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'pre',
      mergeAttributes(HTMLAttributes, {
        'data-language': node.attrs.language,
      }),
      [
        'code',
        {
          class: `language-${node.attrs.language}`,
        },
        0,
      ],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CodeBlock, {
      contentDOMElementTag: 'code',
    });
  },

  addCommands() {
    return {
      setCodeBlock:
        (attributes?: { language?: string }) =>
        ({ commands }) => {
          return commands.setNode(this.name, { language: attributes?.language || 'bash' });
        },
      toggleCodeBlock:
        (attributes?: { language?: string }) =>
        ({ commands }) => {
          return commands.toggleNode(this.name, 'paragraph', { language: attributes?.language || 'bash' });
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Alt-c': () => {
        return this.editor.commands.toggleCodeBlock();
      },
      Backspace: () => {
        const { empty, $anchor } = this.editor.state.selection;
        const isAtStart = $anchor.pos === $anchor.start();

        if (!empty || $anchor.parent.type.name !== this.name) {
          return false;
        }

        if (isAtStart && !$anchor.parent.textContent.length) {
          return this.editor.commands.clearNodes();
        }

        return false;
      },

      'Mod-Enter': () => {
        const { state } = this.editor;
        const { selection } = state;
        const { $from, empty } = selection;

        if (!empty || $from.parent.type !== this.type) {
          return false;
        }

        const after = $from.after();

        return this.editor
          .chain()
          .command(({ tr }) => {
            const paragraph = state.schema.nodes.paragraph.create();
            tr.insert(after, paragraph);
            return true;
          })
          .focus(after + 1)
          .run();
      },

      Tab: () => {
        const { state } = this.editor;
        const { selection } = state;
        const { $from } = selection;

        if ($from.parent.type !== this.type) {
          return false;
        }

        return this.editor.commands.insertContent('  ');
      },
    };
  },
});