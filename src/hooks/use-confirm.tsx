import { Button } from '@/components/ui/button';
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from '@/components/ui/dialog';
import { useState } from 'react';

export default function useConfirm(
   title: string,
   message: string,
): [() => JSX.Element, () => Promise<unknown>] {
   const [promise, setPromise] = useState<{
      resolve: (value: boolean) => void;
   } | null>(null);

   function confirm() {
      return new Promise((resolve, _reject) => {
         setPromise({ resolve });
      });
   }
   function handleclose() {
      setPromise(null);
   }
   function handleCancel() {
      promise?.resolve(false);
      handleclose();
   }
   function handleConfirm() {
      promise?.resolve(true);
      handleclose();
   }

   function ConfirmDialog() {
      return (
         <Dialog open={promise !== null} onOpenChange={handleCancel}>
            <DialogContent>
               <DialogHeader>
                  <DialogTitle>{title}</DialogTitle>
                  <DialogDescription>{message}</DialogDescription>
               </DialogHeader>
               <DialogFooter>
                  <Button variant="outline" onClick={handleCancel}>
                     Cancel
                  </Button>
                  <Button variant="outline" onClick={handleConfirm}>
                     Confirm
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      );
   }

   return [ConfirmDialog, confirm];
}
