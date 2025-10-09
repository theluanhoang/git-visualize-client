'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import FontFamily from '@tiptap/extension-font-family';
import { TextStyle } from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import React, { useMemo, useEffect, useState } from 'react';
import Menubar from './Menubar';
import { CustomHighlight } from './extensions/custom-highlight';
import { CustomFontSize } from './extensions/custom-fontsize';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import { CustomColor } from './extensions/custom-color';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import CharacterCount from '@tiptap/extension-character-count';
import { CustomLink } from './extensions/custom-link';
import { CustomCodeBlock } from './extensions/custom-codeblock';
import { Button } from '@/components/ui/button';
import { InlineCodeDecorations } from './extensions/inline-code-decorations';
import LessonViewer from '../git-theory/LessonViewer';

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
        CustomCodeBlock,
        InlineCodeDecorations,
    ], []);

    const editor = useEditor({
        extensions,
        content: '',
        editorProps: {
            attributes: {
                class: 'min-h-[156px] border rounded-md bg-slate-50 px-3 py-2 focus:outline-none',
            },
        },
        immediatelyRender: false,
        shouldRerenderOnTransaction: false,
    });

    const [savedJson, setSavedJson] = useState<any | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const openPreview = () => {
        if (!editor) return '';
        const htmlContent = editor.getHTML();
        const jsonContent = editor.getJSON();
        setSavedJson(jsonContent);
        setIsPreviewOpen(true);
        return htmlContent;
    };
    return (
        <div className="mx-auto rounded-lg shadow-sm border overflow-hidden bg-[var(--surface)] border-[var(--border)] text-[var(--foreground)]">
            <Menubar editor={editor} />
            <EditorContent editor={editor} className="tiptap p-4 focus:outline-none" />
            <Button
                onClick={openPreview}
                className="w-full py-2 rounded-b-lg transition-colors duration-200 bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-700)]"
            >
                Preview
            </Button>
            {/* Preview Modal */}
            {isPreviewOpen && (
                <div
                    className="fixed inset-0 z-50"
                    aria-modal="true"
                    role="dialog"
                >
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setIsPreviewOpen(false)}
                    />
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                        <div className="w-full max-w-4xl max-h-[80vh] rounded-xl shadow-xl border overflow-hidden bg-[var(--surface)] border-[var(--border)] text-[var(--foreground)] modal-surface">
                            <div className="flex items-center justify-between px-4 py-3 border-b bg-[color:var(--muted)] border-[var(--border)]">
                                <h3 className="text-sm font-semibold">Preview</h3>
                                <Button
                                    onClick={() => setIsPreviewOpen(false)}
                                    className="px-3 py-1.5 rounded-md bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-700)]"
                                >
                                    Close
                                </Button>
                            </div>
                            <div className="overflow-auto max-h-[calc(80vh-48px)]">
                                {savedJson ? (
                                    <LessonViewer content={savedJson} />
                                ) : (
                                    <div className="p-6 opacity-70">No content</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default RichTextEditor;