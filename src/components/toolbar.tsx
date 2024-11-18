import { MessagesSquareIcon, Pencil, Smile, Trash } from 'lucide-react';
import React from 'react';
import { Button } from './ui/button';
import Hint from './hint';
import EmojiPopover from './emoji-popover';

type Props = {
   isAuthor: boolean;
   isPending: boolean;
   handleEdit: () => void;
   handleDelete: () => void;
   handleThread: () => void;
   handleReaction: (value: string) => void;
   hideThreadButton?: boolean;
};

export default function Toolbar({
   isAuthor,
   isPending,
   handleEdit,
   handleDelete,
   handleThread,
   handleReaction,
   hideThreadButton,
}: Props) {
   return (
      <div className="absolute right-5 top-0">
         <div className="boder rounded-md bg-white opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
            <EmojiPopover
               hint="Add reaction"
               onEmojiSelect={(emoji) => handleReaction(emoji.native)}
            >
               <Button variant="ghost" size="iconSm" disabled={isPending}>
                  <Smile className="size-4" />
               </Button>
            </EmojiPopover>

            {!hideThreadButton && (
               <Hint label="Reply in thread">
                  <Button variant="ghost" size="iconSm" disabled={isPending}>
                     <MessagesSquareIcon className="size-4" />
                  </Button>
               </Hint>
            )}

            {isAuthor && (
               <Hint label="Edit message">
                  <Button variant="ghost" size="iconSm" disabled={isPending}>
                     <Pencil className="size-4" />
                  </Button>
               </Hint>
            )}

            {isAuthor && (
               <Hint label="Delete message">
                  <Button variant="ghost" size="iconSm" disabled={isPending}>
                     <Trash className="size-4" />
                  </Button>
               </Hint>
            )}
         </div>
      </div>
   );
}
