'use client'
import AppProvider from '@/components/app-provider'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { cn } from '@/lib/utils'
import { Inter as FontSans } from 'next/font/google'
import { CartProvider } from '@/components/cart-provider'
import { useAppContext } from '@/components/app-provider'
import { Header } from '@/components/header'
const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans'
})


export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const { guest } = useAppContext();
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
        <AppProvider>
          <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
            <CartProvider tableId={guest?.table?._id || ''} guestId={guest?._id || ''}>
              <Header />
              {children}
            </CartProvider>
            <Toaster />
          </ThemeProvider>
        </AppProvider>
      </body>
    </html>
  )
}

