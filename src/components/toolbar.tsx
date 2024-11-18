import { MessagesSquareIcon, Pencil, Smile, Trash } from 'lucide-react';
import EmojiPopover from './emoji-popover';
import Hint from './hint';
import { Button } from './ui/button';

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
                  <Button
                     onClick={handleThread}
                     variant="ghost"
                     size="iconSm"
                     disabled={isPending}
                  >
                     <MessagesSquareIcon className="size-4" />
                  </Button>
               </Hint>
            )}

            {isAuthor && (
               <Hint label="Edit message">
                  <Button
                     onClick={handleEdit}
                     variant="ghost"
                     size="iconSm"
                     disabled={isPending}
                  >
                     <Pencil className="size-4" />
                  </Button>
               </Hint>
            )}

            {isAuthor && (
               <Hint label="Delete message">
                  <Button
                     onClick={handleDelete}
                     variant="ghost"
                     size="iconSm"
                     disabled={isPending}
                  >
                     <Trash className="size-4" />
                  </Button>
               </Hint>
            )}
         </div>
      </div>
   );
}
