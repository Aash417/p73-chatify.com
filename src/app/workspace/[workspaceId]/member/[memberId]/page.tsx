'use client';

import Loader from '@/components/loader';
import TriangleAlert from '@/components/triangle-alert';
import { useCreateOrGetConversation } from '@/features/conversation/api/use-create-or-get-conversation';
import Conversation from '@/features/conversation/components/conversation';
import { useMemberId } from '@/features/members/hooks/use-memberId';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspaceId';
import { useEffect, useState } from 'react';
import { Id } from '../../../../../../convex/_generated/dataModel';

export default function Page() {
   const workspaceId = useWorkspaceId();
   const memberId = useMemberId();
   const [conversationId, setConversationId] =
      useState<Id<'conversations'> | null>(null);

   const { mutate, isPending } = useCreateOrGetConversation();

   useEffect(() => {
      mutate(
         { workspaceId, memberId },
         {
            onSuccess: (data) => {
               setConversationId(data);
            },
         },
      );
   }, [memberId, workspaceId, mutate]);

   if (isPending) return <Loader />;

   if (!conversationId)
      return (
         <TriangleAlert
            message="Conversation not found"
            color="text-muted-foreground"
         />
      );

   return <Conversation id={conversationId} />;
}
