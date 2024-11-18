'use client';

import Sidebar from '@/components/sidebar';
import Toolbar from '@/features/workspaces/components/toolbar';
import {
   ResizableHandle,
   ResizablePanel,
   ResizablePanelGroup,
} from '@/components/ui/resizable';
import WorkspaceSidebar from '@/features/workspaces/components/workspace-sidebar';

type Props = { children: React.ReactNode };

export default function Layout({ children }: Props) {
   return (
      <div className="h-full bg-red-100">
         <Toolbar />
         <div className="flex h-[calc(100vh-40px)]">
            <Sidebar />

            <ResizablePanelGroup
               direction="horizontal"
               autoSaveId="ca-workspace-layout"
            >
               <ResizablePanel
                  defaultSize={20}
                  minSize={11}
                  className="bg-[#5E2C5F]"
               >
                  <WorkspaceSidebar />
               </ResizablePanel>
               <ResizableHandle withHandle />
               <ResizablePanel minSize={11}>{children}</ResizablePanel>
            </ResizablePanelGroup>
         </div>
      </div>
   );
}
