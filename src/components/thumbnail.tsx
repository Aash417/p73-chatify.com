import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';

type Props = { url: string | null | undefined };

export default function Thumbnail({ url }: Props) {
   if (!url) return null;

   return (
      <Dialog>
         <DialogTrigger>
            <div className="relative my-2 max-w-[360px] cursor-zoom-in overflow-hidden rounded-lg border">
               <img
                  src={url}
                  alt="Message image"
                  className="size-full rounded-md object-cover"
               />
            </div>
         </DialogTrigger>

         <DialogContent className="max-w-[800px] border-none bg-transparent p-0 shadow-none">
            <img
               src={url}
               alt="Message image"
               className="size-full rounded-md object-cover"
            />
         </DialogContent>
      </Dialog>
   );
}
