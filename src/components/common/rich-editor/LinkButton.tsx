import React, { useState } from "react";
import { Editor, useEditorState } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { AddLinkPopup } from "./AddLinkPopup";
import { Link2 } from "lucide-react";

interface LinkButtonProps {
  editor: Editor | null;
}

export default function LinkButton({ editor }: LinkButtonProps) {
  if (!editor) return null;

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const editorState = useEditorState({
    editor,
    selector: (ctx) => ({
      isLink: ctx.editor.isActive("link"),
    }),
  });

  return (
    <AddLinkPopup
      editor={editor}
      isOpen={isPopupOpen}
      onClose={() => setIsPopupOpen(false)}
    >
      <Button
        variant="ghost" // Sử dụng variant "ghost" để loại bỏ background mặc định
        size="icon" // Đảm bảo button chỉ chứa icon
        onClick={() => {
          console.log("Button clicked, setting isPopupOpen to true");
          setIsPopupOpen(true);
        }}
        className={editorState.isLink ? "is-active text-blue-500" : "text-gray-500"}
      >
        <Link2 className="h-4 w-4" /> {/* Kích thước cố định cho icon */}
      </Button>
    </AddLinkPopup>
  );
}