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
import { debounce } from 'lodash'
type SpotifyContextType = {
    playlists: SpotifyApi.PlaylistObjectSimplified[] | undefined
    selectedPlaylist: SpotifyApi.PlaylistObjectSimplified | undefined
    changeSelectedPlaylist: (
        newPlaylist: SpotifyApi.PlaylistObjectSimplified
    ) => void
    playlistTracks: SpotifyApi.PlaylistTrackObject[] | undefined
    currentSong: SpotifyApi.TrackObjectFull | undefined
    changeCurrentSong: (
        song: SpotifyApi.TrackObjectFull,
        offset: number
    ) => void
    isPlaying: boolean | undefined
    changePlayingStatus: () => void
    shuffle: boolean | undefined
    changeShuffleMode: () => void
    repeat: boolean | undefined
    changeRepeatMode: () => void
    volume: number | undefined
    changeVolume: (volume: number) => void
}

const SpotifyContext = createContext<SpotifyContextType>({
    playlists: [],
    selectedPlaylist: undefined,
    changeSelectedPlaylist: () => {},
    playlistTracks: [],
    currentSong: undefined,
    changeCurrentSong: () => {},
    isPlaying: undefined,
    changePlayingStatus: () => {},
    shuffle: undefined,
    changeShuffleMode: () => {},
    changeRepeatMode: () => {},
    repeat: undefined,
    volume: undefined,
    changeVolume: () => {},
})

export const SpotifyContextProvider: React.FC<{
    children: React.ReactNode
}> = ({ children }) => {
    const { data: session } = useSession()
    const spotifyClient = useSpotify()

    const [playlists, setPlaylists] = useState<
        SpotifyApi.PlaylistObjectSimplified[]
    >([])

    const [selectedPlaylist, setSelectedPlaylist] = useState<
        SpotifyApi.PlaylistObjectSimplified | undefined
    >(undefined)

    const [playlistTracks, setPlaylistTracks] =
        useState<SpotifyApi.PlaylistTrackObject[]>()

    const [currentSong, setCurrentSong] = useState<
        SpotifyApi.TrackObjectFull | undefined
    >(undefined)

    const [isPlaying, setIsPlaying] = useState<boolean | undefined>(undefined)

    const [shuffle, setShuffle] = useState<boolean | undefined>(undefined)

    const [repeat, setRepeat] = useState<boolean | undefined>(undefined)

    const [volume, setVolume] = useState<number | undefined>(undefined)

    const changeVolume = (newVolume: number) => {
        setVolume(newVolume)
        debounce(() => spotifyClient.setVolume(newVolume), 500)()
    }

    const changeShuffleMode = () => {
        setShuffle((prev) => !prev)
        spotifyClient.setShuffle(!shuffle)
    }

    const changeRepeatMode = () => {
        if (repeat) {
            spotifyClient.setRepeat('off')
            setRepeat(false)
        } else {
            spotifyClient.setRepeat('track')
            setRepeat(true)
        }
    }

    const changePlayingStatus = () => {
        setIsPlaying((prev) => {
            prev ? spotifyClient.pause() : spotifyClient.play()
            return !prev
        })
    }

    useEffect(() => {
        if (typeof isPlaying === 'undefined' && session)
            spotifyClient.getMyCurrentPlaybackState().then((res) => {
                setIsPlaying(res.body.is_playing)
                setShuffle(res.body.shuffle_state)
                setVolume(res.body.device.volume_percent!)
                if (res.body.repeat_state === 'track') setRepeat(true)
                else setRepeat(false)
            })
    }, [spotifyClient, isPlaying, session])

    const changeCurrentSong = (
        song: SpotifyApi.TrackObjectFull,
        offset: number
    ) => {
        setCurrentSong(song)
        spotifyClient.play({
            context_uri: selectedPlaylist?.uri,
            offset: {
                position: offset,
            },
        })
    }

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
    }, [session, spotifyClient])

    // Set first playlist as default on initial log
    useEffect(() => {
        if (
            typeof selectedPlaylist === 'undefined' &&
            playlists.length > 0 &&
            session
        ) {
            setSelectedPlaylist(playlists[0])
        }
    }, [playlists, selectedPlaylist, session])

    // fetch tracks
    useEffect(() => {
        if (typeof selectedPlaylist !== 'undefined' && session) {
            spotifyClient
                .getPlaylistTracks(selectedPlaylist.id)
                .then((res) => setPlaylistTracks(res.body.items))
        }
    }, [selectedPlaylist, spotifyClient, session])

    // useEffect(() => {
    //     if (typeof currentSong !== 'undefined' && session) {
    //         spotifyClient
    //             .getMyCurrentPlayingTrack()
    //             .then((res) => setCurrentSong(res.body.item!))
    //     }
    // }, [currentSong, session, spotifyClient])

    const providerData = useMemo(
        () => ({
            playlists,
            selectedPlaylist,
            changeSelectedPlaylist,
            playlistTracks,
            currentSong,
            changeCurrentSong,
            isPlaying,
            changePlayingStatus,
            shuffle,
            changeShuffleMode,
            repeat,
            changeRepeatMode,
            volume,
            changeVolume,
        }),
        [
            playlists,
            selectedPlaylist,
            playlistTracks,
            currentSong,
            isPlaying,
            shuffle,
            repeat,
            volume,
        ]
    )

    if (!session) {
        return <>{children}</>
    }

    return (
        <SpotifyContext.Provider value={providerData}>
            {children}
        </SpotifyContext.Provider>
    )
}

export const useSpotifyContext = () =>
    useContext<SpotifyContextType>(SpotifyContext)
