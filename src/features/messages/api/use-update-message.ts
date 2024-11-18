import { useMutation } from 'convex/react';
import { useCallback, useMemo, useState } from 'react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';

type Options = {
   onSuccess?: (data: ResponseType) => void;
   onError?: (error: Error) => void;
   onSettled?: () => void;
   throwError?: boolean;
};

type RequestType = {
   id: Id<'messages'>;
   body: string;
};
type ResponseType = Id<'messages'> | null;

export function useUpdateMessage() {
   const [data, setData] = useState<ResponseType>(null);
   const [error, setError] = useState<Error | null>(null);
   const [status, setStatus] = useState<
      'success' | 'error' | 'settled' | 'pending' | null
   >(null);

   const isError = useMemo(() => status === 'error', [status]);
   const isPending = useMemo(() => status === 'pending', [status]);
   const isSuccess = useMemo(() => status === 'success', [status]);
   const isSettled = useMemo(() => status === 'settled', [status]);

   const mutation = useMutation(api.messages.update);

   const mutate = useCallback(
      async (values: RequestType, options?: Options) => {
         try {
            setData(null);
            setError(null);
            setStatus('pending');

            const response = await mutation(values);
            options?.onSuccess?.(response);

            return response;
         } catch (error) {
            setStatus('error');
            options?.onError?.(error as Error);
            if (options?.throwError) throw error;
         } finally {
            setStatus('settled');
            options?.onSettled?.();
         }
      },
      [mutation],
   );

   return { mutate, isPending, isSuccess, isError, isSettled, data };
}