import { useCreateMessage } from '@/features/messages/api/use-create-message';
import { useGenerateUploadUrl } from '@/features/upload/api/use-generate-upload-url';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspaceId';
import dynamic from 'next/dynamic';
import Quill from 'quill';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Id } from '../../../../convex/_generated/dataModel';

const Editor = dynamic(() => import('@/components/editor'));

type Props = {
   placeholder: string;
   conversationId: Id<'conversations'>;
};

type CreateMessageValue = {
   conversationId: Id<'conversations'>;
   workspaceId: Id<'workspaces'>;
   image?: Id<'_storage'>;
   body: string;
};

export default function ChatInput({
   placeholder,
   conversationId,
}: Readonly<Props>) {
   const workspaceId = useWorkspaceId();
   const [editorKey, setEditorKey] = useState(0);
   const [isPending, setIsPending] = useState(false);

   const editorRef = useRef<Quill | null>(null);
   editorRef.current?.focus();

   const { mutate: createMessage } = useCreateMessage();
   const { mutate: generateUploadUrl } = useGenerateUploadUrl();

   async function handleSubmit({
      body,
      image,
   }: {
      body: string;
      image: File | null;
   }) {
      try {
         setIsPending(true);
         editorRef.current?.enable(false);

         const values: CreateMessageValue = {
            conversationId,
            workspaceId,
            body,
            image: undefined,
         };

         if (image) {
            const url = await generateUploadUrl({}, { throwError: true });
            if (!url) throw new Error('Url not found');

            const result = await fetch(url, {
               method: 'POST',
               headers: { 'Content-Type': image.type },
               body: image,
            });
            if (!result.ok) throw new Error('Failed to upload image');

            const { storageId } = await result.json();
            values.image = storageId;
         }

         await createMessage(values, { throwError: true });
         setEditorKey((prevKey) => prevKey + 1);
      } catch (error) {
         toast.error('Failed to send message');
      } finally {
         setIsPending(false);
         editorRef.current?.enable(true);
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
