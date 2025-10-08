import { Extension, getAttributes } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Editor } from '@tiptap/react';

export enum LinkMenuState {
  HIDDEN,
  ADD_LINK,
  EDIT_LINK,
}

export interface CustomLinkHandlerStorage {
  state: LinkMenuState;
  currentLink: { text: string; url: string; from: number; to: number } | null;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    customLinkHandler: {
      openLinkMenu: (state: LinkMenuState, options?: { url?: string; text?: string }) => ReturnType;
      editLink: (text: string, url: string) => ReturnType;
      removeLink: () => ReturnType;
      closeLinkMenu: () => ReturnType;
    };
  }

  interface Storage {
    customLinkHandler: CustomLinkHandlerStorage;
  }
}

const CustomLinkHandler = Extension.create<undefined, CustomLinkHandlerStorage>({
  name: 'customLinkHandler',

  addStorage() {
    return {
      state: LinkMenuState.HIDDEN,
      currentLink: null,
    };
  },

  addCommands() {
    return {
      openLinkMenu:
        (state: LinkMenuState, options = {}) =>
        ({ editor, chain, dispatch }) => {
          if (!editor || !dispatch) return false;

          if (state === LinkMenuState.ADD_LINK) {
            chain().extendMarkRange('link').focus().run();
            this.storage.state = LinkMenuState.ADD_LINK;
          } else if (state === LinkMenuState.EDIT_LINK && editor.isActive('link')) {
            const { from, to } = editor.state.selection;
            const attrs = getAttributes(editor.state, 'link');
            const text = editor.state.doc.textBetween(from, to, ' ');
            this.storage.currentLink = { text, url: attrs.href || '', from, to };
            this.storage.state = LinkMenuState.EDIT_LINK;
          } else {
            this.storage.state = LinkMenuState.HIDDEN;
          }

          if (options.url && options.text) {
            this.storage.currentLink = { text: options.text, url: options.url, from: -1, to: -1 };
          }

          return true;
        },

      editLink:
        (text: string, url: string) =>
        ({ editor, chain, dispatch }) => {
          if (!editor || !dispatch || !this.storage.currentLink) return false;

          chain()
            .focus()
            .setTextSelection({ from: this.storage.currentLink.from, to: this.storage.currentLink.to })
            .deleteRange({ from: this.storage.currentLink.from, to: this.storage.currentLink.to })
            .insertContent({
              type: 'text',
              text: text.trim(),
              marks: [{ type: 'link', attrs: { href: url.trim(), target: '_self' } }],
            })
            .run();

          this.storage.state = LinkMenuState.HIDDEN;
          this.storage.currentLink = null;
          return true;
        },

      removeLink:
        () =>
        ({ editor, chain, dispatch }) => {
          if (!editor || !dispatch || !this.storage.currentLink) return false;

          chain()
            .focus()
            .setTextSelection({ from: this.storage.currentLink.from, to: this.storage.currentLink.to })
            .unsetLink()
            .run();

          this.storage.state = LinkMenuState.HIDDEN;
          this.storage.currentLink = null;
          return true;
        },

      closeLinkMenu:
        () =>
        ({ editor, chain, dispatch }) => {
          if (!editor || !dispatch) return false;

          chain().focus().run();
          this.storage.state = LinkMenuState.HIDDEN;
          this.storage.currentLink = null;
          return true;
        },
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('customLinkHandlerClick'),
        props: {
          handleClick: (view, pos, event) => {
            const attrs = getAttributes(view.state, 'link');
            const link = (event.target as HTMLElement).closest('a');
            if (link && attrs.href && this.storage.state === LinkMenuState.HIDDEN) {
              event.preventDefault();
              event.stopPropagation();
              this.editor.commands.openLinkMenu(LinkMenuState.EDIT_LINK);
              return true;
            }
            return false;
          },
        },
      }),
    ];
  },

  onSelectionUpdate({ editor }) {
    if (this.storage.state !== LinkMenuState.HIDDEN && !editor.isActive('link')) {
      this.editor.commands.closeLinkMenu();
    }
  },
});

export default CustomLinkHandler;