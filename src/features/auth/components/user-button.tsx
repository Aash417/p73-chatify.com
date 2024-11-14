'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCurrentuser } from '@/features/auth/api/use-current-user';
import { useAuthActions } from '@convex-dev/auth/react';
import { Loader, LogOut } from 'lucide-react';

export default function UserButton() {
   const { signOut } = useAuthActions();
   const { data, isLoading } = useCurrentuser();

   if (isLoading)
      return <Loader className="size-4 animate-spin text-muted-foreground" />;

   if (!data) return null;

   const { name, image } = data;
   const avatarFallback = name!.charAt(0).toUpperCase();

   return (
      <DropdownMenu>
         <DropdownMenuTrigger className="relative outline-none">
            <Avatar className="size-10 rounded-md transition hover:opacity-75">
               <AvatarImage className="rounded-md" alt={name} src={image} />
               <AvatarFallback className="rounded-md bg-sky-500 text-xs text-white">
                  {avatarFallback}
               </AvatarFallback>
            </Avatar>
         </DropdownMenuTrigger>

         <DropdownMenuContent align="center" side="right" className="w-60">
            <DropdownMenuItem onClick={signOut} className="cursor-pointer">
               <LogOut className="mr-2 size-4" />
               Log out
            </DropdownMenuItem>
         </DropdownMenuContent>
      </DropdownMenu>
   );
}
