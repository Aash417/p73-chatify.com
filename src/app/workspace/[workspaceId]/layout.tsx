'use client';

import Toolbar from './toolbar';

type Props = { children: React.ReactNode };

export default function Layout({ children }: Props) {
   return (
      <div className="h-full bg-red-200">
         <Toolbar />
         {children}
      </div>
   );
}
