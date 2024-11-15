'use client';

import Loader from '@/components/loader';
import TriangleAlert from '@/components/triangle-alert';
import { useGetChannel } from '@/features/channels/api/use-get-channel';
import ChannelHeader from '@/features/channels/components/channel-header';
import { useChannelId } from '@/features/channels/hooks/use-channelId';

export default function Page() {
   const channelId = useChannelId();
   const { data: channel, isLoading: channelLoading } = useGetChannel({
      id: channelId,
   });

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
      </div>
   );
}
