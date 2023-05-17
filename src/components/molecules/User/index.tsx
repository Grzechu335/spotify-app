'use client'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import React from 'react'
import { AiOutlineLogout as SingOutIcon } from 'react-icons/ai'
import useSpotify from '../../../../hooks/useSpotify'

const User: React.FC = () => {
    const { data: session } = useSession()
    const spotifyClient = useSpotify()
    return (
        <div className="absolute h-14 text-white top-10 border p-2 border-slate-700 right-10 z-[9999] rounded-full flex items-center space-x-3">
            <Image
                width={50}
                height={50}
                className="rounded-full"
                alt="user image"
                src={session?.user?.image!}
            />
            <p>{session?.user?.name}</p>
            <SingOutIcon
                size={30}
                fill="#94a3b8"
                onClick={() => {
                    signOut()
                }}
                className="cursor-pointer"
            />
        </div>
    )
}

export default User
