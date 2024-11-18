import { useRemoveMessage } from '@/features/messages/api/use-remove-message';
import { useUpdateMessage } from '@/features/messages/api/use-update-message';
import { useToggleReaction } from '@/features/reactions/api/use-toggle-reaction';
import useConfirm from '@/hooks/use-confirm';
import { usePanel } from '@/hooks/use-panel';
import { cn } from '@/lib/utils';
import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { format, isToday, isYesterday } from 'date-fns';
import dynamic from 'next/dynamic';
import { toast } from 'sonner';
import { Doc, Id } from '../../convex/_generated/dataModel';
import Hint from './hint';
import Reactions from './reactions';
import Thumbnail from './thumbnail';
import Toolbar from './toolbar';
import { Avatar } from './ui/avatar';

const Renderer = dynamic(() => import('@/components/renderer'), { ssr: false });
const Editor = dynamic(() => import('@/components/editor'), { ssr: false });

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
   const { parentMessageId, onOpenMessage, onClose } = usePanel();
   const [ConfirmDialog, confirm] = useConfirm(
      'Delete message',
      'Are you sure you want to delete this message',
   );

   const { mutate: updateMessage, isPending: isUpdatingMessage } =
      useUpdateMessage();
   const { mutate: removeMessage, isPending: isRemovingMessage } =
      useRemoveMessage();
   const { mutate: toggleReaction, isPending: isTogglingReaction } =
      useToggleReaction();

   const isPending = isUpdatingMessage || isRemovingMessage;

   function handleUpdate({ body }: { body: string }) {
      updateMessage(
         { id, body },
         {
            onSuccess: () => {
               toast.success('Message updated');
               setEdittingId(null);
            },
            onError: () => {
               toast.error('Failed to update message');
            },
         },
      );
   }

   async function handleRemove() {
      const ok = await confirm();
      if (!ok) return;

      removeMessage(
         { id },
         {
            onSuccess: () => {
               if (parentMessageId === id) onClose();

               toast.success('Message deleted');
            },
            onError: () => {
               toast.error('Failed to delete message');
            },
         },
      );
   }

   function handleReaction(value: string) {
      toggleReaction(
         { messageId: id, value },
         {
            onError: () => {
               toast.error('Failed to toggle reaction');
            },
         },
      );
   }

   if (isCompact) {
      return (
         <>
            <ConfirmDialog />
            <div
               className={cn(
                  'group relative flex flex-col gap-2 p-1.5 hover:bg-gray-100/60',
                  isEditing && 'bg-[#f2c74433] hover:bg-[#f2c74433]',
                  isRemovingMessage &&
                     'trasform origin-bottom scale-y-0 bg-rose-500/50 transition-all duration-200',
               )}
            >
               <div className="flex items-start gap-2">
                  <Hint label={formatFullTime(new Date(createdAt))}>
                     <button className="w-[40px] text-center text-xs leading-[22px] text-muted-foreground opacity-0 hover:underline group-hover:opacity-100">
                        {format(new Date(+createdAt), 'hh:mm')}
                     </button>
                  </Hint>

                  {isEditing ? (
                     <div className="h-full w-full">
                        <Editor
                           onSubmit={handleUpdate}
                           disabled={isPending}
                           defaultValue={JSON.parse(body)}
                           onCancel={() => setEdittingId(null)}
                           variant="update"
                        />
                     </div>
                  ) : (
                     <div className="flex w-full flex-col">
                        <Renderer value={body} />
                        <Thumbnail url={image} />
                        {updatedAt ? (
                           <span className="text-xs text-muted-foreground">
                              (edited)
                           </span>
                        ) : null}
                        <Reactions data={reactions} onChange={handleReaction} />
                     </div>
                  )}
               </div>

               {!isEditing && (
                  <Toolbar
                     isAuthor={isAuthor}
                     isPending={false}
                     handleEdit={() => setEdittingId(id)}
                     handleDelete={handleRemove}
                     handleThread={() => onOpenMessage(id)}
                     handleReaction={handleReaction}
                     hideThreadButton={hideThreadButton}
                  />
               )}
            </div>
         </>
      );
   }

   return (
      <>
         <ConfirmDialog />
         <div
            className={cn(
               'group relative flex flex-col gap-2 p-1.5 hover:bg-gray-100/60',
               isEditing && 'bg-[#f2c74433] hover:bg-[#f2c74433]',
               isRemovingMessage &&
                  'trasform origin-bottom scale-y-0 bg-rose-500/50 transition-all duration-200',
            )}
         >
            <div className="flex items-start gap-2">
               <button>
                  <Avatar className="size-9">
                     <AvatarImage src={authorImage}></AvatarImage>
                     <AvatarFallback>{avatarFallback}</AvatarFallback>
                  </Avatar>
               </button>

               {isEditing ? (
                  <div className="h-full w-full">
                     <Editor
                        onSubmit={handleUpdate}
                        disabled={isPending}
                        defaultValue={JSON.parse(body)}
                        onCancel={() => setEdittingId(null)}
                        variant="update"
                     />
                  </div>
               ) : (
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
                     <Reactions data={reactions} onChange={handleReaction} />
                  </div>
               )}
            </div>

            {!isEditing && (
               <Toolbar
                  isAuthor={isAuthor}
                  isPending={false}
                  handleEdit={() => setEdittingId(id)}
                  handleDelete={handleRemove}
                  handleThread={() => onOpenMessage(id)}
                  handleReaction={handleReaction}
                  hideThreadButton={hideThreadButton}
               />
            )}
         </div>
      </>
   );
}
