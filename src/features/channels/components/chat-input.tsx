import { useChannelId } from '@/features/channels/hooks/use-channelId';
import { useCreateMessage } from '@/features/messages/api/use-create-message';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspaceId';
import dynamic from 'next/dynamic';
import Quill from 'quill';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

const Editor = dynamic(() => import('@/components/editor'));

type Props = { placeholder: string };

export default function ChatInput({ placeholder }: Props) {
   const channelId = useChannelId();
   const workspaceId = useWorkspaceId();
   const [editorKey, setEditorKey] = useState(0);
   const [isPending, setIsPending] = useState(false);

   const editorRef = useRef<Quill | null>(null);
   editorRef.current?.focus();

   const { mutate: createMessage } = useCreateMessage();

   async function handleSubmit({
      body,
      image,
   }: {
      body: string;
      image: File | null;
   }) {
      try {
         setIsPending(true);
         await createMessage({ body, workspaceId, channelId });
         setEditorKey((prevKey) => prevKey + 1);
      } catch (error) {
         toast.error('Failed to send messaage');
      } finally {
         setIsPending(false);
      }
   }

   return (
      <div className="w-full px-5">
         <Editor
            key={editorKey}
            innerRef={editorRef}
            onSubmit={handleSubmit}
            disabled={isPending}
            placeholder={placeholder}
         />
      </div>
   );
}
