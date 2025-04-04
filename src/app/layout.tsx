import './globals.css'
import { Inter } from 'next/font/google'
import ClientLayout from '@/components/ClientLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'Tennis Unterwössen',
    description: 'Tennisplatz-Buchung',
    icons: {
        icon: [
            { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
            { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
        ],
        apple: { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    },
    manifest: '/site.webmanifest'
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="de">
        <body className={inter.className}>
        <ClientLayout>
            {children}
        </ClientLayout>
        </body>
        </html>
    )
}