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
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export default function CreateChannelModal() {
   const router = useRouter();
   const workspaceId = useWorkspaceId();
   const [open, setOpen] = useCreateChannelModal();
   const [name, setName] = useState('');
   const { mutate, isPending } = useCreateChannel();

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
            onSuccess: (id) => {
               toast.success('Channel created');
               handleClose();
               router.push(`/workspace/${workspaceId}/channel/${id}`);
            },
            onError: (id) => {
               toast.error('Failed to create a channel');
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
