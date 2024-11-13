import Hint from '@/components/hint';
import { Button } from '@/components/ui/button';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, ListFilter, SquarePen } from 'lucide-react';
import { useState } from 'react';
import { Doc } from '../../../../convex/_generated/dataModel';
import PreferencesModal from './preferences-modal';

type Props = {
   workspace: Doc<'workspaces'>;
   isAdmin: boolean;
};

export default function WorkspaceHeader({ workspace, isAdmin }: Props) {
   const [preferencesOpen, setPreferencesOpen] = useState(false);

   return (
      <>
         <PreferencesModal
            open={preferencesOpen}
            setOpen={setPreferencesOpen}
            initialValue={workspace.name}
         />
         <div className="flex h-[49px] items-center justify-between gap-0.5 px-4">
            <DropdownMenu>
               <DropdownMenuTrigger asChild>
                  <Button
                     variant="transparent"
                     size="sm"
                     className="w-auto overflow-hidden p-1.5 text-lg font-semibold"
                  >
                     <span className="truncate">{workspace.name}</span>
                     <ChevronDown className="ml-1 size-4 shrink-0" />
                  </Button>
               </DropdownMenuTrigger>

               <DropdownMenuContent
                  side="bottom"
                  align="start"
                  className="w-64"
               >
                  <DropdownMenuItem>
                     <div className="relative mr-2 flex size-9 items-center justify-center overflow-hidden rounded-md bg-[#616061] text-xl font-semibold text-white">
                        {workspace.name.charAt(0).toUpperCase()}
                     </div>
                     <div className="flex flex-col items-start">
                        <p className="font-bold">{workspace.name}</p>
                        <p className="text-xs text-muted-foreground">
                           Active workspace
                        </p>
                     </div>
                  </DropdownMenuItem>

                  {isAdmin && (
                     <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                           className="cursor-pointer py-2"
                           onClick={() => { }}
                        >
                           Invite people to {workspace.name}
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                           className="cursor-pointer py-2"
                           onClick={() => setPreferencesOpen(true)}
                        >
                           Prefrences
                        </DropdownMenuItem>
                     </>
                  )}
               </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex items-center gap-0.5">
               <Hint label="Filter" side="bottom">
                  <Button variant="transparent" size="iconSm">
                     <ListFilter className="size-4" />
                  </Button>
               </Hint>
               <Hint label="New message" side="bottom">
                  <Button variant="transparent" size="iconSm">
                     <SquarePen className="size-4" />
                  </Button>
               </Hint>
            </div>
         </div>
      </>
   );
}