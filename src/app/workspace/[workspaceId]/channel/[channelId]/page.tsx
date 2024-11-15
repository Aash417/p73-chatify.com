'use client';

import { useChannelId } from '@/features/channels/hooks/use-channelId';

export default function Page() {
   const channelId = useChannelId();

   return <div>channel id {channelId}</div>;
}
