'use client'

import { signIn, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import useSpotify from '../../hooks/useSpotify'
import { useEffect, useState } from 'react'
export default function Home() {
    const [playlists, setPlaylists] = useState<
        SpotifyApi.PlaylistObjectSimplified[]
    >([])
    const { data: session } = useSession()
    const spotifyClient = useSpotify()
    useEffect(() => {
        async function getPlaylist() {
            const playlistsResponse = await spotifyClient
                .getUserPlaylists()
                .then((res) => setPlaylists(res.body.items))
        }
        if (session) {
            getPlaylist()
        }
    }, [session, spotifyClient])
    return (
        <div>
            {!session ? (
                <button onClick={() => signIn()}>Sign In</button>
            ) : (
                <button onClick={() => signOut()}>Sign out</button>
            )}

            <button onClick={() => spotifyClient.play()}>Play</button>
            <button onClick={() => spotifyClient.pause()}>Pause</button>
            <button onClick={() => spotifyClient.skipToPrevious()}>
                Previous Track
            </button>
            <button onClick={() => spotifyClient.skipToNext()}>
                Next track
            </button>

            {session && (
                <Image
                    src={session.user?.image!}
                    alt="user image"
                    width={100}
                    height={100}
                />
            )}
            {playlists.map((playlist) => (
                <p key={playlist.id}>{playlist.name}</p>
            ))}
        </div>
    )
}
