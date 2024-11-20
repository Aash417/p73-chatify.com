import { cn } from '@/lib/utils';
import { TriangleAlertIcon } from 'lucide-react';

type Props = { message: string; color?: string };

export default function TriangleAlert({ message, color }: Readonly<Props>) {
   return (
      <div className="flex h-full flex-col items-center justify-center gap-y-2">
         <TriangleAlertIcon className={cn('size-5', color)} />
         <p className={cn('text-sm', color)}>{message}</p>
      </div>
   );
}
