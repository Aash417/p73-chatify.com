import { useCurrentMember } from '@/features/members/api/use-current-member';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspaceId';
import { cn } from '@/lib/utils';
import { MdOutlineAddReaction } from 'react-icons/md';
import { Doc, Id } from '../../convex/_generated/dataModel';
import EmojiPopover from './emoji-popover';

type Props = {
   data: Array<
      Omit<Doc<'reactions'>, 'memberId'> & {
         count: number;
         memberIds: Id<'members'>[];
      }
   >;
   onChange: (value: string) => void;
};

export default function Reactions({ data, onChange }: Props) {
   const workspaceId = useWorkspaceId();
   const { data: currentMember } = useCurrentMember({ workspaceId });

   const currentMemberId = currentMember?._id;
   if (data.length === 0 || !currentMemberId) return null;

   return (
      <div className="mb-1 mt-1 flex items-center gap-1">
         {data.map((reaction) => (
            <button
               key={reaction._id}
               onClick={() => onChange(reaction.value)}
               className={cn(
                  'boder flex h-6 items-center gap-x-1 rounded-full border-transparent bg-slate-200/70 px-2 text-slate-800',
                  reaction.memberIds.includes(currentMemberId) &&
                  'border-blue-500 bg-blue-100/70 text-white',
               )}
            >
               {reaction.value}
               <span
                  className={cn(
                     'text-xs font-semibold text-muted-foreground',

                     reaction.memberIds.includes(currentMemberId) &&
                     'text-blue-500',
                  )}
               >
                  {reaction.count}
               </span>
            </button>
         ))}

         <EmojiPopover
            hint="Add reaction"
            onEmojiSelect={(emoji) => onChange(emoji.native)}
         >
            <button className="flex h-7 items-center gap-x-1 rounded-full border border-transparent bg-slate-200/70 px-3 text-slate-800 hover:border-slate-500">
               <MdOutlineAddReaction />
            </button>
         </EmojiPopover>
      </div>
   );
}
