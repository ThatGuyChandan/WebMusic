require("dotenv").config();
const express = require("express");
const app = express();
const axios = require("axios");
const port = process.env.PORT;
const qs = require("qs");
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));

const clientId = process.env.Client_Id;
const clientSecret = process.env.Client_Secret;
//Token
async function getSpotifyToken() {
  const tokenUrl = "https://accounts.spotify.com/api/token";
  const data = {
    grant_type: "client_credentials",
  };
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization:
      "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
  };

  try {
    const response = await axios.post(tokenUrl, qs.stringify(data), {
      headers,
    });
    return response.data.access_token;
  } catch (error) {
    console.error("Error fetching token:", error.response.data);
    throw error;
  }
}
// artist
async function getArtist(token, artistID) {
  const artistUrl = `https://api.spotify.com/v1/artists/${artistID}`;
  const headers = { Authorization: `Bearer ${token}` };
  try {
    const response = await axios.get(artistUrl, { headers });
    return response.data;
  } catch (error) {
    console.error("Error fetching artist data:", error.response.data);
    throw error;
  }
}
//topTrack
async function getTopTracks(token, artistID) {
  const topTracksUrl = `https://api.spotify.com/v1/artists/${artistID}/top-tracks?country=US`; // Replace 'US' with desired country code
  const headers = { Authorization: `Bearer ${token}` };
  try {
    const response = await axios.get(topTracksUrl, { headers });
    return response.data.tracks;
  } catch (error) {
    console.error("Error fetching top tracks:", error.response.data);
    throw error;
  }
}

app.get("/artist/:id", async (req, res) => {
  const artistId = req.params.id;
  try {
    const token = await getSpotifyToken();
    const artistData = await getArtist(token, artistId);
    res.json(artistData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch artist data" });
  }
});

app.get("/artist/:id/top-tracks", async (req, res) => {
  const artistId = req.params.id;
  try {
    const token = await getSpotifyToken();
    const topTracks = await getTopTracks(token, artistId);
    res.json(topTracks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch top tracks" });
  }
});

app.get("/artists/{id}/top-tracks", (req, res) => {});

app.listen(port, () => {
  console.log(`connected to the port ${port}`);
});
