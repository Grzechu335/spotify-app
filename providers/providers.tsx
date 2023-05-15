'use client'
import { SessionProvider } from 'next-auth/react'
import React from 'react'
import { SpotifyContextProvider } from '../context/spotifyContext'

const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <SessionProvider>
            <SpotifyContextProvider>{children}</SpotifyContextProvider>
        </SessionProvider>
    )
}

export default Providers
