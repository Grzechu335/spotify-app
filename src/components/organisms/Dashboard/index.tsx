import TrackItem from '@/components/atoms/TrackItem'
import User from '@/components/molecules/User'
import Image from 'next/image'
import React from 'react'
import { useSpotifyContext } from '../../../../context/spotifyContext'
import { HiOutlineClock as DurationIcon } from 'react-icons/hi'

const Dashboard: React.FC = () => {
    const { playlistTracks, selectedPlaylist } = useSpotifyContext()
    return (
        <div className="relative flex-grow p-4 overflow-y-scroll">
            <User />
            <div className="flex items-center space-x-10">
                {selectedPlaylist?.images[0].url && (
                    <Image
                        src={selectedPlaylist?.images[0]?.url!}
                        alt="album image"
                        className="object-cover rounded"
                        width={250}
                        height={250}
                    />
                )}
                <div className="flex flex-col space-y-4">
                    <h2 className="text-2xl uppercase">Playlist</h2>
                    <h3 className="text-xl font-semibold">
                        {selectedPlaylist?.name}
                    </h3>
                </div>
            </div>
            <div className="grid grid-cols-12 mb-4">
                <p className="grid col-span-1 place-content-center">#</p>
                <p className="col-span-5 ml-2">Title</p>
                <p className="col-span-5">Album</p>
                <div className="flex items-center justify-center">
                    <DurationIcon
                        className="col-span-1"
                        size={20}
                    />
                </div>
            </div>
            <div className="flex flex-col space-y-4 pb-[120px]">
                {playlistTracks?.map((track, idx) => (
                    <TrackItem
                        key={idx}
                        {...track}
                        idx={idx}
                    />
                ))}
            </div>
        </div>
    )
}

export default Dashboard
