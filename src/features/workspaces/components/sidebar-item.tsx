import { Button } from '@/components/ui/button';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspaceId';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { IconType } from 'react-icons/lib';

const sidebarItemVariants = cva(
   'flex item-center gap-1.5 justify-start font-normal h-7 px-[18px] text-sm overflow-hidden',
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
   id: string;
   label: string;
   icon: LucideIcon | IconType;
   variant?: VariantProps<typeof sidebarItemVariants>['variant'];
};

export default function SidebarItem({
   id,
   label,
   icon: Icon,
   variant,
}: Readonly<Props>) {
   const workspaceId = useWorkspaceId();

   return (
      <Button
         asChild
         variant="transparent"
         size="sm"
         className={cn(sidebarItemVariants({ variant }))}
      >
         <Link href={`/workspace/${workspaceId}/channel/${id}`}>
            <Icon className="mr-1 size-3.5 shrink-0" />
            <span className="truncate text-sm">{label}</span>
         </Link>
      </Button>
   );
}
