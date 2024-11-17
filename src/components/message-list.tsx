import { useCurrentMember } from '@/features/members/api/use-current-member';
import { GetMessagesReturnType } from '@/features/messages/api/use-get-messages';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspaceId';
import { differenceInMinutes, format, isToday, isYesterday } from 'date-fns';
import { useState } from 'react';
import { Id } from '../../convex/_generated/dataModel';
import ChannelHero from './channel-hero';
import Message from './message';

const TIME_THRESHOLD = 5;

type Props = {
   memberName?: string;
   memberImage?: string;
   channelName?: string;
   channelCreationTime?: number;
   variant?: 'channel' | 'thread' | 'conversation';
   data?: GetMessagesReturnType | undefined;
   loadMore?: () => void;
   isLoadingMore?: boolean;
   canLoadMore?: boolean;
};

function formatDateLabel(datekey: string) {
   const date = new Date(datekey);

   if (isToday(date)) return 'Today';
   if (isYesterday(date)) return 'Yesterday';

   // return format(date, 'dd/MM/yyyy');
   return datekey;
}

export default function MessageList({
   memberName,
   memberImage,
   channelName,
   channelCreationTime,
   variant,
   data,
   loadMore,
   isLoadingMore,
   canLoadMore,
}: Props) {
   const workspaceId = useWorkspaceId();
   const { data: currentMember } = useCurrentMember({ workspaceId });
   const [editingId, setEditingId] = useState<Id<'messages'> | null>(null);

   const groupedMessage = data?.reduce(
      (groups, message) => {
         const date = new Date(message._creationTime);
         const dateKey = format(date, 'dd/MM/yyyy');

         if (!groups[dateKey]) {
            groups[dateKey] = [];
         }
         groups[dateKey].unshift(message);

         return groups;
      },
      {} as Record<string, typeof data>,
   );

   return (
      <div className="messages-scrollbar flex flex-1 flex-col-reverse overflow-y-auto pb-4">
         {Object.entries(groupedMessage || {}).map(([dateKey, messages]) => (
            <div key={dateKey}>
               <div className="relative my-2 text-center">
                  <hr className="absolute left-0 right-0 top-1/2 border-t border-gray-300" />
                  <span className="boder relative inline-block rounded-full border-gray-300 bg-white px-4 py-1 text-xs shadow-sm">
                     {formatDateLabel(dateKey)}
                  </span>
               </div>

               {messages.map((message, index) => {
                  const prevMsg = messages[index - 1];
                  const isCompact =
                     prevMsg &&
                     prevMsg.user?._id === message.user?._id &&
                     differenceInMinutes(
                        new Date(message._creationTime),
                        new Date(prevMsg._creationTime),
                     ) < TIME_THRESHOLD;

                  return (
                     <Message
                        key={message._id}
                        id={message._id}
                        memberId={message.memberId}
                        authorImage={message.user.image}
                        authorName={message.user.name}
                        isAuthor={message.member._id === currentMember?._id}
                        reactions={message.reactions}
                        body={message.body}
                        image={message.image}
                        updatedAt={message.updatedAt}
                        createdAt={message._creationTime}
                        threadCount={message.threadCount}
                        threadImage={message.threadImage}
                        threadTimestamp={message.threadTimestamp}
                        isEditing={editingId === message._id}
                        setEdittingId={setEditingId}
                        isCompact={isCompact}
                        hideThreadButton={variant === 'thread'}
                     />
                  );
               })}
            </div>
         ))}

         {variant === 'channel' && channelName && channelCreationTime && (
            <ChannelHero
               name={channelName}
               creationTime={channelCreationTime}
            />
         )}
      </div>
   );
}
