import dynamic from 'next/dynamic';
import Quill from 'quill';
import { useRef } from 'react';

const Editor = dynamic(() => import('@/components/editor'));

type Props = {
   placeholder: string;
};

export default function ChatInput({ placeholder }: Props) {
   const editorRef = useRef<Quill | null>(null);

   editorRef.current?.focus();

   return (
      <div className="w-full px-5">
         <Editor
            placeholder={placeholder}
            onSubmit={() => {}}
            disabled={false}
            innerRef={editorRef}
         />
      </div>
   );
}
