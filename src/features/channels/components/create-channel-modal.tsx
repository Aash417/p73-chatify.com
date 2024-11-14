import { Button } from '@/components/ui/button';
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useCreateChannel } from '@/features/channels/api/use-create-channel';
import { useCreateChannelModal } from '@/features/channels/store/use-create-channel-modal';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspaceId';
import { useState } from 'react';

export default function CreateChannelModal() {
   const [open, setOpen] = useCreateChannelModal();
   const [name, setName] = useState('');
   const { mutate, isPending } = useCreateChannel();
   const workspaceId = useWorkspaceId();

   function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      const value = e.target.value.replace(/\s+/g, '-').toLowerCase();

      setName(value);
   }
   function handleClose() {
      setName('');
      setOpen(false);
   }
   function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
      mutate(
         { name, workspaceId },
         {
            onSuccess: () => {
               handleClose();
            },
         },
      );
   }

   return (
      <Dialog open={open} onOpenChange={handleClose}>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Add a channel</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
               <Input
                  value={name}
                  disabled={isPending}
                  onChange={handleChange}
                  required
                  autoFocus
                  minLength={3}
                  maxLength={80}
                  placeholder="e.g. plan-budget"
               />

               <div className="flex justify-end">
                  <Button disabled={isPending}>Create</Button>
               </div>
            </form>
         </DialogContent>
      </Dialog>
   );
}
