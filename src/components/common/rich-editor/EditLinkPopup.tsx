import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ReactNode, useEffect, useState } from "react";

interface EditLinkPopupProps {
  editor: any;
  isOpen: boolean;
  onClose: () => void;
  initialText: string;
  initialUrl: string;
  from: number;
  to: number;
  onApply?: (displayText: string, url: string) => void;
  children: ReactNode;
}

export function EditLinkPopup({ editor, isOpen, onClose, initialText, initialUrl, from, to, onApply, children }: EditLinkPopupProps) {
  const [displayText, setDisplayText] = useState(initialText);
  const [url, setUrl] = useState(initialUrl);

  useEffect(() => {
    if (isOpen) {
      setDisplayText(initialText);
      setUrl(initialUrl);
    }
  }, [isOpen, initialText, initialUrl]);

  const handleEdit = () => {
    if (displayText.trim() && url.trim()) {
      if (editor) {
        if (onApply) {
          onApply(displayText.trim(), url.trim());
        } else {
          editor.commands.editLink(displayText.trim(), url.trim());
        }
      }
      onClose();
    }
  };

  const handleRemove = () => {
    if (editor) {
      editor.commands.removeLink();
      onClose();
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={(open) => {
      console.log("EditLinkPopup state changed to:", open);
      if (!open) onClose();
    }}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className="w-[300px] p-4"
        style={{ display: isOpen ? "block" : "none", zIndex: 1000 }}
        align="start"
        side="bottom"
        sideOffset={5}
      >
        <div className="space-y-4">
          <h4 className="font-medium leading-none">Edit Link</h4>
          <div className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="display-text">Display Text *</Label>
              <Input
                id="display-text"
                value={displayText}
                onChange={(e) => setDisplayText(e.target.value)}
                placeholder="Edit display text"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="url">URL *</Label>
              <Input
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleEdit} disabled={!displayText.trim() || !url.trim()}>
              Edit
            </Button>
            <Button variant="destructive" onClick={handleRemove}>
              Remove
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}