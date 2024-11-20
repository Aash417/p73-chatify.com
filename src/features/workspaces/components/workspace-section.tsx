import Hint from '@/components/hint';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PlusIcon } from 'lucide-react';
import { FaCaretDown } from 'react-icons/fa';
import { useToggle } from 'react-use';

type Props = {
   children: React.ReactNode;
   label: string;
   hint: string;
   onNew?: () => void;
};

export default function WorkspaceSection({
   label,
   hint,
   onNew,
   children,
}: Readonly<Props>) {
   const [on, toggle] = useToggle(true);

   return (
      <div className="mt-3 flex flex-col px-2">
         <div className="group flex items-center px-3.5">
            <Button
               className="size-6 shrink-0 p-0.5 text-sm text-[#f9edffcc]"
               variant="transparent"
               onClick={toggle}
            >
               <FaCaretDown
                  className={cn(
                     'size-4 transition-transform',
                     on && '-rotate-90',
                  )}
               />
            </Button>

            <Button
               className="group h-[28px] items-center justify-start overflow-hidden px-1.5 text-sm text-[#f9edffcc]"
               variant="transparent"
               size="sm"
            >
               <span className="truncate">{label}</span>
            </Button>
            {onNew && (
               <Hint label={hint} side="top" align="center">
                  <Button
                     onClick={onNew}
                     className="ml-auto size-6 shrink-0 p-0.5 text-sm text-[#f9edffcc] opacity-0 transition-opacity group-hover:opacity-100"
                     variant="transparent"
                     size="iconSm"
                  >
                     <PlusIcon className="size-5" />
                  </Button>
               </Hint>
            )}
         </div>
         {on && children}
      </div>
   );
}
