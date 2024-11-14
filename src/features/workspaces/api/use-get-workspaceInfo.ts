import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';

type Props = {
   id: Id<'workspaces'>;
};

export function useGetWorkspaceInfo({ id }: Props) {
   const data = useQuery(api.workspaces.getInfoById, { id });
   const isLoading = data === undefined;

   return { data, isLoading };
}
