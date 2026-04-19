"use client";

import { useState, type ReactNode } from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertRuleForm } from "./AlertRuleForm";
import type { AlertRuleDraft } from "@/lib/mock-alerts";

interface CreateAlertDialogProps {
  onCreate: (draft: AlertRuleDraft) => void;
  /** Custom trigger; defaults to a "+ Create Alert" button. */
  trigger?: ReactNode;
}

export function CreateAlertDialog({ onCreate, trigger }: CreateAlertDialogProps) {
  const [open, setOpen] = useState(false);

  const handleCreate = (draft: AlertRuleDraft) => {
    onCreate(draft);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
            <Plus className="size-4" />
            Create Alert
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Alert</DialogTitle>
          <DialogDescription className="text-slate-400">
            Define the symbol, signal type, and delivery channels. Rules trigger as the scanner detects matches.
          </DialogDescription>
        </DialogHeader>
        <AlertRuleForm
          idPrefix="dialog"
          onSubmit={handleCreate}
          secondaryAction={
            <DialogClose asChild>
              <Button type="button" variant="outline" className="border-slate-700">
                Cancel
              </Button>
            </DialogClose>
          }
        />
      </DialogContent>
    </Dialog>
  );
}
