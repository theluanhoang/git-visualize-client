'use client';

import { Toggle } from '@/components/ui/toggle';
import { Bold, CodeXml, Italic, Strikethrough } from 'lucide-react';
import React, { memo } from 'react';
import FontSelection from './FontSelection';
import TextSelection from './TextSelection';
import FontSizeSelection from './FontSizeSelection';
import TextAlignSelection from './TextAlignSelection';
import { Editor, useEditorState } from '@tiptap/react';
import HighlightColorPicker from './HighlightColorPicker';
import ListButtons from './ListButtons';
import SubSupButtons from './SubSupButtons';
import TextColorPicker from './TextColorPicker';
import LinkButton from './LinkButton';
import { Button } from '@/components/ui/button';

const Menubar = memo(({ editor }: { editor: Editor | null }) => {
    if (!editor) {
        return null;
    }

    const editorState = useEditorState({
        editor,
        selector: (ctx) => {
            if (!ctx.editor) return { isLink: false };
            return {
                isLink: ctx.editor.isActive("link"),
                isBold: ctx.editor.isActive("bold"),
                isItalic: ctx.editor.isActive("italic"),
                isStrike: ctx.editor.isActive("strike"),
            };
        },
    });

    return (
        <div className="flex items-center justify-center border-b border-gray-100 p-2 bg-gray-50">
            <div className="flex items-center gap-1">
                <FontSelection editor={editor} />
                <TextSelection editor={editor} />
                <FontSizeSelection editor={editor} />
                <TextAlignSelection editor={editor} />
                <div className="w-px h-6 bg-gray-300 mx-1" />
                <Button
                    variant="ghost"
                    title="Bold"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`is-active ${editorState?.isBold ? 'bg-black text-white' : ''}`}
                >
                    <Bold />
                </Button>
                <Button
                    variant="ghost"
                    title="Italic"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`is-active ${editorState?.isItalic ? 'bg-black text-white' : ''}`}
                >
                    <Italic />
                </Button>
                <Button
                    variant="ghost"
                    title="Strike"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={`is-active ${editorState?.isStrike ? 'bg-black text-white' : ''}`}
                >
                    <Strikethrough />
                </Button>
                <div className="w-px h-6 bg-gray-300 mx-1" />
                <ListButtons editor={editor} />
                <div className="w-px h-6 bg-gray-300 mx-1" />
                <SubSupButtons editor={editor} />
                <div className="w-px h-6 bg-gray-300 mx-1" />
                <LinkButton editor={editor} />
                <div className="w-px h-6 bg-gray-300 mx-1" />
                <TextColorPicker editor={editor} />
                <HighlightColorPicker editor={editor} />
                <Button
                    variant="ghost"
                    title="Code block"
                    onClick={() => editor.commands.toggleCodeBlock()}
                    className="is-active"
                >
                    <CodeXml />
                </Button>
            </div>
            {/* CSS tùy chỉnh đơn giản */}
            <style jsx>{`
                .is-active {
                    background-color: #000000;
                    color: #ffffff;
                }
                .is-active svg {
                    color: #ffffff; 
                }
            `}</style>
        </div>
    );
});

Menubar.displayName = 'Menubar';

export default Menubar;