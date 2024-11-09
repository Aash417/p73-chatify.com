import { Button } from '@/components/ui/button';
import { useWorkspaceId } from '@/features/hooks/use-workspaceId';
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace';
import { Info, Search } from 'lucide-react';

export default function Toolbar() {
   const workspaceId = useWorkspaceId();
   const { data } = useGetWorkspace({ id: workspaceId });
   return (
      <nav className="flex h-10 items-center justify-between bg-[#481349] p-1.5">
         <div className="flex-1" />
         <div className="max-[642px] min-w-[280px] shrink grow-[2]">
            <Button
               size="sm"
               className="hover:bg-accent-25 h-7 w-full justify-start bg-accent/25 px-2"
            >
               <Search className="mr-2 size-4 text-white" />
               <span className="text-xs text-white">Search {data?.name}</span>
            </Button>
         </div>

         <div className="ml-auto flex flex-1 items-center justify-end">
            <Button variant="transparent" size="iconSm">
               <Info className="size-5 text-white" />
            </Button>
         </div>
      </nav>
   );
}
