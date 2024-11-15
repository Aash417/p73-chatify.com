'use client';

import { cn } from '@/lib/utils';
import { ImageIcon, Smile } from 'lucide-react';
import Quill, { QuillOptions } from 'quill';
import { Delta, Op } from 'quill/core';
import 'quill/dist/quill.snow.css';
import {
   MutableRefObject,
   useEffect,
   useLayoutEffect,
   useRef,
   useState,
} from 'react';
import { MdSend } from 'react-icons/md';
import { PiTextAa } from 'react-icons/pi';
import EmojiPopover from './emoji-popover';
import Hint from './hint';
import { Button } from './ui/button';

type EditorValue = {
   image: File | null;
   body: string;
};
type Props = {
   variant?: 'create' | 'update';
   onSubmit: ({ image, body }: EditorValue) => void;
   onCancel?: () => void;
   placeholder?: string;
   defaultValue?: Delta | Op[];
   disabled?: boolean;
   innerRef?: MutableRefObject<Quill | null>;
};

export default function Editor({
   variant = 'create',
   onSubmit,
   onCancel,
   placeholder = 'Write something ..',
   defaultValue = [],
   disabled = false,
   innerRef,
}: Props) {
   const [text, setText] = useState('');
   const [isToolbarVisible, setIsToolbarVisible] = useState(false);
   const isEmpty = text.replace(/<(.|\n)*?>/g, '').trim().length === 0;

   const containerRef = useRef<HTMLDivElement>(null);
   const quillRef = useRef<Quill | null>(null);
   const submitRef = useRef(onSubmit);
   const defaultValueRef = useRef(defaultValue);
   const disabledRef = useRef(disabled);
   const placeholderRef = useRef(placeholder);

   useLayoutEffect(() => {
      submitRef.current = onSubmit;
      placeholderRef.current = placeholder;
      defaultValueRef.current = defaultValue;
      disabledRef.current = disabled;
   });

   useEffect(() => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const editorContainer = container.appendChild(
         container.ownerDocument.createElement('div'),
      );

      const options: QuillOptions = {
         theme: 'snow',
         placeholder: placeholderRef.current,
         modules: {
            toolbar: [
               ['bold', 'italic', 'strike'],
               ['link'],
               [{ list: 'ordered' }, { list: 'bullet' }],
            ],
            keyboard: {
               bindings: {
                  enter: {
                     key: 'Enter',
                     handler: () => {
                        return;
                     },
                  },

                  shift_enter: {
                     key: 'Enter',
                     shiftkey: true,
                     handler: () => {
                        quill.insertText(
                           quill.getSelection()?.index || 0,
                           '\n',
                        );
                     },
                  },
               },
            },
         },
      };

      const quill = new Quill(editorContainer, options);
      quillRef.current = quill;
      quillRef.current.focus();

      if (innerRef) innerRef.current = quill;

      quill.setContents(defaultValueRef.current);
      setText(quill.getText());

      quill.on(Quill.events.TEXT_CHANGE, () => {
         setText(quill.getText());
      });

      return () => {
         quill.off(Quill.events.TEXT_CHANGE);

         if (container) container.innerHTML = '';

         if (quillRef.current) quillRef.current = null;

         if (innerRef) innerRef.current = null;
      };
   }, [innerRef]);

   function toggleToolbar() {
      setIsToolbarVisible((current) => !current);

      const toolbarElement = containerRef.current?.querySelector('.ql-toolbar');

      if (toolbarElement) toolbarElement.classList.toggle('hidden');
   }

   function onEmojiSelect(emoji: any) {
      const quill = quillRef.current;

      quill?.insertText(quill.getSelection()?.index || 0, emoji.native);
   }
   return (
      <div className="flex flex-col">
         <div className="flex flex-col overflow-hidden rounded-md border border-slate-200 bg-white transition focus-within:border-slate-300 focus-within:shadow-sm">
            <div ref={containerRef} className="ql-custom h-full" />

            <div className="z-[5] flex px-2 pb-2">
               <Hint
                  label={
                     isToolbarVisible ? 'Show formatring' : 'Hide formatting'
                  }
               >
                  <Button
                     onClick={toggleToolbar}
                     disabled={disabled}
                     size="sm"
                     variant="ghost"
                     className="size-4"
                  >
                     <PiTextAa />
                  </Button>
               </Hint>

               <EmojiPopover onEmojiSelect={onEmojiSelect}>
                  <Button
                     disabled={disabled}
                     size="sm"
                     variant="ghost"
                     className="size-4"
                  >
                     <Smile />
                  </Button>
               </EmojiPopover>

               {variant === 'create' && (
                  <Hint label="Image">
                     <Button
                        onClick={() => {}}
                        disabled={false}
                        size="sm"
                        variant="ghost"
                        className="size-4"
                     >
                        <ImageIcon />
                     </Button>
                  </Hint>
               )}

               {variant === 'update' && (
                  <div className="ml-auto flex items-center gap-x-2">
                     <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {}}
                        disabled={disabled}
                     >
                        Cancel
                     </Button>
                     <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {}}
                        disabled={disabled || isEmpty}
                        className="hover:bg[#007a5a]/80 ml-auto bg-[#007a5a] text-white"
                     >
                        Save
                     </Button>
                  </div>
               )}

               {variant === 'create' && (
                  <Button
                     onClick={() => {}}
                     disabled={disabled || isEmpty}
                     size="iconSm"
                     className={cn(
                        'ml-auto',
                        isEmpty
                           ? 'hover:bg[#007a5a]/80 bg-white text-muted-foreground'
                           : 'hover:bg[#007a5a]/80 bg-[#007a5a] text-white',
                     )}
                  >
                     <MdSend className="size-4" />
                  </Button>
               )}
            </div>
         </div>

         {variant === 'create' && (
            <div
               className={cn(
                  'flex justify-end pb-2 text-[10px] text-muted-foreground opacity-0',
                  !isEmpty && 'opacity-100',
               )}
            >
               <p>
                  <strong>Shift + Enter</strong> to add a new line
               </p>
            </div>
         )}
      </div>
   );
}
