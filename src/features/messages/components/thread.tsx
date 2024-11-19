import Loader from '@/components/loader';
import TriangleAlert from '@/components/triangle-alert';
import { Button } from '@/components/ui/button';
import { useChannelId } from '@/features/channels/hooks/use-channelId';
import { useCurrentMember } from '@/features/members/api/use-current-member';
import { useCreateMessage } from '@/features/messages/api/use-create-message';
import { useGetMessage } from '@/features/messages/api/use-get-message';
import { useGetMessages } from '@/features/messages/api/use-get-messages';
import Message from '@/features/messages/components/message';
import { useGenerateUploadUrl } from '@/features/upload/api/use-generate-upload-url';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspaceId';
import { differenceInMinutes, format, isToday, isYesterday } from 'date-fns';
import { XIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
import Quill from 'quill';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Id } from '../../../../convex/_generated/dataModel';

const Editor = dynamic(() => import('@/components/editor'), { ssr: false });
const TIME_THRESHOLD = 5;

type Props = {
   messageId: Id<'messages'>;
   onClose: () => void;
};

type CreateMessageValue = {
   channelId: Id<'channels'>;
   workspaceId: Id<'workspaces'>;
   parentMessageId: Id<'messages'>;
   image?: Id<'_storage'> | undefined;
   body: string;
};

function formatDateLabel(datekey: string) {
   const date = new Date(datekey);

   if (isToday(date)) return 'Today';
   if (isYesterday(date)) return 'Yesterday';

   // return format(date, 'dd/MM/yyyy');
   return datekey;
}

export default function Thread({ messageId, onClose }: Props) {
   const channelId = useChannelId();
   const workspaceId = useWorkspaceId();
   const [editingId, setEditingId] = useState<Id<'messages'> | null>(null);

   const [editorKey, setEditorKey] = useState(0);
   const [isPending, setIsPending] = useState(false);

   const editorRef = useRef<Quill | null>(null);
   editorRef.current?.focus();

   const { mutate: createMessage } = useCreateMessage();
   const { mutate: generateUploadUrl } = useGenerateUploadUrl();

   const { data: currentMember } = useCurrentMember({ workspaceId });
   const { data: message, isLoading: isMessageLoading } = useGetMessage({
      id: messageId,
   });
   const { results, status, loadMore } = useGetMessages({
      channelId,
      parentMessageId: messageId,
   });
   const canLoadMore = status === 'CanLoadMore';
   const isLoadingMore = status === 'LoadingMore';

   async function handleSubmit({
      body,
      image,
   }: {
      body: string;
      image: File | null;
   }) {
      try {
         setIsPending(true);
         editorRef.current?.enable(false);

         const values: CreateMessageValue = {
            channelId,
            workspaceId,
            parentMessageId: messageId,
            body,
            image: undefined,
         };

         if (image) {
            const url = await generateUploadUrl({}, { throwError: true });
            if (!url) throw new Error('Url not found');

            const result = await fetch(url, {
               method: 'POST',
               headers: { 'Content-Type': image.type },
               body: image,
            });
            if (!result.ok) throw new Error('Failed to uplaod image');

            const { storageId } = await result.json();
            values.image = storageId;
         }

         await createMessage(values, { throwError: true });
         setEditorKey((prevKey) => prevKey + 1);
      } catch (error) {
         toast.error('Failed to send messaage');
      } finally {
         setIsPending(false);
         editorRef.current?.enable(true);
      }
   }

   const groupedMessage = results?.reduce(
      (groups, message) => {
         const date = new Date(message._creationTime);
         const dateKey = format(date, 'dd/MM/yyyy');

         if (!groups[dateKey]) {
            groups[dateKey] = [];
         }
         groups[dateKey].unshift(message);

         return groups;
      },
      {} as Record<string, typeof results>,
   );

   if (isMessageLoading || status === 'LoadingFirstPage')
      return (
         <div className="flex h-full flex-col">
            <div className="flex h-[49px] items-center justify-between border-b px-4">
               <p className="text-lg font-bold">Thread</p>
               <Button onClick={onClose} size="iconSm" variant="ghost">
                  <XIcon className="size-5 stroke-[1.5]" />
               </Button>
            </div>

            <Loader />
         </div>
      );

   if (!message)
      return (
         <div className="flex h-full flex-col">
            <div className="flex h-[49px] items-center justify-between border-b px-4">
               <p className="text-lg font-bold">Thread</p>
               <Button onClick={onClose} size="iconSm" variant="ghost">
                  <XIcon className="size-5 stroke-[1.5]" />
               </Button>
            </div>

            <TriangleAlert
               message="Message not found"
               color="text-muted-foreground"
            />
         </div>
      );

   return (
      <div className="flex h-full flex-col">
         <div className="flex h-[49px] items-center justify-between border-b px-4">
            <p className="text-lg font-bold">Thread</p>
            <Button onClick={onClose} size="iconSm" variant="ghost">
               <XIcon className="size-5 stroke-[1.5]" />
            </Button>
         </div>

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
                           threadName={message.threadName}
                           threadCount={message.threadCount}
                           threadImage={message.threadImage}
                           threadTimestamp={message.threadTimestamp}
                           isEditing={editingId === message._id}
                           setEdittingId={setEditingId}
                           isCompact={isCompact}
                           hideThreadButton
                        />
                     );
                  })}
               </div>
            ))}

            <div
               className="h-1"
               ref={(el) => {
                  if (el) {
                     const observer = new IntersectionObserver(
                        ([entry]) => {
                           if (entry.isIntersecting && canLoadMore) {
                              loadMore();
                           }
                        },
                        { threshold: 1.0 },
                     );

                     observer.observe(el);
                     return () => observer.disconnect();
                  }
               }}
            />

            {isLoadingMore && (
               <div className="relative my-2 text-center">
                  <hr className="absolute left-0 top-1/2 border-t border-gray-300 ring-0" />
                  <Loader />
               </div>
            )}

            <Message
               hideThreadButton
               memberId={message.memberId}
               authorName={message.user.name}
               authorImage={message.user.image}
               isAuthor={message.memberId === currentMember?._id}
               body={message.body}
               image={message.image}
               createdAt={message._creationTime}
               updatedAt={message.updatedAt}
               id={message._id}
               reactions={message.reactions}
               isEditing={editingId === messageId}
               setEdittingId={setEditingId}
            />
         </div>

         <div className="px-4">
            <Editor
               key={editorKey}
               innerRef={editorRef}
               onSubmit={handleSubmit}
               disabled={false}
               placeholder="Reply..."
            />
         </div>
      </div>
   );
}
