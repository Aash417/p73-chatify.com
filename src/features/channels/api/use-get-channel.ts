import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';

type Props = {
   id: Id<'channels'>;
};

export function useGetChannel({ id }: Props) {
   const data = useQuery(api.channels.getById, { id });
   const isLoading = data === undefined;

   return { data, isLoading };
}
