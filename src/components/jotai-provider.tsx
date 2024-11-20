'use client';

import { Provider } from 'jotai';

type Props = { children: React.ReactNode };

export default function JotaiProvider({ children }: Readonly<Props>) {
   return <Provider>{children}</Provider>;
}
