import Loader from '@/components/loader';
import TriangleAlert from '@/components/triangle-alert';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useGetMember } from '@/features/members/api/use-get-member';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { MailIcon, XIcon } from 'lucide-react';
import Link from 'next/link';
import { Id } from '../../../../convex/_generated/dataModel';

type Props = {
   memberId: Id<'members'>;
   onClose: () => void;
};

export default function Profile({ memberId, onClose }: Props) {
   const { data: member, isLoading: isMemberLoading } = useGetMember({
      id: memberId,
   });
   const avatarFallback = member?.user.name?.charAt(0).toUpperCase();

   if (isMemberLoading)
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
   );
}
