'use client';

import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import FontFamily from '@tiptap/extension-font-family'
import { TextStyle } from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import React, { useMemo } from 'react'
import Menubar from './Menubar';
import { CustomHighlight } from './extensions/custom-highlight';
import { CustomFontSize } from './extensions/custom-fontsize';
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import { CustomColor } from './extensions/custom-color';
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import CharacterCount from '@tiptap/extension-character-count'
import { CustomLink } from './extensions/custom-link';
import { all, createLowlight } from 'lowlight'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import CodeExample from '../git-theory/CodeExample';
import ReactDOM from "react-dom";
import { CustomCodeBlock } from './extensions/custom-codeblock';

const lowlight = createLowlight(all);

function RichTextEditor() {
    const extensions = useMemo(() => [
        CharacterCount.configure({
            mode: 'textSize',
        }),
        StarterKit.configure({
            codeBlock: false,
            heading: {
                levels: [1, 2, 3, 4, 5, 6],
            },
            bulletList: {
                HTMLAttributes: {
                    class: 'list-disc',
                },
            },
            orderedList: {
                HTMLAttributes: {
                    class: 'list-decimal',
                },
            },
            listItem: {
                HTMLAttributes: {
                    class: 'ml-4',
                },
            },
        }),
        TextStyle,
        FontFamily.configure({
            types: ['textStyle'],
        }),
        TextAlign.configure({
            types: ['heading', 'paragraph'],
            alignments: ['left', 'center', 'right', 'justify'],
            defaultAlignment: 'left',
        }),
        Highlight,
        CustomHighlight,
        CustomFontSize.configure({
            types: ['textStyle'],
        }),
        Subscript,
        Superscript,
        CustomColor.configure({
            types: ['textStyle'],
        }),
        CustomLink,
        TaskList,
        TaskItem.configure({
            nested: true,
            HTMLAttributes: {
                class: 'task-item',
            },
        }),
        // CodeBlockLowlight.configure({
        //     lowlight,
        //     enableTabIndentation: true,
        // })
        CustomCodeBlock
    ], [])



    const editor = useEditor({
        extensions,
        content: '<p>Hello World! 🌎️</p>',
        editorProps: {
            attributes: {
                class: "min-h-[156px] border rounded-md bg-slate-50 px-3 py-2 focus:outline-none",
            }
        },
        immediatelyRender: false,
        shouldRerenderOnTransaction: false,
    })

        React.useEffect(() => {
  if (editor) {
    console.log('✅ Editor ready');
    console.log('📦 Extensions:', editor.extensionManager.extensions.map(e => e.name));
    console.log('🎯 Has codeBlock?', editor.extensionManager.extensions.some(e => e.name === 'codeBlock'));
  }
}, [editor]);

    return (
        <div className="border rounded-lg overflow-hidden">
            <Menubar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    )
}

export default RichTextEditor