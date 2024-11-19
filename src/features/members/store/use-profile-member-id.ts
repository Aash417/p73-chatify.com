import { useQueryState } from 'nuqs';

export function useProfileMemberId() {
   return useQueryState('profileMemberId');
}
