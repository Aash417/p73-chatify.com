import UserButton from '@/features/auth/components/user-button';
import WorkspaceSwitcher from '@/features/workspaces/components/workspace-switcher';
import { Bell, Home, MessagesSquare, MoreHorizontal } from 'lucide-react';
import SidebarButton from './sidebar-button';

export default function Sidebar() {
   return (
      <aside className="flex w-[70px] flex-col items-center gap-y-4 bg-[#481349] pb-4 pt-[9px]">
         <div className=""></div>
         <WorkspaceSwitcher />
         <SidebarButton icon={Home} label="home" isActive />
         <SidebarButton icon={MessagesSquare} label="DMs" />
         <SidebarButton icon={Bell} label="Activity" />
         <SidebarButton icon={MoreHorizontal} label="More" />

         <div className="mt-auto flex flex-col items-center justify-center gap-y-1">
            <UserButton />
         </div>
      </aside>
   );
}
