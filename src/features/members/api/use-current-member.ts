import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';

type Props = {
   workspaceId: Id<'workspaces'>;
};
export function useCurrentMember({ workspaceId }: Props) {
   const data = useQuery(api.members.current, { workspaceId });
   const isLoading = data === undefined;

   return { data, isLoading };
}
