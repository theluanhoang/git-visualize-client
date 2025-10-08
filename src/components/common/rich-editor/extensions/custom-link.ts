import Link from '@tiptap/extension-link';

export const CustomLink = Link.extend({
  addProseMirrorPlugins() {
    return [
      ...(this.parent?.() || []),
    ];
  },
  
  addAttributes() {
    return {
      ...this.parent?.(),
      href: {
        default: null,
      },
      target: {
        default: null,
      },
    };
  },
}).configure({
  openOnClick: false,
  HTMLAttributes: {
    class: 'text-blue-600 underline cursor-pointer',
  },
});