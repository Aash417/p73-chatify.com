import { useCurrentMember } from '@/features/members/api/use-current-member';
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace';
import WorkspaceHeader from '@/features/workspaces/components/workspace-header';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspaceId';
import { AlertTriangle, Loader } from 'lucide-react';

export default function WorkspaceSidebar() {
   const workspaceId = useWorkspaceId();
   const { data: member, isLoading: memberLoading } = useCurrentMember({
      workspaceId,
   });
   const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
      id: workspaceId,
   });

   if (memberLoading || workspaceLoading)
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
      </div>
   );
}
