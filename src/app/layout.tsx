import Sidebar from '../components/organisms/Sidebar'
import Providers from '../../providers/providers'
import './globals.css'
import { Inter } from 'next/font/google'

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
            <body
                className={`flex w-screen h-screen ${inter.className} overflow-hidden`}
            >
                <Providers>
                    <Sidebar />
                    <div className="flex-grow">{children}</div>
                </Providers>
            </body>
        </html>
    )
}
