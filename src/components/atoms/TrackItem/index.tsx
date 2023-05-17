'use client'

import React, { useState } from 'react'
import { millisToMinutesAndSeconds } from '../../../../utils/millisToMinutesAndSeconds'
import useSpotify from '../../../../hooks/useSpotify'
import { useSpotifyContext } from '../../../../context/spotifyContext'
import { BsFillPlayFill as PlayIcon } from 'react-icons/bs'
import Image from 'next/image'

interface TrackItemProps extends SpotifyApi.PlaylistTrackObject {
    idx: number
}

const TrackItem: React.FC<TrackItemProps> = ({ track, idx }) => {
    const { changeCurrentSong } = useSpotifyContext()
    const artists = track?.artists.map((artist) => artist.name).join(', ')
    const [playIcon, setPlayIcon] = useState(false)
    return (
        <div
            onClick={() => changeCurrentSong(track!, idx)}
            className="grid grid-cols-12 py-1 transition-colors duration-100 rounded-md cursor-pointer text-slate-500 hover:bg-slate-900 hover:text-white"
            onMouseEnter={() => setPlayIcon(true)}
            onMouseLeave={() => setPlayIcon(false)}
        >
            <div className="grid col-span-1 place-content-center">
                {!playIcon ? <p>{idx + 1}</p> : <PlayIcon size={20} />}
            </div>
            <div className="flex items-center col-span-5 space-x-10">
                <div>
                    <Image
                        width={40}
                        height={40}
                        src={track?.album.images[0].url!}
                        alt={`${track?.album.name} album image`}
                        className="rounded-sm"
                    />
                </div>
                <div className="flex flex-col space-y-[2px]">
                    <p className="font-medium text-white">{track?.name}</p>
                    <p className="">{artists}</p>
                </div>
            </div>
            <p className="flex items-center col-span-5">{track?.album.name}</p>
            <p className="flex items-center justify-center col-span-1">
                {millisToMinutesAndSeconds(track?.duration_ms!)}
            </p>
        </div>
    )
}

export default TrackItem
