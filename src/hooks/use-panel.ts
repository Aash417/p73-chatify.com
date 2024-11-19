import { useProfileMemberId } from '@/features/members/store/use-profile-member-id';
import { useParentMessageId } from '@/features/messages/store/use-parent-message-id';

export function usePanel() {
   const [parentMessageId, setParentMessageId] = useParentMessageId();
   const [profileMemberId, setProfileMemberId] = useProfileMemberId();

   function onOpenProfile(memberId: string) {
      setProfileMemberId(memberId);
      setParentMessageId(null);
   }

   function onOpenMessage(messageId: string) {
      setParentMessageId(messageId);
      setProfileMemberId(null);
   }

   function onClose() {
      setParentMessageId(null);
      setProfileMemberId(null);
   }

   return {
      parentMessageId,
      profileMemberId,
      onOpenProfile,
      onOpenMessage,
      onClose,
   };
}
