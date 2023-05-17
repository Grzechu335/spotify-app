import axios from 'axios'
import NextAuth, { NextAuthOptions } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import SpotifyProvider from 'next-auth/providers/spotify'

const scopes = [
    'user-read-email',
    'playlist-read-private',
    'playlist-read-collaborative',
    'user-read-email',
    'streaming',
    'user-read-private',
    'user-library-read',
    'user-top-read',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'user-read-recently-played',
    'user-follow-read',
].join(',')

const spotifyScopes = new URLSearchParams({
    scope: scopes,
    client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!,
    client_secret: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET!,
})

export const authorizationUrl = `https://accounts.spotify.com/authorize?${spotifyScopes.toString()}}`

async function refreshAccessToken(token: JWT): Promise<JWT> {
    try {
        const basicAuth = Buffer.from(
            `${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!}:${process.env
                .NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET!}`
        ).toString('base64')
        const { data } = await axios.post(
            process.env.NEXT_PUBLIC_SPOTIFY_REFRESH_TOKEN_URL!,
            {
                grant_type: 'refresh_token',
                refresh_token: token.refreshToken,
            },
            {
                headers: {
                    Authorization: `Basic ${basicAuth}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        )
        return {
            ...token,
            accessToken: data.access_token,
            accessTokenExpires: Date.now() + data.expires_in * 1000,
        }
    } catch (error) {
        return {
            ...token,
            error: 'RefreshAccessTokenError',
        }
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        SpotifyProvider({
            clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!,
            clientSecret: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET!,
            authorization: authorizationUrl,
        }),
    ],
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async jwt({ token, account, user }) {
            if (account && user) {
                return {
                    accessToken: account.access_token,
                    refreshToken: account.refresh_token,
                    accessTokenExpires: account.expires_at * 1000,
                    user,
                }
            }
            if (
                token.accessTokenExpires &&
                Date.now() < token.accessTokenExpires
            ) {
                return token
            }
            const newToken = await refreshAccessToken(token)
            return newToken
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken
            session.error = token.error
            session.user = token.user
            return session
        },
    },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
