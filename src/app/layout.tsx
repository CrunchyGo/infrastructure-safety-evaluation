import React from 'react'
import { Toaster } from "react-hot-toast";
import { Metadata } from 'next'
import { ReactQueryProvider } from '@/lib/ReactQueryProvider'
import './global.css'
import { Open_Sans } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import RouterAuth from '@/components/RouterAuth';

export const metadata: Metadata = {
  title: "Infrastructure Safety Evaluation (ISE)",
  description: "Infrastructure Safety Evaluation (ISE)",
  icons: {
    icon: '/favicon.ico',
  },
}

const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-opensans',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <head></head>
      <body
        className={`${openSans.variable} font-sans`}
        suppressHydrationWarning={true}
      >
        <ReactQueryProvider>
          <NextTopLoader showSpinner={false} color='#8fd2d9' />

          <Toaster position="top-right" />
          <RouterAuth>
            {children}
          </RouterAuth>
        </ReactQueryProvider>
      </body>
    </html>
  )
}