'use client';

import { Button } from '@/components/ui/button';
import {
   Dialog,
   DialogClose,
   DialogContent,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useRemoveWorkspace } from '@/features/workspaces/api/use-remove-workspace';
import { useUpdateWorkspace } from '@/features/workspaces/api/use-update-workspace';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspaceId';
import useConfirm from '@/hooks/use-confirm';
import { Trash } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

type Props = {
   open: boolean;
   setOpen: (open: boolean) => void;
   initialValue: string;
};

export default function PreferencesModal({
   open,
   setOpen,
   initialValue,
}: Props) {
   const workspaceId = useWorkspaceId();
   const [ConfirmDialog, confirm] = useConfirm(
      'Are you sure',
      'This action is irresevable',
   );

   const [value, setValue] = useState(initialValue);
   const [editOpen, setEditOpen] = useState(false);

   const { mutate: updateWorkspace, isPending: isUpdatingWorkspace } =
      useUpdateWorkspace();
   const { mutate: removeWorkspace, isPending: isRemoveingWorkspace } =
      useRemoveWorkspace();

   function handleEdit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();

      updateWorkspace(
         {
            id: workspaceId,
            name: value,
         },
         {
            onSuccess: () => {
               toast.success('Workspace updated');
               setEditOpen(false);
            },
            onError: () => {
               toast.error('Failed to update workspace');
            },
         },
      );
   }

   async function handleRemove() {
      const ok = await confirm();
      if (!ok) return null;

      removeWorkspace(
         {
            id: workspaceId,
         },
         {
            onSuccess: () => {
               toast.success('Workspace removed');
               window.location.replace('/');
            },
            onError: () => {
               toast.error('Failed to remove workspace');
            },
         },
      );
   }

   return (
      <>
         <ConfirmDialog />

         <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="overflow-hidden bg-gray-50 p-0">
               <DialogHeader className="border-b bg-white p-4">
                  <DialogTitle>{value}</DialogTitle>
               </DialogHeader>

               <div className="flex flex-col gap-y-2 px-4 pb-4">
                  <Dialog open={editOpen} onOpenChange={setEditOpen}>
                     <DialogTrigger asChild>
                        <div className="cursor-pointer rounded-lg border bg-white px-5 py-4 hover:bg-gray-50">
                           <div className="flex items-center justify-between">
                              <p className="text-sm font-semibold">
                                 Rename this Workspace
                              </p>
                              <p className="text-sm font-semibold text-[#1264a3] hover:underline">
                                 Edit
                              </p>
                           </div>
                           <p className="text-sm">{value}</p>
                        </div>
                     </DialogTrigger>

                     <DialogContent>
                        <DialogHeader>
                           <DialogTitle>Rename this Workspace</DialogTitle>
                           <form className="space-y-4" onSubmit={handleEdit}>
                              <Input
                                 value={value}
                                 onChange={(e) => setValue(e.target.value)}
                                 disabled={isUpdatingWorkspace}
                                 required
                                 autoFocus
                                 minLength={3}
                                 maxLength={80}
                                 placeholder="Workspace name"
                              />
                              <DialogFooter>
                                 <DialogClose>
                                    <Button
                                       variant="outline"
                                       disabled={isUpdatingWorkspace}
                                    >
                                       Cancel
                                    </Button>
                                 </DialogClose>
                                 <Button disabled={isUpdatingWorkspace}>
                                    Save
                                 </Button>
                              </DialogFooter>
                           </form>
                        </DialogHeader>
                     </DialogContent>
                  </Dialog>

                  <button
                     disabled={isRemoveingWorkspace}
                     onClick={handleRemove}
                     className="flex cursor-pointer items-center gap-x-2 rounded-lg border bg-white px-5 py-4 text-rose-600 hover:bg-gray-50"
                  >
                     <Trash className="size-4" />
                     <p className="text-sm font-semibold">Delete Workspace</p>
                  </button>
               </div>
            </DialogContent>
         </Dialog>
      </>
   );
}
