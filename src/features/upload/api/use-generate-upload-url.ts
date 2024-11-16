import { useMutation } from 'convex/react';
import { useCallback, useMemo, useState } from 'react';
import { api } from '../../../../convex/_generated/api';

type Options = {
   onSuccess?: (data: string | null) => void;
   onError?: (error: Error) => void;
   onSettled?: () => void;
   throwError?: boolean;
};

export function useGenerateUploadUrl() {
   const [data, setData] = useState<string | null>(null);
   const [error, setError] = useState<Error | null>(null);
   const [status, setStatus] = useState<
      'success' | 'error' | 'settled' | 'pending' | null
   >(null);

   const isError = useMemo(() => status === 'error', [status]);
   const isPending = useMemo(() => status === 'pending', [status]);
   const isSuccess = useMemo(() => status === 'success', [status]);
   const isSettled = useMemo(() => status === 'settled', [status]);

   const mutation = useMutation(api.upload.generateUploadUrl);

   const mutate = useCallback(
      async (_values: {}, options?: Options) => {
         try {
            setData(null);
            setError(null);
            setStatus('pending');

            const response = await mutation();
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
