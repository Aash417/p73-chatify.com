import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';

type Props = {
   id: Id<'workspaces'>;
};

export function useGetWorkspace({ id }: Props) {
   const data = useQuery(api.workspaces.getById, { id });
   const isLoading = data === undefined;

   return { data, isLoading };
}
