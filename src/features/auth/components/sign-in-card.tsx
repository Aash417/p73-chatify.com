import { Button } from '@/components/ui/button';
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { SignInFlow } from '@/features/auth/types';
import { useAuthActions } from '@convex-dev/auth/react';
import { TriangleAlert } from 'lucide-react';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';

type Props = {
   setState: (state: SignInFlow) => void;
};

export default function SignInCard({ setState }: Readonly<Props>) {
   const { signIn } = useAuthActions();
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [pending, setPending] = useState(false);
   const [error, setError] = useState('');

   function onProviderSignIn() {
      setPending(true);
      signIn('google').finally(() => {
         setPending(false);
      });
   }

   function onPasswordSignIn(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
      setPending(true);
      signIn('password', { email, password, flow: 'signIn' })
         .catch(() => {
            setError('Invalid email or password');
         })
         .finally(() => {
            setPending(false);
         });
   }

   return (
      <Card className="h-full w-full p-8">
         <CardHeader className="px-0 pt-0">
            <CardTitle>Login to continue</CardTitle>
            <CardDescription>
               Use your email or another service to continue
            </CardDescription>
         </CardHeader>

         {!!error && (
            <div className="mb-6 flex items-center gap-x-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
               <TriangleAlert className="size-4" />
               <p>{error}</p>
            </div>
         )}

         <CardContent className="space-y-5 px-0 pb-0">
            <form onSubmit={onPasswordSignIn} className="space-y-2.5">
               <Input
                  className=""
                  disabled={pending}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email"
                  type="email"
                  required
               />
               <Input
                  className=""
                  disabled={pending}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="password"
                  type="password"
                  required
               />
               <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={pending}
               >
                  Continue
               </Button>
            </form>

            <Separator />

            <div>
               <Button
                  variant="outline"
                  size="lg"
                  onClick={onProviderSignIn}
                  disabled={pending}
                  className="relative w-full"
               >
                  <FcGoogle className="absolute left-2.5 top-3 size-5" />
                  Continue with Google
               </Button>
            </div>

            <p className="text-xs text-muted-foreground">
               Don&apos;t have an account ?
               <span
                  onClick={() => setState('signUp')}
                  className="cursor-pointer text-sky-700 hover:underline"
               >
                  Sign up
               </span>
            </p>
         </CardContent>
      </Card>
   );
}
