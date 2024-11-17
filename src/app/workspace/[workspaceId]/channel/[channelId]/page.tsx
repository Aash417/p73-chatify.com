'use client';

import Loader from '@/components/loader';
import MessageList from '@/components/message-list';
import TriangleAlert from '@/components/triangle-alert';
import { useGetChannel } from '@/features/channels/api/use-get-channel';
import ChannelHeader from '@/features/channels/components/channel-header';
import ChatInput from '@/features/channels/components/chat-input';
import { useChannelId } from '@/features/channels/hooks/use-channelId';
import { useGetMessages } from '@/features/messages/api/use-get-messages';

export default function Page() {
   const channelId = useChannelId();
   const { data: channel, isLoading: channelLoading } = useGetChannel({
      id: channelId,
   });
   const { results, status, loadMore } = useGetMessages({ channelId });

   if (channelLoading) return <Loader />;

   if (!channel || status === 'LoadingFirstPage')
      return (
         <TriangleAlert
            message="Channel not found"
            color="text-muted-foreground"
         />
      );

   if (!results)
      return (
         <TriangleAlert
            message="unable to fetch chats at the moment"
            color="text-muted-foreground"
         />
      );

   return (
      <div className="flex h-full flex-col">
         <ChannelHeader title={channel.name} />

         <MessageList
            data={results}
            channelName={channel.name}
            channelCreationTime={channel._creationTime}
            loadMore={loadMore}
            isLoadingMore={status === 'LoadingMore'}
            canLoadMore={status === 'CanLoadMore'}
         />

         <ChatInput placeholder={`Message # ${channel.name}`} />
      </div>
   );
}
