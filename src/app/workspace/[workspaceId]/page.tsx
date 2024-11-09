'use client';

import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspaceId';

export default function Page() {
   const workspaceId = useWorkspaceId();
   const { data } = useGetWorkspace({ id: workspaceId });

   return <div>workspace id : {JSON.stringify(data)}</div>;
}
