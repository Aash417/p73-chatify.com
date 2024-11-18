import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';

type Props = {
   id: Id<'messages'>;
};

export function useGetMessage({ id }: Props) {
   const data = useQuery(api.messages.getById, { id });
   const isLoading = data === undefined;

   return { data, isLoading };
}
