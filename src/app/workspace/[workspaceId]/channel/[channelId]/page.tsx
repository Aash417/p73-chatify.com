'use client';

import Loader from '@/components/loader';
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
   const { results } = useGetMessages({ channelId });
   console.log({ results });

   if (channelLoading) return <Loader />;

   if (!channel)
      return (
         <TriangleAlert
            message="Channel not found"
            color="text-muted-foreground"
         />
      );

   return (
      <div className="flex h-full flex-col">
         <ChannelHeader title={channel.name} />

         <div className="flex-1">{JSON.stringify(results)}</div>

         <ChatInput placeholder={`Message # ${channel.name}`} />
      </div>
   );
}
