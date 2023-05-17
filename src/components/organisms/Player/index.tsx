'use client'
import React from 'react'
import { useSpotifyContext } from '../../../../context/spotifyContext'
import {
    AiFillPlayCircle as PlayIcon,
    AiFillPauseCircle as PauseIcon,
} from 'react-icons/ai'
import { RxShuffle as ShuffleIcon } from 'react-icons/rx'
import { BsRepeat as RepeatIcon } from 'react-icons/bs'
import {
    MdSkipNext as NextIcon,
    MdSkipPrevious as PreviousIcon,
} from 'react-icons/md'
import useSpotify from '../../../../hooks/useSpotify'
import Image from 'next/image'
import { motion } from 'framer-motion'
import clsx from 'clsx'

const Player: React.FC = () => {
    const {
        currentSong,
        isPlaying,
        changePlayingStatus,
        shuffle,
        repeat,
        changeRepeatMode,
        changeShuffleMode,
        volume,
        changeVolume,
    } = useSpotifyContext()
    const spotifyClient = useSpotify()
    const artists = currentSong?.artists.map((artist) => artist.name).join(', ')

    return (
        <div className="fixed bottom-0 left-0 w-screen h-[100px] bg-black border-t border-gray-700 py-4 px-8">
            <div className="grid h-full grid-cols-3 place-content-center">
                <div className="flex items-center space-x-4">
                    <motion.div
                        animate={{
                            rotateZ: 360,
                            transition: {
                                duration: 20,
                                delay: 0,
                                repeat: Infinity,
                            },
                        }}
                    >
                        <Image
                            src={currentSong?.album.images[0].url!}
                            alt="album image"
                            className="object-cover rounded-full"
                            width={70}
                            height={70}
                        />
                    </motion.div>
                    <div className="w-2/3">
                        <p className="font-semibold truncate">
                            {currentSong?.name}
                        </p>
                        <p className="truncate text-slate-400">{artists}</p>
                    </div>
                </div>
                <div className="flex items-center justify-center space-x-12 ">
                    <ShuffleIcon
                        size={22}
                        color={shuffle ? '#16a34a' : '#fff'}
                        className="cursor-pointer"
                        onClick={changeShuffleMode}
                    />
                    <PreviousIcon
                        size={40}
                        onClick={() => spotifyClient.skipToPrevious()}
                        className="cursor-pointer"
                    />
                    {!isPlaying ? (
                        <PlayIcon
                            size={40}
                            onClick={changePlayingStatus}
                            className="cursor-pointer"
                        />
                    ) : (
                        <PauseIcon
                            size={40}
                            onClick={changePlayingStatus}
                            className="cursor-pointer"
                        />
                    )}

                    <NextIcon
                        size={40}
                        onClick={() => spotifyClient.skipToNext()}
                        className="cursor-pointer"
                    />
                    <RepeatIcon
                        size={22}
                        color={repeat ? '#16a34a' : '#fff'}
                        onClick={changeRepeatMode}
                    />
                </div>
                <div className="flex items-center justify-end">
                    <input
                        value={volume}
                        onChange={(e) => changeVolume(Number(e.target.value))}
                        type="range"
                        min={0}
                        max={100}
                        className="w-[150px]"
                    />
                </div>
            </div>
        </div>
    )
}

export default Player
