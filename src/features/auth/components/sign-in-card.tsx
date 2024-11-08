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
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';

type Props = {
   setState: (state: SignInFlow) => void;
};

export default function SignInCard({ setState }: Props) {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');

   return (
      <Card className="h-full w-full p-8">
         <CardHeader className="px-0 pt-0">
            <CardTitle>Login to continue</CardTitle>
            <CardDescription>
               Use your email or another service to continue
            </CardDescription>
         </CardHeader>

         <CardContent className="space-y-5 px-0 pb-0">
            <form className="space-y-2.5">
               <Input
                  className=""
                  disabled={false}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email"
                  type="email"
                  required
               />
               <Input
                  className=""
                  disabled={false}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="passoword"
                  type="passoword"
                  required
               />
               <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={false}
               >
                  Continue
               </Button>
            </form>
            <Separator />
            <div>
               <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {}}
                  disabled={false}
                  className="relative w-full"
               >
                  <FcGoogle className="absolute left-2.5 top-3 size-5" />
                  Contiue with Google
               </Button>
            </div>

            <p className="text-xs text-muted-foreground">
               Don&apos;t have an account ?
               <span
                  onClick={() => setState('signUp')}
                  className="cursor-pointer text-sky-700 hover:underline"
               >
                  {' '}
                  Sign up
               </span>
            </p>
         </CardContent>
      </Card>
   );
}
