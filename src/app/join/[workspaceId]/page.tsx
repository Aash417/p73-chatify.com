'use client';

import { Button } from '@/components/ui/button';
import { useGetWorkspaceInfo } from '@/features/workspaces/api/use-get-workspaceInfo';
import { useJoin } from '@/features/workspaces/api/use-join';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspaceId';
import { cn } from '@/lib/utils';
import { Loader } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import VerificationInput from 'react-verification-input';
import { toast } from 'sonner';

export default function Page() {
   const workspaceId = useWorkspaceId();
   const router = useRouter();
   const { data, isLoading } = useGetWorkspaceInfo({ id: workspaceId });
   const { mutate, isPending } = useJoin();
   const isMember = useMemo(() => data?.isMember, [data?.isMember]);

   useEffect(() => {
      if (isMember) router.push(`/workspace/${workspaceId}`);
   }, [isMember, router, workspaceId]);

   function handleComplete(value: string) {
      mutate(
         { workspaceId, joinCode: value },
         {
            onSuccess: (id) => {
               router.replace(`/workspace/${id}`);
               toast.success('Workspace joined');
            },
            onError: () => {
               toast.error('Failed to join workspace');
            },
         },
      );
   }

   if (isLoading)
      return (
         <div className="flex h-full items-center justify-center">
            <Loader className="size-6 animate-spin text-muted-foreground" />
         </div>
      );

   return (
      <div className="flex h-full flex-col items-center justify-center gap-y-8 rounded-lg bg-white p-8 shadow-md">
         <Image src="/vercel.svg" width={60} height={60} alt="logo" />
         <div className="flex max-w-md flex-col items-center justify-center gap-y-4">
            <div className="flex flex-col items-center justify-center gap-y-2">
               <h1>Join {data?.name}</h1>
               <p>Enter the code to join workspace</p>
            </div>
            <VerificationInput
               onComplete={handleComplete}
               autoFocus
               length={6}
               classNames={{
                  container: cn(
                     'flex gap-x-2',
                     isPending && 'opacity-50 cursor-not-allowed',
                  ),
                  character:
                     'uppercase h-auto rounded-md border border-gray-300 flex items-center justify-center text-lg font-medium text-gray-500',
                  characterInactive: 'bg-muted',
                  characterSelected: 'bg-white text-black',
                  characterFilled: 'bg-white text-black',
               }}
            />
         </div>

         <div className="flex gap-x-4">
            <Button size="lg" variant="outline" asChild>
               <Link href="/">Back to home</Link>
            </Button>
         </div>
      </div>
   );
}
