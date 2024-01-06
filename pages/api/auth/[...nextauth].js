import NextAuth from "next-auth"
import StravaProvider from "next-auth/providers/strava";

export const authOptions = {
  providers: [
    StravaProvider({
      clientId: process.env.STRAVA_CLIENT_ID,
      clientSecret: process.env.STRAVA_CLIENT_SECRET,
      authorization: { params: { scope: "read,activity:read" } },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.access_token = account.access_token
        token.refresh_token = account.refresh_token
        token.expires_at = account.expires_at
        token.athlete = account.athlete
      }

      const now = Date.now() / 1000;
      if (token.expires_at && now > token.expires_at) {
        console.log("expired")
        const url = `https://www.strava.com/oauth/token`;
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            client_id: process.env.STRAVA_CLIENT_ID,
            client_secret: process.env.STRAVA_CLIENT_SECRET,
            grant_type: 'refresh_token',
            refresh_token: token.refresh_token,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          token.access_token = data.access_token;
          token.refresh_token = data.refresh_token;
          token.expires_at = data.expires_at;
        }
      }

      return token
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      session.token = token
      return session
    }
  }
}

export default NextAuth(authOptions)