import Loader from '@/components/loader';
import TriangleAlert from '@/components/triangle-alert';
import { Button } from '@/components/ui/button';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuRadioGroup,
   DropdownMenuRadioItem,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { useCurrentMember } from '@/features/members/api/use-current-member';
import { useGetMember } from '@/features/members/api/use-get-member';
import { useRemoveMember } from '@/features/members/api/use-remove-member';
import { useUpdateMember } from '@/features/members/api/use-update-member';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspaceId';
import useConfirm from '@/hooks/use-confirm';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { ChevronDownIcon, MailIcon, XIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Id } from '../../../../convex/_generated/dataModel';

type Props = {
   memberId: Id<'members'>;
   onClose: () => void;
};

export default function Profile({ memberId, onClose }: Props) {
   const workspaceId = useWorkspaceId();
   const router = useRouter();

   const [LeaveDialog, confirmLeave] = useConfirm(
      'Leave workspace',
      'Are you sure you want to leave workspace ?',
   );
   const [RemoveDialog, confirmRemove] = useConfirm(
      'Remove member',
      'Are you sure you want to remove this member ?',
   );
   const [UpdateDialog, confirmUpdate] = useConfirm(
      'Change role',
      'Are you sure you want to change this member role ?',
   );

   const { data: member, isLoading: isMemberLoading } = useGetMember({
      id: memberId,
   });
   const { data: currentMember, isLoading: isCurrentMemberLoading } =
      useCurrentMember({ workspaceId });
   const isLoading = isMemberLoading || isCurrentMemberLoading;

   const { mutate: updateMember, isPending: isUpdatingMember } =
      useUpdateMember();
   const { mutate: removeMember, isPending: isRemovingMember } =
      useRemoveMember();
   const isPending = isUpdatingMember || isRemovingMember;

   const avatarFallback = member?.user.name?.charAt(0).toUpperCase();

   async function onRemove() {
      const ok = await confirmRemove();
      if (!ok) return;

      removeMember(
         { id: memberId },
         {
            onSuccess: () => {
               toast.success('Member removed');
               onClose();
            },
            onError: () => {
               toast.error('Failed to remove member');
            },
         },
      );
   }

   async function onLeave() {
      const ok = await confirmLeave();
      if (!ok) return;

      removeMember(
         { id: memberId },
         {
            onSuccess: () => {
               toast.success('You left the workspace');
               onClose();
               router.replace('/');
            },
            onError: () => {
               toast.error('Failed to leave the workspace');
            },
         },
      );
   }

   async function onUpdate(role: 'admin' | 'member') {
      const ok = await confirmUpdate();
      if (!ok) return;

      updateMember(
         { id: memberId, role },
         {
            onSuccess: () => {
               toast.success('Role changed');
            },
            onError: () => {
               toast.error('Failed to change role');
            },
         },
      );
   }

   if (isLoading)
      return (
         <div className="flex h-full flex-col">
            <div className="flex h-[49px] items-center justify-between border-b px-4">
               <p className="text-lg font-bold">Profile</p>
               <Button onClick={onClose} size="iconSm" variant="ghost">
                  <XIcon className="size-5 stroke-[1.5]" />
               </Button>
            </div>

            <Loader />
         </div>
      );

   if (!member)
      return (
         <div className="flex h-full flex-col">
            <div className="flex h-[49px] items-center justify-between border-b px-4">
               <p className="text-lg font-bold">Profile</p>
               <Button onClick={onClose} size="iconSm" variant="ghost">
                  <XIcon className="size-5 stroke-[1.5]" />
               </Button>
            </div>

            <TriangleAlert
               message="Profile not found"
               color="text-muted-foreground"
            />
         </div>
      );

   return (
      <>
         <UpdateDialog />
         <RemoveDialog />
         <LeaveDialog />

         <div className="flex h-full flex-col">
            <div className="flex h-[49px] items-center justify-between border-b px-4">
               <p className="text-lg font-bold">Profile</p>
               <Button onClick={onClose} size="iconSm" variant="ghost">
                  <XIcon className="size-5 stroke-[1.5]" />
               </Button>
            </div>

            <div className="flex flex-col items-center justify-center p-4">
               <Avatar className="size-full max-h-[256px] max-w-[256px]">
                  <AvatarImage
                     className="m-auto rounded-md"
                     src={member.user.image}
                  ></AvatarImage>
                  <AvatarFallback className="aspect-square text-6xl">
                     {avatarFallback}
                  </AvatarFallback>
               </Avatar>
            </div>

            <div className="flex flex-col p-4">
               <p className="text-xl font-bold">{member.user.name}</p>
               {currentMember?.role === 'admin' &&
               currentMember?._id !== memberId ? (
                  <div className="flex gap-2">
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                           <Button
                              disabled={isPending}
                              variant="outline"
                              className="w-full capitalize"
                           >
                              {member.role}
                              <ChevronDownIcon className="ml-2 size-4" />
                           </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="w-full">
                           <DropdownMenuRadioGroup
                              value={member.role}
                              onValueChange={(role) =>
                                 onUpdate(role as 'admin' | 'member')
                              }
                           >
                              <DropdownMenuRadioItem value="admin">
                                 Admin
                              </DropdownMenuRadioItem>
                              <DropdownMenuRadioItem value="member">
                                 Member
                              </DropdownMenuRadioItem>
                           </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                     </DropdownMenu>

                     <Button
                        onClick={onRemove}
                        disabled={isPending}
                        variant="outline"
                        className="w-full capitalize"
                     >
                        Remove
                     </Button>
                  </div>
               ) : currentMember?._id === memberId &&
                 currentMember.role !== 'admin' ? (
                  <div className="mt-4">
                     <Button
                        onClick={onLeave}
                        disabled={isPending}
                        variant="outline"
                        className="w-full"
                     >
                        Leave
                     </Button>
                  </div>
               ) : null}
            </div>

            <Separator />

            <div className="flex flex-col p-4">
               <p className="mb-4 text-sm font-bold">Contact information </p>
               <div className="flex items-center gap-2">
                  <div className="flex size-9 items-center justify-center rounded-md bg-muted">
                     <MailIcon className="size-4" />
                  </div>

                  <div className="flex flex-col">
                     <p className="text-[13px] font-semibold text-muted-foreground">
                        Email address
                     </p>
                     <Link
                        href={`mailto:${member.user.email}`}
                        className="text-sm text-[#1264a3] hover:underline"
                     >
                        {member.user.email}
                     </Link>
                  </div>
               </div>
            </div>
         </div>
      </>
   );
}
