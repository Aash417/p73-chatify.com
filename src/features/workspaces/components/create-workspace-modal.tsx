'use client';

import { Button } from '@/components/ui/button';
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useCreateWorkspace } from '@/features/workspaces/api/use-create-workspace';
import { useCreateWorkspaceModal } from '@/features/workspaces/store/use-create-workspace-modal';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';

export default function CreateWorkspaceModal() {
   const router = useRouter();
   const [open, setOpen] = useCreateWorkspaceModal();
   const [name, setName] = useState('');
   const { mutate, isPending } = useCreateWorkspace();

   async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();

      mutate(
         { name },
         {
            onSuccess: (id) => {
               toast.success('Workspace created');
               router.push(`/workspace/${id}`);
               handleClose();
            },
         },
      );
   }

   function handleClose() {
      setOpen(false);
   }

   return (
      <Dialog open={open} onOpenChange={handleClose}>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Add workspace</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
               <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isPending}
                  required
                  autoFocus
                  minLength={3}
                  placeholder="Workspace name"
               />
               <div className="flex justify-end">
                  <Button disabled={isPending}>Create</Button>
               </div>
            </form>
         </DialogContent>
      </Dialog>
   );
}
