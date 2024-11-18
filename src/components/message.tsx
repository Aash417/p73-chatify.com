import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { format, isToday, isYesterday } from 'date-fns';
import { Doc, Id } from '../../convex/_generated/dataModel';
import Hint from './hint';
import Renderer from './renderer';
import Thumbnail from './thumbnail';
import { Avatar } from './ui/avatar';
import Toolbar from './toolbar';

type Props = {
   id: Id<'messages'>;
   memberId: Id<'members'>;
   authorImage?: string;
   authorName?: string;
   isAuthor: boolean;
   reactions: Array<
      Omit<Doc<'reactions'>, 'memberId'> & {
         count: number;
         memberIds: Id<'members'>[];
      }
   >;
   body: Doc<'messages'>['body'];
   image: string | null | undefined;
   createdAt: Doc<'messages'>['_creationTime'];
   updatedAt: Doc<'messages'>['updatedAt'];
   isEditing: boolean;
   isCompact?: boolean;
   setEdittingId: (id: Id<'messages'> | null) => void;
   hideThreadButton?: boolean;
   threadCount?: number;
   threadImage?: string;
   threadTimestamp?: number;
};

function formatFullTime(date: Date) {
   return `${
      isToday(date)
         ? 'Today'
         : isYesterday(date)
           ? 'Yesterday'
           : format(date, 'MMM d, yyy')
   } at ${format(date, 'h:mm:ss')}`;
}

export default function Message({
   id,
   memberId,
   authorImage,
   authorName = 'Member',
   isAuthor,
   reactions,
   body,
   image,
   updatedAt,
   createdAt,
   isEditing,
   isCompact,
   setEdittingId,
   hideThreadButton,
   threadCount,
   threadImage,
   threadTimestamp,
}: Props) {
   const avatarFallback = authorName.charAt(0).toUpperCase();

   if (isCompact) {
      return (
         <div className="group relative flex flex-col gap-2 p-1.5 hover:bg-gray-100/60">
            <div className="flex items-start gap-2">
               <Hint label={formatFullTime(new Date(createdAt))}>
                  <button className="w-[40px] text-center text-xs leading-[22px] text-muted-foreground opacity-0 hover:underline group-hover:opacity-100">
                     {format(new Date(+createdAt), 'hh:mm')}
                  </button>
               </Hint>

               <div className="flex w-full flex-col">
                  <Renderer value={body} />
                  <Thumbnail url={image} />
                  {updatedAt ? (
                     <span className="text-xs text-muted-foreground">
                        (edited)
                     </span>
                  ) : null}
               </div>
            </div>
         </div>
      );
   }

   return (
      <div className="group relative flex flex-col gap-2 p-1.5 hover:bg-gray-100/60">
         <div className="flex items-start gap-2">
            <button>
               <Avatar className="size-9">
                  <AvatarImage src={authorImage}></AvatarImage>
                  <AvatarFallback>{avatarFallback}</AvatarFallback>
               </Avatar>
            </button>
            <div className="flex w-full flex-col overflow-hidden">
               <div className="text-sm">
                  <button
                     onClick={() => {}}
                     className="font-bold text-primary hover:underline"
                  >
                     {authorName}
                  </button>
                  <span>&nbsp;&nbsp;</span>
                  <Hint label={formatFullTime(new Date(createdAt))}>
                     <button className="text-xs text-muted-foreground hover:underline">
                        {format(new Date(createdAt), 'h:mm a')}
                     </button>
                  </Hint>
               </div>

               <Renderer value={body} />
               <Thumbnail url={image} />
               {updatedAt ? (
                  <span className="text-xs text-muted-foreground">
                     (edited)
                  </span>
               ) : null}
            </div>
         </div>

         {!isEditing && (
            <Toolbar
               isAuthor={isAuthor}
               isPending={false}
               handleEdit={() => setEdittingId(id)}
               handleDelete={() => {}}
               handleThread={() => {}}
               handleReaction={() => {}}
               hideThreadButton={hideThreadButton}
            />
         )}
      </div>
   );
}
