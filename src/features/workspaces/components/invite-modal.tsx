import { Button } from '@/components/ui/button';
import {
   Dialog,
   DialogClose,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
} from '@/components/ui/dialog';
import { useNewJoinCode } from '@/features/workspaces/api/use-new-join-codes';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspaceId';
import useConfirm from '@/hooks/use-confirm';
import { CopyIcon, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';

type Props = {
   open: boolean;
   setOpen: (open: boolean) => void;
   name: string;
   joinCode: string;
};

export default function InviteModal({
   open,
   setOpen,
   name,
   joinCode,
}: Readonly<Props>) {
   const workspaceId = useWorkspaceId();
   const { mutate, isPending } = useNewJoinCode();
   const [ConfirmDialog, confirm] = useConfirm(
      'Are you sure',
      'This will deactivate the current invite code and generate a new one',
   );

   function handleCopy() {
      const inviteLink = `${window.location.origin}/join/${workspaceId}`;

      navigator.clipboard
         .writeText(inviteLink)
         .then(() => toast.success('Invite link copied to clipboard'));
   }

   async function handleNewCode() {
      const ok = await confirm();
      if (!ok) return null;

      mutate(
         {
            workspaceId,
         },
         {
            onSuccess: () => {
               toast.success('Invite code regenerated');
            },
            onError: () => {
               toast.error('Failed to regenerated invite code');
            },
         },
      );
   }

   return (
      <>
         <ConfirmDialog />
         <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
               <DialogHeader>
                  <DialogTitle>Invite people to {name}</DialogTitle>
                  <DialogDescription>
                     Use the code below to invite people to your workspace
                  </DialogDescription>
               </DialogHeader>

               <div className="flex flex-col items-center justify-center gap-y-4 py-10">
                  <p className="text-4xl font-bold uppercase tracking-widest">
                     {joinCode}
                  </p>
                  <Button
                     variant="ghost"
                     size="sm"
                     onClick={handleCopy}
                     disabled={isPending}
                  >
                     Copy link <CopyIcon className="ml-2 size-4" />
                  </Button>
               </div>

               <div className="flex w-full items-center justify-between">
                  <Button
                     variant="outline"
                     onClick={handleNewCode}
                     disabled={isPending}
                  >
                     New code
                     <RefreshCcw className="ml-2 size-4" />
                  </Button>

                  <DialogClose asChild>
                     <Button>Close</Button>
                  </DialogClose>
               </div>
            </DialogContent>
         </Dialog>
      </>
   );
}
