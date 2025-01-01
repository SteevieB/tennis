import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from "@/components/ui/toaster"
import { AuthButton } from '@/components/AuthButton'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'Tennis Court Booking',
    description: 'Book your tennis court easily',
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <AuthButton />
        {children}
        <Toaster />
        </body>
        </html>
    )
}