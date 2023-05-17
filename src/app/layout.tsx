import { Inter } from 'next/font/google'
import './globals.css'
import Providers from '../../providers/providers'
import Sidebar from '@/components/organisms/Sidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'Spotify Clone',
    description: 'Spotify clone created by Grzegorz Skrabucha',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={`${inter.className}`}>
                <Providers>
                    <div>{children}</div>
                </Providers>
            </body>
        </html>
    )
}
