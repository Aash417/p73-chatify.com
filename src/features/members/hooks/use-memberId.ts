import { useParams } from 'next/navigation';
import { Id } from '../../../../convex/_generated/dataModel';

export function useMemberId() {
   const { memberId } = useParams();

   return memberId as Id<'members'>;
}
