'use client';

import { Button } from '@/components/ui/button';
import {
   CommandDialog,
   CommandEmpty,
   CommandGroup,
   CommandInput,
   CommandItem,
   CommandList,
   CommandSeparator,
} from '@/components/ui/command';
import { useGetChannels } from '@/features/channels/api/use-get-channels';
import { useGetMembers } from '@/features/members/api/use-get-members';
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspaceId';
import { Info, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Toolbar() {
   const workspaceId = useWorkspaceId();
   const router = useRouter();
   const [open, setOpen] = useState(false);

   const { data } = useGetWorkspace({ id: workspaceId });
   const { data: channels } = useGetChannels({ workspaceId });
   const { data: members } = useGetMembers({ workspaceId });

   function onSelectChannel(channelId: string) {
      setOpen(false);
      router.push(`/workspace/${workspaceId}/channel/${channelId}`);
   }

   function onSelectMember(memberId: string) {
      setOpen(false);
      router.push(`/workspace/${workspaceId}/member/${memberId}`);
   }

   return (
      <nav className="flex h-10 items-center justify-between bg-[#481349] p-1.5">
         <div className="flex-1" />
         <div className="max-[642px] min-w-[280px] shrink grow-[2]">
            <Button
               onClick={() => {
                  setOpen(true);
               }}
               size="sm"
               className="hover:bg-accent-25 h-7 w-full justify-start bg-accent/25 px-2"
            >
               <Search className="mr-2 size-4 text-white" />
               <span className="text-xs text-white">Search {data?.name}</span>
            </Button>

            <CommandDialog open={open} onOpenChange={setOpen}>
               <CommandInput placeholder="Type a command or search..." />
               <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup heading="Channels">
                     {channels?.map((channel) => (
                        <CommandItem
                           key={channel._id}
                           onSelect={() => onSelectChannel(channel._id)}
                        >
                           <span>{channel.name}</span>
                        </CommandItem>
                     ))}
                  </CommandGroup>
                  <CommandSeparator />
                  <CommandGroup heading="Members">
                     {members?.map((member) => (
                        <CommandItem
                           key={member._id}
                           onSelect={() => onSelectMember(member._id)}
                        >
                           <span>{member.user.name}</span>
                        </CommandItem>
                     ))}
                  </CommandGroup>
               </CommandList>
            </CommandDialog>
         </div>

         <div className="ml-auto flex flex-1 items-center justify-end">
            <Button variant="transparent" size="iconSm">
               <Info className="size-5 text-white" />
            </Button>
         </div>
      </nav>
   );
}
