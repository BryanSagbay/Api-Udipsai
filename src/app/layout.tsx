import { Inter } from 'next/font/google'
import type { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Auth Nextjs 13',
  description: 'Sistema de autenticacion con Nextjs 13'
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout ({ children }: RootLayoutProps) {
  return (
    <html lang='en'>
      <h1> API</h1>
    </html>
  )
}
