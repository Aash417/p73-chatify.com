'use client';

import Toolbar from '@/components/toolbar';
import Sidebar from '@/components/sidebar';

type Props = { children: React.ReactNode };

export default function Layout({ children }: Props) {
   return (
      <div className="h-full bg-red-200">
         <Toolbar />
         <div className="flex h-[calc(100vh-40px)]">
            <Sidebar />

            {children}
         </div>
      </div>
   );
}
