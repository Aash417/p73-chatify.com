import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';

type Props = {
   id: Id<'members'>;
};
export function useGetMember({ id }: Props) {
   const data = useQuery(api.members.getById, { id });
   const isLoading = data === undefined;

   return { data, isLoading };
}
