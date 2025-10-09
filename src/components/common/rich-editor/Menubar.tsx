import { Toggle } from '@/components/ui/toggle';
import { Bold, CodeXml, Italic, Strikethrough } from 'lucide-react';
import React, { memo } from 'react'
import FontSelection from './FontSelection';
import TextSelection from './TextSelection';
import FontSizeSelection from './FontSizeSelection';
import TextAlignSelection from './TextAlignSelection';
import { Editor } from '@tiptap/react'
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

    return (
        <div className="control-group">
            <div className="flex items-center gap-1">
                <FontSelection editor={editor} />
                <TextSelection editor={editor} />
                <FontSizeSelection editor={editor} />
                <TextAlignSelection editor={editor} />
                <div className="w-px h-6 bg-gray-300 mx-1" />
                <Toggle
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={editor.isActive('bold') ? 'is-active' : ''}
                >
                    <Bold />
                </Toggle>
                <Toggle
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={editor.isActive('italic') ? 'is-active' : ''}
                >
                    <Italic />
                </Toggle>
                <Toggle
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={editor.isActive('strike') ? 'is-active' : ''}
                >
                    <Strikethrough />
                </Toggle>
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
                    variant={"ghost"}
                    title="Code block"
                    onClick={() => editor.commands.toggleCodeBlock()}
                >
                    <CodeXml />
                </Button>
            </div>
        </div>
    )
})

Menubar.displayName = 'Menubar'

export default Menubar