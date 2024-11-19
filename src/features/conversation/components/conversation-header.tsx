'use client';

import { AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar';
import { FaChevronDown } from 'react-icons/fa';

type Props = {
   memberName?: string;
   memberImage?: string;
   onClick?: () => void;
};

export default function ConversationHeader({
   memberImage,
   memberName,
   onClick,
}: Props) {
   const avatarFallback = memberName?.charAt(0).toUpperCase();

   return (
      <div className="flex h-[49px] items-center overflow-hidden border-b bg-white px-4">
         <Button
            variant="ghost"
            className="w-auto overflow-hidden px-2 text-lg font-semibold"
            size="sm"
            onClick={onClick}
         >
            <Avatar className="mr-2 size-6">
               <AvatarImage src={memberImage}></AvatarImage>
               <AvatarFallback>{avatarFallback}</AvatarFallback>
            </Avatar>

            <span className="truncate">{memberName}</span>
            <FaChevronDown className="ml-2 size-2.5" />
         </Button>
      </div>
   );
}
