'use client'
import React from 'react'
import { useSpotifyContext } from '../../../context/spotifyContext'

type Props = {}

const Dashboard: React.FC = (props: Props) => {
    const { playlistTracks, selectedPlaylist } = useSpotifyContext()
    return (
        <div className="">
            {playlistTracks?.map((track) => (
                <div key={track.track?.id}>{track.track?.name}</div>
            ))}
        </div>
    )
}

export default Dashboard
