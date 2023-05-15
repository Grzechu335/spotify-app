'use client'
import { signIn, useSession } from 'next-auth/react'
import React, { useEffect, useMemo } from 'react'
import SpotifyWebApi from 'spotify-web-api-node'

const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
const clientSecret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET

const useSpotify = () => {
    const spotifyClient = useMemo(
        () =>
            new SpotifyWebApi({
                clientId,
                clientSecret,
            }),
        []
    )
    const { data: session } = useSession()
    useEffect(() => {
        if (session) {
            if (session.error === 'RefreshAccessTokenError') {
                signIn()
            }
            spotifyClient.setAccessToken(session.accessToken!)
        }
    }, [session, spotifyClient])
    return spotifyClient
}

export default useSpotify
