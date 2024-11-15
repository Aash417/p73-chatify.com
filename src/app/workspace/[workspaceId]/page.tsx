'use client';

import { useGetChannels } from '@/features/channels/api/use-get-channels';
import { useCreateChannelModal } from '@/features/channels/store/use-create-channel-modal';
import { useCurrentMember } from '@/features/members/api/use-current-member';
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspaceId';
import { Loader, TriangleAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';

export default function Page() {
   const router = useRouter();
   const workspaceId = useWorkspaceId();
   const [open, setOpen] = useCreateChannelModal();

   const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
      id: workspaceId,
   });
   const { data: channels, isLoading: channelsLoading } = useGetChannels({
      workspaceId,
   });
   const { data: member, isLoading: memberLoading } = useCurrentMember({
      workspaceId,
   });
   const isLoading = workspaceLoading || channelsLoading || memberLoading;

   const isAdmin = useMemo(() => member?.role === 'admin', [member?.role]);
   const channelId = useMemo(() => channels?.[0]?._id, [channels]);

   useEffect(() => {
      if (isLoading || !workspace || !member) return;

      if (channelId)
         router.push(`/workspace/${workspaceId}/channel/${channelId}`);
      else if (!open && isAdmin) setOpen(true);
   }, [
      channelId,
      isLoading,
      workspace,
      open,
      setOpen,
      router,
      workspaceId,
      member,
      isAdmin,
   ]);

   if (isLoading) return <Loader />;

   if (!workspace || !member)
      return (
         <div className="flex h-full items-center justify-center">
            <TriangleAlert className="size-6 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
               Workspace not found
            </span>
         </div>
      );

   return (
      <div className="flex h-full items-center justify-center">
         <TriangleAlert className="size-6 text-muted-foreground" />
         <span className="text-sm text-muted-foreground">No channel found</span>
      </div>
   );
}
