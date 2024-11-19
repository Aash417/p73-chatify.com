import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { ChevronRightIcon } from 'lucide-react';

type Props = {
   count?: number;
   image?: string;
   name?: string;
   timestamp?: number;
   onClick?: () => void;
};

export default function ThreadBar({
   name = 'Member',
   count,
   image,
   timestamp,
   onClick,
}: Props) {
   const avatarFallback = name?.charAt(0).toUpperCase();

   if (!count || !timestamp) return null;

   return (
      <button
         onClick={onClick}
         className="group/thread-bar flex max-w-[600px] items-center justify-start rounded-md border border-transparent p-1 transition hover:border-border hover:bg-white"
      >
         <div className="flex items-center gap-2 overflow-hidden">
            <Avatar className="size-6 shrink-0">
               <AvatarImage src={image}></AvatarImage>
               <AvatarFallback>{avatarFallback}</AvatarFallback>
            </Avatar>

            <span className="truncate text-xs font-bold text-sky-700 hover:underline">
               {count} {count > 1 ? 'replies' : 'reply'}
            </span>

            <span className="block truncate text-xs text-muted-foreground group-hover/thread-bar:hidden">
               Last reply {formatDistanceToNow(timestamp, { addSuffix: true })}
            </span>

            <span className="hidden truncate text-xs text-muted-foreground group-hover/thread-bar:block">
               View thread
            </span>
         </div>

         <ChevronRightIcon className="ml-auto size-4 shrink-0 text-muted-foreground opacity-0 transition group-hover/thread-bar:opacity-100" />
      </button>
   );
}