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
import { useRemoveChannel } from '@/features/channels/api/use-remove-channel';
import { useUpdateChannel } from '@/features/channels/api/use-update-channel';
import { useChannelId } from '@/features/channels/hooks/use-channelId';
import { useCurrentMember } from '@/features/members/api/use-current-member';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspaceId';
import useConfirm from '@/hooks/use-confirm';
import { TrashIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { toast } from 'sonner';

type Props = { title: string };

export default function ChannelHeader({ title }: Props) {
   const router = useRouter();
   const channelId = useChannelId();
   const workspaceId = useWorkspaceId();
   const [value, setValue] = useState(title);
   const [editOpen, setEditOpen] = useState(false);
   const [ConfirmDialog, confirm] = useConfirm(
      'Delete this channel',
      'You are about to delete this channel. This action is irreversible',
   );

   const { data: member } = useCurrentMember({ workspaceId });
   const { mutate: updateChannel, isPending: updatingChannel } =
      useUpdateChannel();
   const { mutate: removeChannel, isPending: RemoveingChannel } =
      useRemoveChannel();
   const isPending = updatingChannel || RemoveingChannel;

   function handleEditOpen() {
      if (member?.role !== 'admin') return;
   }

   function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      const value = e.target.value.replace(/\s+/g, '-').toLowerCase();

      setValue(value);
   }

   function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
      updateChannel(
         { name: value, id: channelId },
         {
            onSuccess: () => {
               toast.success('Channel updated');
               setEditOpen(false);
            },
            onError: () => {
               toast.error('Failed to update channel');
            },
         },
      );
   }

   async function handleDelete() {
      const ok = await confirm();
      if (!ok) return null;

      removeChannel(
         { id: channelId },
         {
            onSuccess: () => {
               toast.success('Channel deleted');
               setEditOpen(false);
               router.replace(`/workspace/${workspaceId}`);
            },
            onError: () => {
               toast.error('Failed to delete channel');
            },
         },
      );
   }

   return (
      <div className="flex h-[49px] items-center overflow-hidden border-b bg-white px-4">
         <ConfirmDialog />
         <Dialog>
            <DialogTrigger asChild>
               <Button
                  variant="ghost"
                  className="w-auto overflow-hidden px-2 text-lg font-semibold"
                  size="sm"
               >
                  <span className="truncate"># {title}</span>
                  <FaChevronDown className="ml-2 size-2.5" />
               </Button>
            </DialogTrigger>

            <DialogContent className="overflow-hidden bg-gray-50 p-0">
               <DialogHeader className="boder-b bg-white p-4">
                  <DialogTitle> # {title}</DialogTitle>
               </DialogHeader>

               <div className="flex flex-col gap-y-2 px-4 pb-4">
                  <Dialog open={editOpen} onOpenChange={handleEditOpen}>
                     <DialogTrigger asChild>
                        <div className="cursor-pointer rounded-lg bg-white px-5 py-4 hover:bg-gray-50">
                           <div className="flex items-center justify-between">
                              <p className="text-sm font-semibold">
                                 Channel name
                              </p>
                              {member?.role === 'admin' && (
                                 <p className="text-sm text-[#1264a3]">Edit</p>
                              )}
                           </div>
                           <p className="text-sm"># {title}</p>
                        </div>
                     </DialogTrigger>

                     <DialogContent>
                        <DialogHeader>
                           <DialogTitle>Rename this channel</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                           <Input
                              value={value}
                              disabled={isPending}
                              onChange={handleChange}
                              required
                              autoFocus
                              minLength={3}
                              maxLength={80}
                           />
                        </form>

                        <DialogFooter>
                           <DialogClose>
                              <Button variant="outline" disabled={isPending}>
                                 Cancel
                              </Button>
                           </DialogClose>
                           <Button disabled={isPending}>Save</Button>
                        </DialogFooter>
                     </DialogContent>
                  </Dialog>

                  {member?.role === 'admin' && (
                     <button
                        onClick={handleDelete}
                        disabled={isPending}
                        className="flex cursor-pointer items-center justify-center gap-x-2 rounded-lg bg-white px-5 py-4 text-rose-600 hover:bg-gray-50"
                     >
                        <TrashIcon className="size-4" />
                        <p className="text-sm font-semibold">Delete channel</p>
                     </button>
                  )}
               </div>
            </DialogContent>
         </Dialog>
      </div>
   );
}
