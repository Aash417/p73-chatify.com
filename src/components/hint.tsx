import React from 'react';
import {
   Tooltip,
   TooltipContent,
   TooltipProvider,
   TooltipTrigger,
} from './ui/tooltip';

type Props = {
   label: string;
   side?: 'top' | 'right' | 'bottom' | 'left';
   align?: 'start' | 'center' | 'end';
   children: React.ReactNode;
};

export default function Hint({
   label,
   side,
   align,
   children,
}: Readonly<Props>) {
   return (
      <TooltipProvider>
         <Tooltip delayDuration={50}>
            <TooltipTrigger asChild>{children}</TooltipTrigger>
            <TooltipContent
               side={side}
               align={align}
               className="border border-white/5 bg-black text-white"
            >
               <p className="text-xs font-medium">{label}</p>
            </TooltipContent>
         </Tooltip>
      </TooltipProvider>
   );
}
