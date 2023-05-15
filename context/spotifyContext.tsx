'use client'
import { useSession } from 'next-auth/react'
import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react'
import useSpotify from '../hooks/useSpotify'

type SpotifyContextType = {
    playlists: SpotifyApi.PlaylistObjectSimplified[] | undefined
    selectedPlaylist: SpotifyApi.PlaylistObjectSimplified | undefined
    changeSelectedPlaylist: (
        newPlaylist: SpotifyApi.PlaylistObjectSimplified
    ) => void
    playlistTracks: SpotifyApi.PlaylistTrackObject[] | undefined
}

const SpotifyContext = createContext<SpotifyContextType>({
    playlists: [],
    selectedPlaylist: undefined,
    changeSelectedPlaylist: () => {},
    playlistTracks: [],
})

export const SpotifyContextProvider: React.FC<{
    children: React.ReactNode
}> = ({ children }) => {
    const { data: session } = useSession()

    const spotifyClient = useSpotify()
    console.log(spotifyClient.getAccessToken())

    const [playlists, setPlaylists] = useState<
        SpotifyApi.PlaylistObjectSimplified[]
    >([])

    const [selectedPlaylist, setSelectedPlaylist] = useState<
        SpotifyApi.PlaylistObjectSimplified | undefined
    >(undefined)

    const [playlistTracks, setPlaylistTracks] =
        useState<SpotifyApi.PlaylistTrackObject[]>()

    const changeSelectedPlaylist = (
        newPlaylist: SpotifyApi.PlaylistObjectSimplified
    ) => {
        setSelectedPlaylist(newPlaylist)
    }

    // fetch playlists on initial log
    useEffect(() => {
        if (session) {
            spotifyClient
                .getUserPlaylists()
                .then((res) => setPlaylists(res.body.items))
        }
        console.log(playlists)
    }, [session, spotifyClient, playlists])

    // Set first playlist as default on initial log
    useEffect(() => {
        if (session) {
            if (
                typeof selectedPlaylist === 'undefined' &&
                playlists.length > 0
            ) {
                setSelectedPlaylist(playlists[0])
            }
        }
    }, [playlists, selectedPlaylist, session])

    // fetch tracks
    useEffect(() => {
        if (session) {
            if (typeof selectedPlaylist !== 'undefined') {
                spotifyClient
                    .getPlaylistTracks(selectedPlaylist.id)
                    .then((res) => setPlaylistTracks(res.body.items))
            }
        }
    })

    const providerData = useMemo(
        () => ({
            playlists,
            selectedPlaylist,
            changeSelectedPlaylist,
            playlistTracks,
        }),
        [playlists, selectedPlaylist, playlistTracks]
    )

    return (
        <SpotifyContext.Provider value={providerData}>
            {children}
        </SpotifyContext.Provider>
    )
}

export default SpotifyContext

export const useSpotifyContext = () =>
    useContext<SpotifyContextType>(SpotifyContext)
