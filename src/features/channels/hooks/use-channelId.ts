import { useParams } from 'next/navigation';
import { Id } from '../../../../convex/_generated/dataModel';

export function useChannelId() {
   const { channelId } = useParams();

   return channelId as Id<'channels'>;
}
