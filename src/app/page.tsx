'use client';

import { Button } from '@/components/ui/button';
import { useAuthActions } from '@convex-dev/auth/react';

export default function Home() {
   const { signOut } = useAuthActions();

   return (
      <div>
         Loged in
         <Button variant="destructive" onClick={signOut}>
            Log out
         </Button>
      </div>
   );
}
