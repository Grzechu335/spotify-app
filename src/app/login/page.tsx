'use client'
import { getProviders, signIn } from 'next-auth/react'
import Image from 'next/image'
import spotifyIcon from 'public/spotifyIcon.svg'

const Login = async () => {
    const providers = await getProviders()
    return (
        <div className="grid w-screen h-screen gap-20 place-content-center">
            <Image
                src={spotifyIcon}
                alt="spotify logo"
                width={200}
                height={200}
            />
            {!providers
                ? []
                : Object.values(providers).map((provider) => (
                      <button
                          className="px-4 py-2 border rounded-full border-slate-500"
                          key={provider.id}
                          onClick={() => signIn(provider.id)}
                      >
                          Log in with Spotify Client
                      </button>
                  ))}
        </div>
    )
}

export default Login
