'use client'
import User from '@/components/molecules/User'
import { useSpotifyContext } from '../../context/spotifyContext'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/organisms/Sidebar'
import Dashboard from '@/components/organisms/Dashboard'
import Player from '@/components/organisms/Player'

export default function Home() {
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            redirect('/login')
        },
    })
    // TODO: Add loading skeleton
    if (status === 'loading') return <p>Loading...</p>

    return (
        <div className="flex w-screen h-screen overflow-hidden">
            <Sidebar />
            <Dashboard />
            <Player />
        </div>
    )
}
