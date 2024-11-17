import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';
import Link from 'next/link';
import { Id } from '../../../../convex/_generated/dataModel';
import { useWorkspaceId } from '../hooks/use-workspaceId';

const userItemVariants = cva(
   'flex item-center gap-1.5 justify-start font-normal h-7 px-4 text-sm overflow-hidden',
   {
      variants: {
         variant: {
            default: 'text-[#f9edffcc]',
            active: 'text-[#481349] bg-white/90 hover:bg-white/90',
         },
      },
      defaultVariants: {
         variant: 'default',
      },
   },
);

type Props = {
   id: Id<'members'>;
   label?: string;
   image?: string;
   variant?: VariantProps<typeof userItemVariants>['variant'];
};

export default function UserItem({ id, label, image, variant }: Props) {
   const workspaceId = useWorkspaceId();
   const avatarFallback = label?.charAt(0).toUpperCase();
   return (
      <Button
         variant="transparent"
         className={cn(userItemVariants({ variant: variant }))}
         size="sm"
         asChild
      >
         <Link href={`/workspace/${workspaceId}/member/${id}`}>
            <Avatar className="mr-1 size-5">
               <AvatarImage src={image}></AvatarImage>
               <AvatarFallback>{avatarFallback}</AvatarFallback>
            </Avatar>
            <span className="truncate text-sm">{label}</span>
         </Link>
      </Button>
   );
}
