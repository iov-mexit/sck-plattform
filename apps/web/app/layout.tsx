import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { WalletProvider } from '@/components/wallet-provider'
import { AuthProvider } from '@/lib/auth/auth-context'
import { QueryClientProviderWrapper } from '@/lib/providers/query-client-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Secure Code KnAIght - Role Agent Platform',
description: 'Enterprise Role Agent Management Platform with Blockchain Integration',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryClientProviderWrapper>
          <WalletProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </WalletProvider>
        </QueryClientProviderWrapper>
      </body>
    </html>
  )
} 