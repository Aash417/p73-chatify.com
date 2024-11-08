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

export default function SignUpCard({ setState }: Props) {
   const { signIn } = useAuthActions();
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');

   const [pending, setPending] = useState(false);
   const [error, setError] = useState('');

   function onProviderSignUp() {
      setPending(true);
      signIn('google').finally(() => {
         setPending(false);
      });
   }
   function onPasswordSignUp(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();

      if (password !== confirmPassword) {
         setError('Password do not match');
         return;
      }

      setPending(true);
      signIn('password', { email, password, flow: 'signUp' })
         .catch(() => {
            setError('Something went wrong');
         })
         .finally(() => {
            setPending(false);
         });
   }

   return (
      <Card className="h-full w-full p-8">
         <CardHeader className="px-0 pt-0">
            <CardTitle>Sign up to continue</CardTitle>
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
            <form onSubmit={onPasswordSignUp} className="space-y-2.5">
               <Input
                  className=""
                  disabled={pending}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  type="email"
                  required
               />{' '}
               <Input
                  className=""
                  disabled={pending}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Passoword"
                  type="password"
                  required
               />
               <Input
                  className=""
                  disabled={pending}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
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
                  onClick={onProviderSignUp}
                  disabled={pending}
                  className="relative w-full"
               >
                  <FcGoogle className="absolute left-2.5 top-3 size-5" />
                  Contiue with Google
               </Button>
            </div>

            <p className="text-xs text-muted-foreground">
               Already have an account ?
               <span
                  onClick={() => setState('signIn')}
                  className="cursor-pointer text-sky-700 hover:underline"
               >
                  {' '}
                  Sign in
               </span>
            </p>
         </CardContent>
      </Card>
   );
}
