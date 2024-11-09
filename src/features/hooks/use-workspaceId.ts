import { useParams } from 'next/navigation';
import { Id } from '../../../convex/_generated/dataModel';

export function useWorkspaceId() {
   const { workspaceId } = useParams();

   return workspaceId as Id<'workspaces'>;
}
