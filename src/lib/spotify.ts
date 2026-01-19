
/**
 * Gets an access token from the Spotify api using our refresh token
 * @returns {access_token: string} The access token
 */
const getAccessToken = async (): Promise<{ access_token: string }> => {

  const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

  if(!refresh_token)
    return { access_token: "" }

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
      ).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token,
    }),
  });

  return response.json();

};

/**
 * Gets the currently playing song from the Spotify api
 * Requires a live access token
 * 
 * @returns The currently playing song response
 */
export const currentlyPlayingSong = async () => {

  const { access_token } = await getAccessToken();

  return fetch("https://api.spotify.com/v1/me/player/currently-playing", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};