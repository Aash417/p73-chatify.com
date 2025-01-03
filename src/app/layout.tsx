import { ConvexClientProvider } from '@/components/ConvexClientProvider';
import JotaiProvider from '@/components/jotai-provider';
import Modals from '@/components/modal';
import { Toaster } from '@/components/ui/sonner';
import { ConvexAuthNextjsServerProvider } from '@convex-dev/auth/nextjs/server';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import './globals.css';
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
   title: 'chatify.com',
   description: 'Group chat with friends',
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <ConvexAuthNextjsServerProvider>
         <html lang="en">
            <body className={inter.className}>
               <ConvexClientProvider>
                  <JotaiProvider>
                     <Analytics />
                     <Modals />
                     <Toaster />
                     <NuqsAdapter>{children}</NuqsAdapter>
                  </JotaiProvider>
               </ConvexClientProvider>
            </body>
         </html>
      </ConvexAuthNextjsServerProvider>
   );
}
