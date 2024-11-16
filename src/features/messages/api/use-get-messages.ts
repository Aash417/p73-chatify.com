import { usePaginatedQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';

const BATCH_SIZE = 20;

type Props = {
   channelId?: Id<'channels'>;
   conversationId?: Id<'conversations'>;
   parentMessageId?: Id<'messages'>;
};

export type GetMessagesReturnType =
   (typeof api.messages.get._returnType)['page'];

export function useGetMessages({
   channelId,
   conversationId,
   parentMessageId,
}: Props) {
   const { results, status, loadMore } = usePaginatedQuery(
      api.messages.get,
      { channelId, conversationId, parentMessageId },
      { initialNumItems: BATCH_SIZE },
   );
   const isLoading = results === undefined;

   return { results, status, loadMore: () => loadMore(BATCH_SIZE), isLoading };
}
