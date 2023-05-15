'use client'
import React from 'react'
import { useSpotifyContext } from '../../../../context/spotifyContext'
import clsx from 'clsx'

const Sidebar: React.FC = () => {
    const { playlists, changeSelectedPlaylist, selectedPlaylist } =
        useSpotifyContext()
    return (
        <aside className="w-[20vw] p-4 border-r border-r-gray-700">
            <ul className="flex flex-col space-y-4">
                {playlists?.map((playlist) => (
                    <li
                        className={clsx(
                            'h-6 truncate text-slate-500 hover:text-slate-300',
                            {
                                '': playlist.id === selectedPlaylist?.id,
                            }
                        )}
                        key={playlist.id}
                        onClick={() => changeSelectedPlaylist(playlist)}
                    >
                        {playlist.name}
                    </li>
                ))}
            </ul>
        </aside>
    )
}

export default Sidebar
