import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

interface ClearChatModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export default function ClearChatModal({
  open,
  onOpenChange,
  onConfirm,
}: ClearChatModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent data-ocid="clear_chat.dialog" className="max-w-sm">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-destructive/10">
              <Trash2 className="w-5 h-5 text-destructive" aria-hidden="true" />
            </div>
            <AlertDialogTitle className="font-display text-lg">
              Clear conversation?
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="font-body text-sm leading-relaxed">
            This will permanently delete your entire chat history with Medi Bot.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-2">
          <AlertDialogCancel
            data-ocid="clear_chat.cancel_button"
            className="font-body"
          >
            Keep chat
          </AlertDialogCancel>
          <AlertDialogAction
            data-ocid="clear_chat.confirm_button"
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-body"
          >
            Yes, clear all
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
