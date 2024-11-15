import { useGetChannels } from '@/features/channels/api/use-get-channels';
import { useChannelId } from '@/features/channels/hooks/use-channelId';
import { useCreateChannelModal } from '@/features/channels/store/use-create-channel-modal';
import { useCurrentMember } from '@/features/members/api/use-current-member';
import { useGetMembers } from '@/features/members/api/use-get-members';
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace';
import WorkspaceHeader from '@/features/workspaces/components/workspace-header';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspaceId';
import {
   AlertTriangle,
   HashIcon,
   Loader,
   MessageSquareText,
   SendHorizontal,
} from 'lucide-react';
import SidebarItem from './sidebar-item';
import UserItem from './user-item';
import WorkspaceSection from './workspace-section';

export default function WorkspaceSidebar() {
   const workspaceId = useWorkspaceId();
   const channelId = useChannelId();
   const [_open, setOpen] = useCreateChannelModal();

   const { data: member, isLoading: memberLoading } = useCurrentMember({
      workspaceId,
   });
   const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
      id: workspaceId,
   });
   const { data: channels, isLoading: channelsLoading } = useGetChannels({
      workspaceId,
   });
   const { data: members, isLoading: membersLoading } = useGetMembers({
      workspaceId,
   });
   const isLoading =
      memberLoading || workspaceLoading || channelsLoading || membersLoading;

   if (isLoading)
      return (
         <div className="flex h-full flex-col items-center justify-center bg-[#5E2C5F]">
            <Loader className="size-5 animate-spin text-white" />
         </div>
      );

   if (!member || !workspace)
      return (
         <div className="flex h-full flex-col items-center justify-center bg-[#5E2C5F]">
            <AlertTriangle className="size-5 text-white" />
            <p className="text-sm text-white">Workspace not found</p>
         </div>
      );

   return (
      <div className="flex h-full flex-col bg-[#5E2C5F]">
         <WorkspaceHeader
            workspace={workspace}
            isAdmin={member.role === 'admin'}
         />

         <div className="mt-3 flex flex-col px-2">
            <SidebarItem
               id="threads"
               label="Threads"
               icon={MessageSquareText}
            />
            <SidebarItem
               id="drafts"
               label="Drafts & sent"
               icon={SendHorizontal}
            />
         </div>

         <WorkspaceSection
            label="Channels"
            hint="New channel"
            onNew={member.role === 'admin' ? () => setOpen(true) : undefined}
         >
            {channels?.map((item) => (
               <SidebarItem
                  key={item._id}
                  icon={HashIcon}
                  label={item.name}
                  id={item._id}
                  variant={channelId === item._id ? 'active' : 'default'}
               />
            ))}
         </WorkspaceSection>

         <WorkspaceSection
            label="Direct Messages"
            hint="New direct messages"
            onNew={() => { }}
         >
            {members?.map((item) => (
               <UserItem
                  key={item._id}
                  id={item._id}
                  label={item.user.name}
                  image={item.user.image}
               />
            ))}
         </WorkspaceSection>
      </div>
   );
}
