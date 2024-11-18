import { useQueryState } from 'nuqs';

export function useParentMessageId() {
   return useQueryState('parentMessageId');
}
