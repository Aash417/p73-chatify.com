'use client';

import Loader from '@/components/loader';
import { useGetMember } from '@/features/members/api/use-get-member';
import { useMemberId } from '@/features/members/hooks/use-memberId';
import { useGetMessages } from '@/features/messages/api/use-get-messages';
import MessageList from '@/features/messages/components/message-list';
import { usePanel } from '@/hooks/use-panel';
import { Id } from '../../../../convex/_generated/dataModel';
import ChatInput from './chat-input';
import ConversationHeader from './conversation-header';

type Props = {
   id: Id<'conversations'>;
};

export default function Conversation({ id }: Props) {
   const memberId = useMemberId();
   const { onOpenProfile } = usePanel();
   const { data: member, isLoading: isLoadingMember } = useGetMember({
      id: memberId,
   });

   const { results, status, loadMore } = useGetMessages({
      conversationId: id,
   });

   if (isLoadingMember || status === 'LoadingFirstPage') return <Loader />;

   return (
      <div className="flex h-full flex-col">
         <ConversationHeader
            memberName={member?.user.name}
            memberImage={member?.user.image}
            onClick={() => onOpenProfile(memberId)}
         />

         <MessageList
            data={results}
            memberName={member?.user.name}
            memberImage={member?.user.image}
            loadMore={loadMore}
            isLoadingMore={status === 'LoadingMore'}
            canLoadMore={status === 'CanLoadMore'}
            variant="conversation"
         />

         <ChatInput
            placeholder={`Message ${member?.user.name}`}
            conversationId={id}
         />
      </div>
   );
}
