import Loader from '@/components/loader';
import Message from '@/components/message';
import TriangleAlert from '@/components/triangle-alert';
import { Button } from '@/components/ui/button';
import { useCurrentMember } from '@/features/members/api/use-current-member';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspaceId';
import { XIcon } from 'lucide-react';
import { useState } from 'react';
import { Id } from '../../../../convex/_generated/dataModel';
import { useGetMessage } from '../api/use-get-message';

type Props = {
   messageId: Id<'messages'>;
   onClose: () => void;
};

export default function Thread({ messageId, onClose }: Props) {
   const workspaceId = useWorkspaceId();
   const [editingId, setEditingId] = useState<Id<'messages'> | null>(null);

   const { data: currentMember } = useCurrentMember({ workspaceId });
   const { data: message, isLoading: isMessageLoading } = useGetMessage({
      id: messageId,
   });

   if (isMessageLoading)
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
   );
}
