import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import {
   Tooltip,
   TooltipContent,
   TooltipProvider,
   TooltipTrigger,
} from './ui/tooltip';

type Props = {
   hint?: string;
   onEmojiSelect: (emoji: any) => void;
   children: React.ReactNode;
};

export default function EmojiPopover({
   hint = 'emoji',
   onEmojiSelect,
   children,
}: Props) {
   const [popoverOpen, setPopoverOpen] = useState(false);
   const [tooltipOpen, setTooltipOpen] = useState(false);

   function onSelect(emoji: any) {
      onEmojiSelect(emoji);
      setPopoverOpen(false);

      setTimeout(() => {
         setTooltipOpen(false);
      }, 500);
   }
   return (
      <TooltipProvider>
         <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <Tooltip
               open={tooltipOpen}
               onOpenChange={setTooltipOpen}
               delayDuration={50}
            >
               <PopoverTrigger asChild>
                  <TooltipTrigger asChild>{children}</TooltipTrigger>
               </PopoverTrigger>

               <TooltipContent className="border border-white/5 bg-black text-white">
                  <p className="text-xs font-medium">{hint}</p>
               </TooltipContent>
            </Tooltip>

            <PopoverContent className="w-full border-none p-0 shadow-none">
               <Picker data={data} onEmojiSelect={onSelect} />
            </PopoverContent>
         </Popover>
      </TooltipProvider>
   );
}
